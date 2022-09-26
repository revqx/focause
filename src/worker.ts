interface BaseState {
    url: string;
    activeSince: number;
    duration: number;
    started: number;
    paused: boolean;
}

interface NotUnlockedState extends BaseState {
    state: "allowed"
}

interface BlockedState extends BaseState {
    state: "blocked";
    paused: true;
}

interface UnlockedState extends BaseState {
    state: "unlocked"
    reason: string;
}

type State = UnlockedState | NotUnlockedState | BlockedState;

interface HistoryItem {
    url: string,
    reason?: string,
    started: number,
    duration: number
}

const initialValue: Record<string, string> = {};
// Contains the states a tab is currently in
const StateManager = {
    tabStates: ((): Record<number, State> => ({}))(), // function just to add the correct type to tabStates

    setTabState: (tabId: number, state: State | null) => {

        if (state === null) {
            delete StateManager.tabStates[tabId];
        } else {
            StateManager.tabStates[tabId] = state;
        }
        chrome.storage.local.set({ 'states': StateManager.tabStates });
    },

    getAllTabStates: async () => {
        if (!StateManager.tabStates) {
            await new Promise<void>((resolve, reject) => {
                chrome.storage.local.get('states', (result) => {
                    console.log("Restored tabStates from disk: ");
                    console.log(result["states"]);
                    StateManager.tabStates = result["states"] || {};
                    resolve();
                })
            })
        }
        return StateManager.tabStates;
    },
    /*
     * Returns the state of the tab with id 'tabId'. If tabId is null, it
     * returns all tab states
     */
    getTabState: async (tabId: number) => {

        const states = StateManager.getAllTabStates()
        return StateManager.tabStates[tabId];
    },

    updateTabState: async (id: number, callback: (oldState: State) => State) => {
        return StateManager.setTabState(id, callback((await StateManager.getTabState(id)) || {}));
    }
}

/*
 *  Blocks the tab 
 *   -> shows the blocking screen and pauses the time tracking and updates state
 */
function blockTab(tab: { id?: number, url?: string }) {
    if (!tab.id || !tab.url)
        return;


    StateManager.updateTabState(tab.id, (oldState) => ({
        ...oldState,
        state: "blocked",
        url: tab.url!,
        paused: true
    }));

    console.log("Blocked tab " + tab.id);
    chrome.tabs.update(tab.id, { url: 'index.html' });
}


chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.tabs.get(parseInt(alarm.name), async (tab) => {

        console.log("Alarm occurred: " + alarm.name);
        // commit the session before the alarm to history, without a reason
        if (!tab.id)
            return;
        await closeSession(tab.id);

        // block the page, requesting a reason
        blockTab(tab);
    })
})


async function closeSession(tabId: number) {

    let state = await StateManager.getTabState(tabId);

    // Add the last active period to the duration
    if (state.activeSince > 0) {
        state.duration += Date.now() - state.activeSince;
    }

    const unlock: HistoryItem = {
        "url": state.url,
        "duration": state.duration,
        "started": state.started,
        "reason": state?.reason,
        "limit": await isOnBlockList(state.url) || state.url
    }

    console.log(unlock);


    StateManager.setTabState(tabId, null);

    // write to history
    chrome.storage.local.get(["history"], (result) => {
        let currentValue = result.history || [];
        currentValue.push(unlock);
        chrome.storage.local.set({ "history": currentValue }, () => {
            console.log("Wrote unlock to storage")
        });
    });

    console.log("Closed session: " + tabId);

}




function urlMatches(url: string, pattern: string) {
    const re = /^https?:\/\/w?w?w?\.?/;
    url = url.replace(re, '');
    pattern = pattern.replace(re, '');

    return url.startsWith(pattern);
}

import type { BlockData } from "./types/types";

/*
 * Calculates the time until a given url gets blocked. 
 */
