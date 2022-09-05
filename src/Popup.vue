<script lang ="ts" setup>
import Brand from './components/Brand.vue';
import Rows from './components/Rows.vue';
import TabSelect from './components/TabSelect.vue';
import Card from "./components/Card.vue";
import LimitsPage from "./components/LimitsPage.vue";

import { ref, computed } from 'vue';
import { Unlock, TimeSpan, Measurement , StatisticsRecord} from "./types/types";

const isMenuActive = ref(false);

enum Page {
    Dashboard,
    Limits
}

const currentPage = ref<Page>(Page.Dashboard);

function toggleMenu() {
    isMenuActive.value = !isMenuActive.value;
}

let unlocks = ref<Array<StatisticsRecord>>([]);
if(!chrome.storage) {
    let unlocks = ref<Array<StatisticsRecord>>([
        {
            subtitle: "facebook.com",
            started: Date.now() - 20000000000,
            value: 551900,
            title: "communicate with my aunt"
        },
        {
            subtitle: "stackoverflow.com",
            started: Date.now() - 500000000,
            value: 1608000,
            title: "create google 2.0"
        },
        {
            subtitle: "facebook.com",
            started: Date.now() - 500000000,
            value: 207,
            title: "communicate with my aunt"
        },
        {
            subtitle: "youtube.com",
            started: Date.now() - 100000000,
            value: 100000,
            title: "communicate with my aunt"
        }, {
            subtitle: "youtube.comasldkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
            started: Date.now(),
            value: 100000,
            title: "communicate with my aunt aunt aunt aunt aunt aunt aunt"
        },]);

    unlocks.value.reverse();
}

const modal = ref<HTMLDivElement | null>(null);

const onEnter = () => {
    modal.value?.focus();
}
if (chrome?.storage) {
    chrome.storage.sync.get(["history"], (result) => {
        let hist: Array<Unlock> = result["history"];
        hist.reverse();
        unlocks.value = hist.map(old => {
            return {title: old.reason, 
                subtitle: old.url.replace(/^https?:\/\/w?w?w?\.?/, ''), 
                value: old.duration, 
                started: old.started}});
    })
}

const measureBy = ref<Measurement>(Measurement.Frequency);

const tabValueSites = ref<TimeSpan>(TimeSpan.week);
const tabValueReasons = ref<TimeSpan>(TimeSpan.week);

function accumulate(list: Array<StatisticsRecord>, since: TimeSpan, groupBy: string, metric: Measurement) {
    let times: { [key: number]: number; } = {};
    times[TimeSpan.day] = 1000 * 60 * 60 * 24;
    times[TimeSpan.week] = 1000 * 60 * 60 * 24 * 7;
    times[TimeSpan.month] = 1000 * 60 * 60 * 24 * 30;
    times[TimeSpan.allTime] = Date.now();
    let start = Date.now() - times[since];

    const totals: Record<string, number> = {};

    for (let unlock of list) {
        if ((unlock.started || 0) > start) {
            const key = groupBy === "url" ? unlock.subtitle : unlock.title;
            if (key)
                totals[key] = (totals[key] || 0) + (metric === Measurement.Frequency ? 1 : unlock.value);
        } else {
            break; // Assume the unlocks are ordered by time -> don't iterate over full history
        }
    }
    let rows = [];
    for (let url in totals) {
        rows.push({ title: url.replace(/^https?:\/\/w?w?w?\.?/, ''), value: totals[url] });
    }
    rows.sort((a, b) => b.value - a.value);
    return rows;
}
const timeSpent = computed(() => {
    return accumulate(unlocks.value, tabValueSites.value, "url", Measurement.Time);
});

const reasons = computed(() => {
    return accumulate(unlocks.value, tabValueReasons.value, "reason", measureBy.value);
})


</script>

