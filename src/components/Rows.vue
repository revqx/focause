<script setup lang="ts">
import { ref, computed } from "vue";

import { StatisticsRecord, Measurement } from "../types/types";

import { formatDistanceStrict } from 'date-fns';

const props = defineProps<{
    rows: Array<StatisticsRecord>,
    hasSubtitle?: boolean,
    metric?: Measurement
}>();

const initialRows = 2;
const stepSize = 4;

const shown = ref(initialRows);

const shownUnlocks = computed(() => {
    return props.rows.slice(0, shown.value);
})

const maxValue = computed(() =>
    Math.max(...shownUnlocks.value.map(e => e.value))
)

function formatDuration(milliseconds: number, metric?: Measurement) {
    if (metric === Measurement.Frequency) {
        return milliseconds;
    } else {
        let seconds = milliseconds / 1000;
        const hours = Math.floor(seconds / 360);
        seconds -= hours * 360;
        const minutes = Math.round(seconds / 60);
        return (hours ? hours.toString() + "h " : "") + minutes.toString() + "m";
    }
}
</script>

<template>
    <div v-for="(unlock, index) in shownUnlocks" :key="index" class="container">
        <template v-if="hasSubtitle">
            <span class="title-hasSubtitle">{{ unlock.title }}</span>
            <span class="subtitle">
                <span class="url">{{ unlock.subtitle }} – {{ formatDistanceStrict(unlock.value || 0, Date.now()) }} ago</span>
                <span class="time">{{ formatDuration(unlock.value, metric) }}</span>
            </span>
        </template>
        <template v-else>
            <span class="title">
                <span class="url">{{ unlock.title }}</span>
                <span class="time">{{ formatDuration(unlock.value, metric) }}</span>
            </span>
        </template>
        <span class="bar" :class="{ 'more-top-margin': hasSubtitle }"
            :style="{ width: unlock.value / maxValue * 100 + '%' }"> </span>
    </div>

    <button v-if="shown < rows.length" class="button" @click="() => shown = shown + stepSize">Show More</button>
    <button v-if="shown > initialRows" class="button" @click="() => shown = initialRows">Show Less</button>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    margin: 7px 0px 0px 0px;

}

.subtitle {
    display: flex;
    justify-content: space-between;
}

.subtitle span {
    line-height: 13px;
    font-size: 11px;
    opacity: 50%;
}

.subtitle .time {
    opacity: 100%;
}

.title {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    align-items: baseline;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.title-hasSubtitle {
    justify-content: space-between;
    flex-grow: 1;
    align-items: baseline;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.url {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 16px;
}

.title .time {
    opacity: 100%;
    line-height: 13px;
    white-space: nowrap;
}

.bar {
    margin: 4px 0 0 0;
    height: 2px;
    border-radius: 1px;
    background-color: white;
    transition: width 0.15s ease-out;
}

.bar.more-top-margin {
    margin-top: 6px;
}

.button {
    margin: 12px 8px 0 0;
    font-size: 13px;
    line-height: 13px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-family: inherit;
    color: inherit;
}

.button:focus-visible {
    font-style: italic;
    outline: none;
}

.button:hover {
    font-style: italic;
}
</style>