async function calcTimeLeft(url: string): Promise<number> {
    const statesPromise = StateManager.getAllTabStates();
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["history", "blockData"], async (result) => {
            let times: Record<string, number> = {}
            
            const hist: HistoryItem[] = result["history"] || [];
            const blockData: BlockData[] = result["blockData"] || [];

            console.log("History & blockData: ")
            console.log(hist)
            console.log(blockData)
            // calculate the times for today
            let pos = hist.length - 1;
            let midnight = new Date();
            midnight.setHours(0, 0);

            for (let limit of blockData) {
                times[limit.url] = 0;
            }

            while (pos >= 0 && hist[pos].started > midnight.getTime()) {

                // add times to all blocks which match the url
                for (let limit of blockData) {
                    if (urlMatches(hist[pos].url, limit.url)) {
                        times[limit.url] += hist[pos].duration;
                    }
                }
                pos--;
            }

            // Count the times which were not yet written to history
            const tabStates = await statesPromise;
            for (const key in tabStates) {
                const state = tabStates[key];

                if (state.started < midnight.getTime()) {
                    continue; // This tab was not opened today and should not count
                    // towards todays times
                }

                let durationInTab = 0;
                if (state?.duration > 0) {
                    durationInTab += state.duration;
                }
                if (state?.activeSince > 0) {
                    durationInTab += Date.now() - state.activeSince;
                }

                for (let limit of blockData) {
                    if (urlMatches(state.url, limit.url)) {
                        times[limit.url] += durationInTab;
                        console.log("Added " + durationInTab + "ms to " + limit.url + " as it is currently open/active")
                    }
                }
            }

            console.log("Accumulated times:")
            console.log(times);
            let timeLeft: number = Infinity;
            for (let limit of blockData) {
                if (urlMatches(url, limit.url)) {
                    timeLeft = Math.min(timeLeft, limit.time * 60 * 1000 - times[limit.url]);
                }
            }
            console.log("The url " + url + " has " + timeLeft + "ms left");
            resolve(timeLeft);
        })
    });
}

/*
 * Registers an alert for a currently active tab, with the correct 
 * time left. If there is no time left, block the site immediately
 */
async function addAlarm(tab: { id?: number }) {
    const state = await StateManager.getTabState(tab.id!);

    if (state?.state === 'allowed') {
        console.log("Adding alert for tab " + tab.id);
        const timeLeft = await calcTimeLeft(state.url);
        if (timeLeft > 0) {
            console.log("Created an alarm for tab " + tab.id + " with " + timeLeft + "ms left.");
            chrome.alarms.create(tab.id!.toString(), { when: Date.now() + timeLeft });
        } else {
            blockTab(tab);
        }
    }
}

/*
 * Cancels the alert for the given tab, e.g. because it was closed or  
 * because it went inactive.
 */
function cancelAlert(tabId : number) {
    console.log("Canceled the alarm for tab " + tabId);
    if (tabId) {
        chrome.alarms.clear(String(tabId));
    }
}

/*
 * Called when a site on the block list got newly opened
 */
async function addSite(tab: chrome.tabs.Tab) {
    console.log("Adding tab " + tab.id);

    await StateManager.setTabState(tab.id!,
        {
            state: "allowed",
            url: tab.url!,
            started: Date.now(),
            paused: false,
            activeSince: Date.now(),
            duration: 0
        });
    await addAlarm(tab);
}

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    const state = (await StateManager.getTabState(tabId))?.state
    if (state === "unlocked" || state === "allowed") {
        cancelAlert(tabId);
        closeSession(tabId);
    }
});


/*
 * Checks, wether the given tab is on the block list. If it is, it returns
 * the url it matched against, otherwise it returns 'false'
 */
async function isOnBlockList(tab) {
    return new Promise((resolve, reject) =>
        chrome.storage.sync.get("blockData", (result) => {
            for (const limit of result["blockData"]) {
                if (urlMatches((tab?.pendingUrl || tab?.url) || tab, limit.url)) {
                    resolve(limit.url);
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
            if (Date.now() - state.started < 180000) {
                state['url'] = url; // remember the new, redirected url
                StateManager.setTabState(tabId, state);

            } else {
                // tab navigates away from unlocked site --> stop last session
                await closeSession(tabId);
                unlocked = false;
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
    if (state && state.activeSince === 0) {
        // tab went active again -> start timer
        state.activeSince = Date.now();
        StateManager.setTabState(tabId, state);
        addAlarm({ id: tabId });

        console.log("tab went active:" + state.url);

    }

    chrome.tabs.query({ windowId: windowId }, async (tabs) => {
        for (let tab of tabs) {
            if (!tab.id)
                continue;
            let state = await StateManager.getTabState(tab.id);
            if (tab.id != tabId && state && state?.activeSince !== 0) {
                // tab went inactive -> stop timer
                state.duration += Date.now() - state.activeSince;
                state.activeSince = 0;
                cancelAlert(tab.id);
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
    if (!sender?.tab?.id)
        return;

    const state = await StateManager.getTabState(sender.tab.id);

    if (state.state !== "blocked") {
        // The tab was not blocked
        return;
    }

    // Update the internal tab state
    await StateManager.updateTabState(sender.tab.id,
        (oldState: State) => ({
            ...oldState,
            reason: request.reason,
            state: "unlocked"
        })
    );

    // Forward to the remembered url
    chrome.tabs.update(sender.tab.id, { url: state.url });

    console.log("Unlocked " + state.url);
    sendResponse("Unlock succeeded");
});

chrome.runtime.onStartup.addListener(() => {
    console.log("Local storage cleared");
    chrome.storage.local.clear();
})

export { }