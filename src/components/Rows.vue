<script setup lang="ts">
import { ref, computed } from "vue";
interface Unlock {
    website: String,
    reason: String,
    duration: number
}

const props = defineProps({
    rows: { type: Array<Unlock>, required: true },
    hasSubtitle: {type: Boolean}
});

const shown = ref(2);

const shownUnlocks = computed(() => {
    return props.rows.slice(0, shown.value);
})

const maxDuration = computed(() =>
    Math.max(...shownUnlocks.value.map(e => e.duration))
)

</script>

<template>
    <div v-for="(unlock, index) in shownUnlocks" :key="index" class="container">
        <template v-if="hasSubtitle">
            <span class="title">{{ unlock.reason }}</span>
            <span class="subtitle">
                <span>{{ unlock.website }} | 1 day ago </span>
                <span class="time">{{ unlock.duration }}s</span>
            </span>
        </template>
        <template v-else>
            <span class="title">
                <span>{{unlock.reason}}</span>
                <span class="time">{{ unlock.duration }}s</span>
            </span>
        </template>
        <span class="bar" :style="{width: unlock.duration/maxDuration * 100 + '%'}"> </span>
    </div>

    <span v-if="shown >= rows.length" class="button" @click="() => shown = 2">Show Less</span>
    <span v-else class="button" @click="() => shown = shown + 5">Show More</span>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    margin: 11px 0px 0px 0px;
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
    align-items: baseline;
}
.title .time  {
    opacity: 100%;
    line-height: 13px;
    font-size: 11px;
}

.bar {
    margin: 2px 0 0px 0;
    height: 2px;
    border-radius: 1px;
    background-color: white;
    transition: width 0.15s ease-out;
}

.button {
    font-size: 13px;
    line-height: 13px;
    cursor: pointer;
}
</style>