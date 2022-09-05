<script setup lang="ts">
import {ref, watchEffect, watch} from "vue";
import { TimeSpan } from "../types/types";

const props = defineProps<{modelValue: TimeSpan}>();


const value = ref(props.modelValue);

const emit = defineEmits(['update:modelValue'])

watch(value, (newVal)=> {
    emit('update:modelValue', newVal);
});
const randomId = Math.floor(Math.random()*100000);

</script>

<template>
<div>
    <input type="radio" :id="'radio1'+randomId" name="radio" :value="TimeSpan.day" v-model="value" checked>
    <label :for="'radio1'+randomId">Today</label>
    <input type="radio" :id="'radio2'+randomId" name="radio" :value="TimeSpan.week" v-model="value">
    <label :for="'radio2'+randomId">Last 7 days</label>
    <input type="radio" :id="'radio3'+randomId" name="radio" :value="TimeSpan.month" v-model="value">
    <label :for="'radio3'+randomId">Last 30 days</label>
    <input type="radio" :id="'radio4'+randomId" name="radio" :value="TimeSpan.allTime" v-model="value">
    <label :for="'radio4'+randomId">All Time</label>
</div>
</template>

<style scoped>
div {
    display:flex;
    justify-content: space-between;
    margin: 12px 0px 0px 0px;
}
label {
    font-size: 11px;
    line-height: 13px;
    cursor:pointer;
}

input[type="radio"]{
    display: none;
}

input[type="radio"]:checked+label{
    font-style: italic;
}
</style>