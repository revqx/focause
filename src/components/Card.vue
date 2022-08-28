<script setup lang="ts">
const props = defineProps({
    heading: String,
    button: Boolean
})
</script>

<template>
    <section :class="{ button: button }" >
        <h3 v-if="heading">{{ heading }}</h3>
        <svg v-if="button" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5 0C5.16576 0 5.32473 0.0658481 5.44194 0.183058C5.55915 0.300269 5.625 0.45924 5.625 0.625V4.375H9.375C9.54076 4.375 9.69973 4.44085 9.81694 4.55806C9.93415 4.67527 10 4.83424 10 5C10 5.16576 9.93415 5.32473 9.81694 5.44194C9.69973 5.55915 9.54076 5.625 9.375 5.625H5.625V9.375C5.625 9.54076 5.55915 9.69973 5.44194 9.81694C5.32473 9.93415 5.16576 10 5 10C4.83424 10 4.67527 9.93415 4.55806 9.81694C4.44085 9.69973 4.375 9.54076 4.375 9.375V5.625H0.625C0.45924 5.625 0.300269 5.55915 0.183058 5.44194C0.0658481 5.32473 0 5.16576 0 5C0 4.83424 0.0658481 4.67527 0.183058 4.55806C0.300269 4.44085 0.45924 4.375 0.625 4.375H4.375V0.625C4.375 0.45924 4.44085 0.300269 4.55806 0.183058C4.67527 0.0658481 4.83424 0 5 0Z"
                fill="white" />
        </svg>
        <slot></slot>
    </section>
</template>

<style scoped>

section {
    padding: 12px 14px 12px 14px;
    margin: 0px 2px 16px 16px;
    color: var(--light-text);
    background-color: rgba(17, 18, 19, 0.3);
    backdrop-filter: blur(16px);
    border-radius: 10px;
    box-sizing: border-box;
}

section.button {
    padding: 16px 14px 16px 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 18px;
    font-size: 15px;
    cursor: pointer;
    transition: backdrop-filter 0.1s ease-in-out;
}

section.button:hover {
    backdrop-filter: blur(32px);
}

h3 {
    margin: 0 0 -3px 0;
    font-weight: normal;
    font-style: italic;
    font-size: 16px;
    line-height: 1;
}

section.button svg {
    margin: 0 5px 0 0;
}

section.button {
    cursor: pointer;
}
</style>