<template>
    <Transition @enter="onEnter">
        
        <nav ref="modal" tabindex="0" v-if="isMenuActive" :class="{ active: isMenuActive }"
            @keydown.esc="isMenuActive && (isMenuActive = false)">
            <ul class="menu-container">
                <li class="menu-item">
                    <a href="#" @click="currentPage = Page.Dashboard; isMenuActive = false"
                        :class="{ 'current': currentPage === Page.Dashboard }">Dashboard</a>
                </li>
                <li class="menu-item">
                    <a href="#" @click="currentPage = Page.Limits; isMenuActive = false"
                        :class="{ 'current': currentPage === Page.Limits }">Limits</a>
                </li>
                <!-- <li class="menu-item">
                    <a href="#" @click="currentPage = Page.Settings; isMenuActive = false"
                        :class="{ 'current': currentPage === Page.Settings }">Settings</a>
                </li> -->
                <!-- <li class="menu-item">
                    <a href="#" @click="currentPage = Page.Shortcuts; isMenuActive = false"
                        :class="{ 'current': currentPage === Page.Shortcuts }">Shortcuts</a>
                </li> -->
            </ul>
        </nav>
    </Transition>
    <header>
        <div class="menu-icon-container" :class="{ active: isMenuActive }" @click.prevent="toggleMenu">
            <div class="menu-icon">
                <span class="line-1"></span>
                <span class="line-2"></span>
            </div>
        </div>
        <Brand class="logo" />
    </header>

    <div class="body" :class="{ 'active': isMenuActive }">
        <LimitsPage v-if="currentPage === Page.Limits" />
        
        <Card v-if="false" heading="Settings">
            <Settings />
        </Card>

        
        <Card v-if="currentPage === Page.Dashboard" :button="true" @click.prevent="currentPage = Page.Limits">
            Add limit
        </Card>
        <Card v-if="currentPage === Page.Dashboard" heading="Time Spent">
            <TabSelect v-model="tabValueSites" />
            <Rows :rows="timeSpent" />
        </Card>
        <Card v-if="currentPage === Page.Dashboard" heading="Reasons">
            <template v-slot:heading>
                <button
                    @click="measureBy = (measureBy === Measurement.Time ? Measurement.Frequency : Measurement.Time)">Measure
                    by {{ measureBy === Measurement.Time ? "time" : "frequency" }}</button>
            </template>
            <TabSelect v-model="tabValueReasons" />
            <Rows v-if="reasons.length > 0" :rows="reasons" :metric="measureBy" />

            <div v-else class="empty-state">You have not entered any reasons yet. </div>
        </Card>
        <Card v-if="currentPage === Page.Dashboard" heading="Recent unlocks">
            <Rows :has-subtitle="true" :rows="unlocks.filter(unlock => unlock.title)" />
        </Card>
        


    </div>
</template>

<style scoped>
header {
    padding: 16px;
    display: flex;
    top: 0;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    font-size: 16px;
    overflow: hidden;
}

.body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    height: calc(100% - 56px);
    overflow-y: scroll;
    scrollbar-gutter: stable;
    padding: 0 -10px 0 0px;
    outline: none;
}

.body.active {
    z-index: -1;
}

.logo {
    z-index: 1;
    height: 24px;
}

nav {
    z-index: 1;
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    display: flex;
    justify-content: center;
    background-color: rgba(29, 29, 30, 0.6);
    backdrop-filter: blur(16px);
    opacity: 1;
    transition: opacity 200ms ease-out;
    font-size: 16px;
    outline: none;
}

nav.v-enter-from,
nav.v-leave-to {
    opacity: 0;
}

nav .menu-container {
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.menu-icon-container {
    position: absolute;
    left: 16px;
    z-index: 1;
    width: 16px;
    height: 16px;
    display: flex;
    margin: 0 8px 0 0;
    align-items: center;
    cursor: pointer;
}

.menu-icon {
    position: relative;
    width: 100%;
    height: 2px;
}

.menu-icon .line-1,
.menu-icon .line-2 {
    position: absolute;
    height: 1.5px;
    width: 100%;
    background: white;
    border-radius: 1px;
    transition-property: transform, top;
    transition-delay: 0ms, 160ms;
    transition-duration: 200ms;
}

.menu-icon .line-1 {
    top: -4px;
}

.menu-icon .line-2 {
    top: 4px;
}

.menu-icon-container.active .menu-icon .line-1 {
    top: 0;
    transform: rotateZ(45deg);
    transition-property: top, transform;
    transition-delay: 0ms, 160ms;
    transition-duration: 200ms;
}

.menu-icon-container.active .menu-icon .line-2 {
    top: 0;
    transform: rotateZ(-45deg);
    transition-property: top, transform;
    transition-delay: 0ms, 160ms;
    transition-duration: 200ms;
}

a {
    display: block;
    margin-bottom: 16px;
    color: white;
    text-decoration: none;
}

a:hover {
    font-style: italic;
}

a.current {
    font-style: italic;
}

button {
    background: none;
    border: none;
    padding: none;
    font-family: inherit;
    font-size: 11px;
    color: inherit;
    cursor: pointer;
}

button:focus-visible,
button:hover {
    font-style: italic;
}

.empty-state {
    margin-top: 8px;
    line-height: 18px;
    font-size: 12px;
    white-space: pre-wrap;
}
</style>