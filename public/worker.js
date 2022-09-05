

// Contains the states a tab is currently in
const StateManager = {
    tabStates: null,

    setTabState: (tabId, state) => {
        try{
            const id = parseInt(tabId);
        } catch(exception){
            console.error("Tab id invalid: " + tabId);
        }

        if(state === null){
            delete StateManager.tabStates[tabId];
        }else {
            StateManager.tabStates[tabId] = state;
        }
        chrome.storage.local.set({ 'states': StateManager.tabStates });
    },

    /*
     * Returns the state of the tab with id 'tabId'. If tabId is null, it
     * returns all tab states
     */
    getTabState: async (tabId) => {
        if (!StateManager.tabStates) {
            await new Promise((resolve, reject) => {
                chrome.storage.local.get('states', (result) => {
                    console.log("Restored tabStates from disk: ");
                    console.log(result["states"]);
                    StateManager.tabStates = result["states"] || {};
                    resolve();
                })
            })
        }
        if(tabId) {
            return StateManager.tabStates[tabId];
        } else {
            return StateManager.tabStates;
        }
    },

    updateTabState: async (id, callback) => {
        return StateManager.setTabState(id, callback((await StateManager.getTabState(id))|| {}));
    }
}

function blockTab(tab) {
    StateManager.setTabState(tab.id, { state: "blocked", url: tab.url });
    console.log("Blocked tab " + tab.id);
    chrome.tabs.update(tab.id, { url: 'index.html' });
}


chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.tabs.get(parseInt(alarm.name), async (tab) => {
        console.log("Alarm occurred: " + alarm.name);
        // commit the session before the alarm to history, without a reason
        await closeSession(tab.id);

        // block the page, requesting a reason
        blockTab(tab);
    })
})


async function closeSession(tabId) {

    let state = await StateManager.getTabState(tabId);

    // Add the last active period to the duration
    if(state.activeSince > 0){
        state.duration += Date.now() - state.activeSince;
    }

    const unlock = {
        "url": state.url,
        "duration": state.duration,
        "started": state.started,
        "reason": state?.reason
    }

    console.log(unlock);

    StateManager.setTabState(tabId, null);

    // write to history
    chrome.storage.sync.get(["history"], (result) => {
        let currentValue = result.history || [];
        currentValue.push(unlock);
        chrome.storage.sync.set({ "history": currentValue }, () => {
            console.log("Wrote unlock to storage")
        });
    });

    console.log("Closed session: " + tabId);

}




function urlMatches(url, pattern){
    const re = /^https?:\/\/w?w?w?\.?/;
    url = url.replace(re, '');
    pattern = pattern.replace(re, '');

    return url.startsWith(pattern);
}

/*
 * Calculates the time until a given url gets blocked. 
 */
async function calcTimeLeft(url) {
    const statesPromise = StateManager.getTabState(null);
    return new Promise((resolve, reject)=> {
    chrome.storage.sync.get(["history", "blockData"], async (result)=> {
        let times = {}
        const hist = result["history"] || [];
        const blockData = result["blockData"] || [];
        console.log("History & blockData: ")
        console.log(hist)
        console.log(blockData)
        // calculate the times for today
        let pos = hist.length - 1;
        let midnight = new Date();
        midnight.setHours(0, 0);

        for(let limit of blockData){
            times[limit.url] = 0;
        }

        while(pos >= 0 && hist[pos].started > midnight.getTime() ){
            
            // add times to all blocks which match the url
            for(let limit of blockData){
                if(urlMatches(hist[pos].url, limit.url)){
                    times[limit.url] += hist[pos].duration;
                }
            }
            pos--;
        }

        // Count the times which were not yet written to history
        const tabStates = await statesPromise;
        for(const key in tabStates){
            const state = tabStates[key];

            if(state?.started < midnight.getTime()){
                continue; // This tab was not opened today and should not count
                          // towards todays times
            }

            let durationInTab = 0;
            if(state?.duration > 0){
                durationInTab += state.duration;
            }
            if(state?.activeSince > 0){
                durationInTab += Date.now() - state.activeSince;
            }

            for(let limit of blockData){
                if(urlMatches(state.url, limit.url)){
                    times[limit.url] += durationInTab;
                    console.log("Added " + durationInTab + "ms to " + limit.url + " as it is currently open/active")
                }
            }
        }

        console.log("Accumulated times:")
        console.log(times);
        let timeLeft = Infinity;
        for(let limit of blockData){
            if(urlMatches(url, limit.url)){
                timeLeft = Math.min(timeLeft, limit.time * 60 * 1000 - times[limit.url]);
            }
        }
        console.log("The url " + url + " has " + timeLeft + "ms left");
        resolve(timeLeft);
    })});
}


