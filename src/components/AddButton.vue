<script setup lang="ts">
import { isValid } from 'date-fns';
import { ref, watch, computed } from 'vue';

import {BlockData} from "../types/types";

const content = ref("");
const inputRef = ref(null);
const isInputActive = ref(false);
const isSecondInputActive = ref(false);

const placeholder = computed(() => {
    return isInputActive.value ? "Enter the url to block" : "Enter the limit duration in minutes";
});

const isValidUrl = (urlString : string) => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}

const limit = ref<BlockData>({url: "", time: 0});

const props = defineProps({
    current : Boolean
});

const emits = defineEmits([
    'limit'
]);

const exitInput = () => {
    content.value = "";
    isInputActive.value = false;
    isSecondInputActive.value = false;
}

const handleClick = () => {
    if(!props.current) {
        isInputActive.value = true;
    }
    else {
        isInputActive.value = false;
        isSecondInputActive.value = true;
        if (chrome.tabs) {
            chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(([tab]) => {
                if (!(tab && tab.url)) {
                    console.error("Could not get currently active tab");
                    return;
                }
                limit.value.url = tab.url;
            });
        } else {
            console.error("Could not get active tab: not running as extension")
        }
    }
}

const submit = () => {
    if(isInputActive.value)  {
        if(!isValidUrl(content.value)) {
            alert("Invalid url");
            exitInput();
            return;
        }
        limit.value.url = content.value;
        isInputActive.value = false;
        isSecondInputActive.value = true;
        content.value = "";
    } else {
        if(isNaN(parseInt(content.value))) {
            alert("Invalid time");
            exitInput();
            return;
        }
        limit.value.time = parseInt(content.value) || limit.value.time;
        exitInput();
        emits("limit", limit.value);
    }
}

watch(isInputActive, () => {
    if (inputRef.value)
        (inputRef.value as HTMLInputElement).focus();
}, { flush: 'post' });

watch(isSecondInputActive, () => {
    if (inputRef.value)
        (inputRef.value as HTMLInputElement).focus();
}, { flush: 'post' });


</script>

<template>
    <div class="button-container">
        <Transition>
            <input v-if="isInputActive || isSecondInputActive" type="url" ref="inputRef" class="container" v-model="content" @keydown.enter="submit" @focusout="exitInput" :placeholder="placeholder">

            <button v-else class="container button" @click="handleClick">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M5 0C5.16576 0 5.32473 0.0658481 5.44194 0.183058C5.55915 0.300269 5.625 0.45924 5.625 0.625V4.375H9.375C9.54076 4.375 9.69973 4.44085 9.81694 4.55806C9.93415 4.67527 10 4.83424 10 5C10 5.16576 9.93415 5.32473 9.81694 5.44194C9.69973 5.55915 9.54076 5.625 9.375 5.625H5.625V9.375C5.625 9.54076 5.55915 9.69973 5.44194 9.81694C5.32473 9.93415 5.16576 10 5 10C4.83424 10 4.67527 9.93415 4.55806 9.81694C4.44085 9.69973 4.375 9.54076 4.375 9.375V5.625H0.625C0.45924 5.625 0.300269 5.55915 0.183058 5.44194C0.0658481 5.32473 0 5.16576 0 5C0 4.83424 0.0658481 4.67527 0.183058 4.55806C0.300269 4.44085 0.45924 4.375 0.625 4.375H4.375V0.625C4.375 0.45924 4.44085 0.300269 4.55806 0.183058C4.67527 0.0658481 4.83424 0 5 0Z"
                        fill="white" />
                </svg>
                <slot></slot>
            </button>
        </Transition>
    </div>
</template>

<style scoped>

.button-container {
    display: grid;
}

.container {
    margin: 0px 2px 8px 16px;
    box-sizing: border-box;
    display: flex;
}

::placeholder {
    color: var(--light-text);
    opacity: 0.3;
}

::ms-input-placeholder {
    color: white;
    opacity: 0.3;
}

button,
input {
    padding: 18px 18px 18px 18px !important;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 18px;
    font-size: 16px;
    cursor: pointer;
    transition: backdrop-filter 0.1s ease-in-out;
    background-color: rgba(17, 18, 19, 0.3);

    opacity: 1;
    grid-column: 1;
    grid-row: 1;
    text-align: center;
    outline: none;
    border: inherit;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    outline: none;
    
}


button.v-leave-active,
input.v-leave-active,
button.v-enter-active,
input.v-enter-active {
    transition: opacity 0.1s ease-out;
}

button.v-leave-from,
input.v-leave-from {
    opacity: 1;
}

button.v-leave-to,
input.v-leave-to {
    opacity: 0;
}

button.v-enter-from,
input.v-enter-from {
    opacity: 0;
}

button.v-enter-to,
input.v-enter-to {
    opacity: 1;
}

button:hover,
button:focus-visible {
    font-style: italic;
    outline: none;
}

.container > .heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
}

h3 {
    margin: 5px 0 0 0;
    font-weight: normal;
    font-style: italic;
    font-size: 16px;
    line-height: 1;
}

button svg {
    margin: 0 5px 0 0;
}
</style>