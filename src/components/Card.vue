<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps({
    heading: String,
    button: Boolean,
    input: Boolean,
    placeholder: String
})

const emit = defineEmits(['submit'])

const component = computed(() => props.button ? 'button' : 'section')

const content = ref("");

const inputActivated = ref(false);

const inputRef = ref(null);

watch(inputActivated, () => {
    if (inputRef.value)
        (inputRef.value as HTMLInputElement).focus();
}, { flush: 'post' });

const click = () => {
    inputActivated.value = true;
}

const leave = () => {
    inputActivated.value = false;
    content.value = "";
}

const enter = () => {
    emit("submit", content.value);
    leave();
}


</script>

<template>
    <div v-if="props.button" class="button-container">
        <Transition>
            <input v-if="props.input && inputActivated" ref="inputRef" class="container" v-model="content" @keydown.enter="enter" @focusout="leave" :placeholder="placeholder">

            <button v-else class="container button" @click="click">
                <svg v-if="button" width="10" height="10" viewBox="0 0 10 10" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M5 0C5.16576 0 5.32473 0.0658481 5.44194 0.183058C5.55915 0.300269 5.625 0.45924 5.625 0.625V4.375H9.375C9.54076 4.375 9.69973 4.44085 9.81694 4.55806C9.93415 4.67527 10 4.83424 10 5C10 5.16576 9.93415 5.32473 9.81694 5.44194C9.69973 5.55915 9.54076 5.625 9.375 5.625H5.625V9.375C5.625 9.54076 5.55915 9.69973 5.44194 9.81694C5.32473 9.93415 5.16576 10 5 10C4.83424 10 4.67527 9.93415 4.55806 9.81694C4.44085 9.69973 4.375 9.54076 4.375 9.375V5.625H0.625C0.45924 5.625 0.300269 5.55915 0.183058 5.44194C0.0658481 5.32473 0 5.16576 0 5C0 4.83424 0.0658481 4.67527 0.183058 4.55806C0.300269 4.44085 0.45924 4.375 0.625 4.375H4.375V0.625C4.375 0.45924 4.44085 0.300269 4.55806 0.183058C4.67527 0.0658481 4.83424 0 5 0Z"
                        fill="white" />
                </svg>
                <slot></slot>
            </button>
        </Transition>
    </div>
    <component v-else :is="component" :class="{ container: true, button: button }">
        <div class="heading">
            <h3 v-if="heading">{{ heading }}</h3>
            <slot name="heading"></slot>
        </div>

        <slot></slot>
    </component>
</template>

<style scoped>
.button-container {
    display: grid;
}

.container {
    padding: 16px 14px 10px 14px;
    margin: 0px 2px 8px 16px;
    color: var(--light-text);
    background-color: rgba(17, 18, 19, 0.3);
    backdrop-filter: blur(16px);
    border-radius: 10px;
    box-sizing: border-box;


    font-style: inherit;
    font-family: inherit;
    border: none;
    
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
    font-weight: normal;
    font-style: italic;
    font-size: 16px;
    line-height: 1;
}

button svg {
    margin: 0 5px 0 0;
}
</style>