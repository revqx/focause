<script setup lang="ts">
import {ref} from "vue";
import Brand from "./components/Brand.vue";
import Shortcut from "./components/Shortcut.vue";
import { Unlock } from "./types/types";
const text = ref("");

const submit = (recent : string | undefined) => {
    if(recent !== "") {
        chrome.runtime.sendMessage({reason: recent});
    }
    else {
        chrome.runtime.sendMessage({reason: text.value});
    }
};

// calculate recent unlocks

const sortByStarted = (a : Unlock, b : Unlock) => {
    return Number(a.started > b.started) - Number(a.started < b.started);
};

let hist = ref<Array<Unlock>>([]);
let states = ref<Array<Unlock>>([]);
let recents : Array<Unlock> = [];

if(!chrome.storage) {
    hist = ref<Array<Unlock>>([
        {
            url: "facebook.com",
            started: Date.now() - 2000000000,
            duration: 551900,
            reason: "communicate with my aunt"
        },
        {
            url: "stackoverflow.com",
            started: Date.now() - 500000000,
            duration: 1608000,
            reason: "create google 2.0"
        },
        {
            url: "facebook.com",
            started: Date.now() - 500000000,
            duration: 207,
            reason: "communicate with my aunt"
        }
    ]);
    states = ref<Array<Unlock>>([
        {
            url: "facebook.com",
            started: Date.now() - 100000,
            reason: "communicate with my aunt 1",
            duration: 0
        },
        {
            url: "stackoverflow.com",
            started: Date.now() - 1200000,
            reason: "create google 2.0 2",
            duration: 0
        },
        {
            url: "facebook.com",
            started: Date.now() - 1400000,
            reason: "communicate with my aunt 3",
            duration: 0
        }
    ]);
}

const modal = ref<HTMLDivElement | null>(null);

const onEnter = () => {
    modal.value?.focus();
}


if (chrome?.storage) {

    chrome.storage.sync.get(["history"], (result) => {
        hist.value = result["history"];
    })
    chrome.storage.local.get('states', (result) => {
        console.log("Restored tabStates from disk: ");
        console.log(result["states"]);
        states.value = result["states"] || {};
    });

    hist.value.concat(states.value).sort(sortByStarted).forEach((x) => {
        let d : Boolean = false;
        recents.forEach((y) => {
            if(x.reason === y.reason)
                d = true;
        })
        if(!d)
            recents.push(x);
    });
    console.log(recents);
}
else {
    hist.value.concat(states.value).sort(sortByStarted).forEach((x) => {
        let d : Boolean = false;
        recents.forEach((y) => {
            if(x.reason === y.reason)
                d = true;
        })
        if(!d)
            recents.push(x);
    });
}


</script>

<template>
    <!-- <video playsinline autoplay muted loop poster="background.webp" id="bgvid">
        <source src="background.mp4" type="video/mp4">
    </video> -->
    <div class="main-container">
        <div class="main">
            <svg class="lock" width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M4.8 7.2V12H2.4C1.07452 12 0 13.0745 0 14.4V27.6C0 28.9255 1.07452 30 2.4 30H22.8C24.1255 30 25.2 28.9255 25.2 27.6V14.4C25.2 13.0745 24.1255 12 22.8 12H20.4V7.2C20.0821 3.17066 16.7111 0 12.6 0C8.48898 0 5.11795 3.17066 4.8 7.2ZM12.6 2.4C15.3846 2.4 17.6791 4.49831 17.9885 7.2H18V12H7.2V7.2H7.21152C7.52098 4.49831 9.81545 2.4 12.6 2.4Z"
                    fill="white" />
            </svg>

            <span class="quote">Live on <span style="font-style: italic;">purpose.</span></span>
            <div class="outer-container">
                <div class="input-container">
                    <input v-model="text" placeholder="What are you up to?" autofocus spellcheck="false"
                        @keydown.enter="submit('')" />
                    <div v-if="text.length" class="press-enter-container">
                        <span class="press-enter-span">
                            press
                            <Shortcut text="Enter" />
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            className="bi bi-arrow-return-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z" />
                        </svg>
                    </div>

                </div>
                <div class="reasons-container" v-for="reason in recents.slice(0, 3)">
                    <button class="reason" @click="submit(reason.reason)">
                        {{ reason.reason }}
                    </button>
                </div>
            </div>


        </div>
        <Brand class="brand" />
    </div>
</template>

<style scoped>

video {
    object-fit: cover;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
}

.reasons-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 800px;
}

.reason {
    background-color: rgba(17, 18, 19, 0.35);
    padding: 12px 12px 12px 14px;
    margin-top: 12px;
    text-align: center;
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 19px;
    font-family: inherit;
    border: none;
    cursor: pointer;
    color: inherit;
    display: flex;
}

.shortcut {
    margin-right: 14px;
}

.reason:focus-visible {
    outline: none;
    font-style: italic;
}

.reason:hover {
    font-style: italic;
}

.main-container {
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.outer-container {
    width: 100%;
}

.input-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 15px 17px 15px 17px;
    margin-top: 8vh;
    font-size: 24px;
    border-radius: 10px;
    background-color: rgba(17, 18, 19, 0.35);
    box-sizing: border-box;
}

.press-enter-container {
    display: flex;
    align-items: center;
    margin-left: 10px;
}

.press-enter-container svg {
    height: 14px;
    width: 14px;
    color: white;
}

.press-enter-container svg path {
    stroke: white;
    stroke-width: 0.25px;
}

.press-enter-span {
    color: white;
    white-space: nowrap;
    margin-right: 4px;
    font-size: 15px;
}

.lock {
    width: 24px;
    margin-top: 16vh;
}

.main {
    max-width: 800px;
    position: absolute;
    top: 36vh;
    left: 50vw;
    display: flex;
    align-items: center;
    flex-direction: column;
    transform: translate(-50%, -50%);
    font-size: 26px;
    width: 100%;
    padding: 16px;
}

.quote {
    margin-top: 2.5vh;
}

input {
    flex-grow: 1;
    font-size: 24px;
    border: none;
    color: var(--light-text);
    background-color: transparent;
    box-sizing: border-box;
    outline: none;
}

::placeholder {
    color: var(--light-text);
    opacity: 0.3;
}

::ms-input-placeholder {
    color: white;
    opacity: 0.3;
}

.brand {
    height: 30px;
    position: absolute;
    bottom: 32px;
}
</style>
