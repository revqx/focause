<script setup lang="ts">
import {ref} from "vue";

const value = ref(null);

</script>

<template>
<div>
    <input type="radio" id="radio1" name="radio" value="today" checked>
    <label for="radio1">Today</label>
    <input type="radio" id="radio2" name="radio" value="week" checked>
    <label for="radio2">Last 7 days</label>
    <input type="radio" id="radio3" name="radio" value="month" checked>
    <label for="radio3">Last 30 days</label>
    <input type="radio" id="radio4" name="radio" value="alltime" checked>
    <label for="radio4">All Time</label>
</div>
</template>

<style scoped>
div {
    display:flex;
    justify-content: space-between;
    margin: 8px 0px 0px 0px;
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