async function trackSiteTime(tab) {
    console.log("Tab time tracking setup: " + tab.id);
    await StateManager.updateTabState(tab.id, (state) => {
        state.activeSince = Date.now();
        state.started = Date.now();
        state.duration = 0;
        state.timeTracked = true;
        return state;
    });
}

/*
 * Registers an alert for a currently active tab, with the correct 
 * time left. If there is no time left, block the site immediately
 */
async function addAlarm(tab) {
    const state = await StateManager.getTabState(tab.id);
    if (state?.state === 'allowed') {
        console.log("Adding alert for tab " + tab.id);
        const timeLeft = await calcTimeLeft(state.url);
        if (timeLeft > 0) {
            console.log("Created an alarm for tab " + tab.id + " with " + timeLeft + "ms left.");
            chrome.alarms.create(tab.id.toString(), { when: Date.now() + timeLeft });
        } else {
            blockTab(tab);
        }
    }
}

/*
 * Cancels the alert for the given tab, e.g. because it was closed or  
 * because it went inactive.
 */
function cancelAlert(tab) {
    console.log("Canceled the alarm for tab " + tab.id);
    chrome.alarms.clear(tab.id);
}

/*
 * Called when a site on the block list got newly opened
 */
async function addSite(tab) {
    console.log("Adding tab " + tab.id);

    await StateManager.setTabState(tab.id,
        {
            state: "allowed",
            url: tab.url
        });
    await trackSiteTime(tab);
    await addAlarm(tab);
}

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    const state = (await StateManager.getTabState(tabId))?.state
    if (state === "unlocked" || state === "allowed") {
        cancelAlert(tabId);
        closeSession(tabId);
    }
});

async function isOnBlockList(tab) {
    return new Promise((resolve, reject) =>
        chrome.storage.sync.get("blockData", (result) => {
            for (const limit of result["blockData"]) {
                if (tab.pendingUrl?.includes(limit.url) || tab.url.includes(limit.url)) {
                    resolve(true);
                    return;
                }
            }
            resolve(false);
        }));
}

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    let unlocked = false;
    let state = await StateManager.getTabState(tabId);
    if (state?.state === "unlocked" || state?.state === "allowed") {
        unlocked = true;
        const url = (tab.pendingUrl || tab.url);

        // the url has changed
        if (url && (url !== state.url)) {
            // allow navigations up to 10 seconds after unlock as the 
            // website might redirect during load
            if (Date.now() - state.started < 10000) {
                state['url'] = url; // remember the new, redirected url
                StateManager.setTabState(tabId, state);

            } else {
                // tab navigates away from unlocked site --> stop last session
                await closeSession(tabId);
                unlock = false;
            }
        }
    }

    if (!unlocked && await isOnBlockList(tab)) {
        addSite(tab);
    }
});

/*
 * Manages both time tracking and alarms
 */
chrome.tabs.onActivated.addListener(async (info) => {
    const { tabId, windowId } = info;
    let state = await StateManager.getTabState(tabId);
    if (state && state?.activeSince === 0) {
        // tab went active again -> start timer
        state.activeSince = Date.now();
        StateManager.setTabState(tabId, state);
        addAlarm({ id: tabId });

        console.log("tab went active:" + state.url);
        
    }

    chrome.tabs.query({ windowId: windowId }, async (tabs) => {
        for (let tab of tabs) {
            let state = await StateManager.getTabState(tab.id);
            if (tab.id != tabId && state && state?.activeSince !== 0) {
                // tab went inactive -> stop timer
                state.duration += Date.now() - state.activeSince;
                state.activeSince = 0;
                cancelAlert(tab);
                StateManager.setTabState(tab.id, state);
                console.log("tab went inactive:" + state.url);
            }
        }
    });
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (!request.reason) {
        // The request was not an unlock from the blocking page
        return;
    }
    const state = await StateManager.getTabState(sender.tab.id);

    if (state?.state !== "blocked") {
        // The tab was not blocked
        return;
    }

    // Update the internal tab state
    await StateManager.setTabState(sender.tab.id, {
        state: "unlocked",
        reason: request.reason,
        url: state.url
    });

    await trackSiteTime(sender.tab);

    // Forward to the remembered url
    chrome.tabs.update(sender.tab.id, { url: state.url });

    console.log("Unlocked " + state.url);
    sendResponse("Unlock succeeded");
});

chrome.runtime.onStartup.addListener(() => {
    console.log("Local storage cleared");
    chrome.storage.local.clear();
})