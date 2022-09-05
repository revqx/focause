<script setup lang="ts">
import { BlockData } from "../types/types";

import Card from "./Card.vue";
import Limits from "./Limits.vue";
import AddButton from "./AddButton.vue";
import { watch, ref, toRaw} from 'vue';
import type {Ref} from 'vue';

let initialValue = [
    { "url": "facebook.com", "time": 0 }
];

const limits : Ref<Array<BlockData>> = ref([]);

const handleNewLimits = (newLimits : Array<BlockData>) => {
    limits.value = newLimits;
}

if (chrome?.storage) {
    console.log("Read from chrome.storage");

    chrome.storage.sync.get( ["blockData"], (result)=>{
        console.log(result["blockData"]);
        if(!(result["blockData"] instanceof Array)){
            result["blockData"] = [];
        }
        limits.value = result["blockData"] || [];
    });

} else {
    console.log("Read from localStorage");

    const stored = window.localStorage.getItem("blockData");
    if(stored){
        initialValue = JSON.parse(stored);
    }
    limits.value = initialValue;
}

watch(limits, () => {
    if (chrome?.storage) {
        console.log("Written to chrome.storage");
        chrome.storage.sync.set({ "blockData": toRaw(limits.value) });
    } else {
        console.log("Written to localStorage");
        localStorage.setItem("blockData", JSON.stringify(toRaw(limits.value)));
    }
})

</script>
<template>

    <Card heading="Limits">
        <Limits v-if="limits.length > 0" :limits="limits" @new-limits="handleNewLimits"/>
        <div v-else class="empty-state">You don't have any limits, yet. Add some using the buttons below.</div>
    </Card>

    <!-- <Card :input="true" :button="true" @click.prevent="addLimit()" @focusout="step = 1" :step="step">
        Add current URL
    </Card>
    <Card :input="true" :button="true"  @submit="addLimit" @focusout="step = 1" :placeholder="placeholder" :step="step">
        Add other URL
    </Card> -->
    
    <div class="add-container">
        <AddButton :current="true" @limit="(limit) => limits = [...limits, limit]">
            Add current url
        </AddButton>
        <AddButton @limit="(limit) => limits = [...limits, limit]">
            Add other url
        </AddButton>
    </div>
    
</template>
<style scoped>

.empty-state {
    margin-top: 8px;
    line-height: 18px;
    font-size: 12px;
    white-space: pre-wrap;
}

</style>