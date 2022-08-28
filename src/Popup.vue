<script lang ="ts" setup>
import Brand from './components/Brand.vue';
import Rows from './components/Rows.vue';
import TabSelect from './components/TabSelect.vue';
import Settings from './components/Settings.vue';
import Card from "./components/Card.vue";
import Limits from "./components/Limits.vue";

import { ref, computed } from 'vue';

const isMenuActive = ref(false);

const currentPage = ref("dashboard");

function toggleMenu() {
    isMenuActive.value = !isMenuActive.value;
}

const unlocks = [{
    website: "stackoverflow.com",
    date: new Date(),
    duration: 1608,
    reason: "create google 2.0"
}, {
    website: "facebook.com",
    date: new Date(),
    duration: 5519,
    reason: "communicate with my aunt"
}, {
    website: "facebook.com",
    date: new Date(),
    duration: 207,
    reason: "communicate with my aunt"
}, {
    website: "facebook.com",
    date: new Date(),
    duration: 4000,
    reason: "communicate with my aunt"
}, {
    website: "facebook.com",
    date: new Date(),
    duration: 7976,
    reason: "communicate with my aunt"
}];
const modal = ref<HTMLDivElement | null>(null);

const onEnter = () => {
    modal.value?.focus();
}

const addLimit = () => {
    alert("Wird gemacht, sir!");
}
</script>

<template>
    <Transition
     @enter="onEnter">
        <nav ref="modal" tabindex="0" v-if="isMenuActive" :class="{active: isMenuActive }" @keydown.esc="isMenuActive && (isMenuActive = false)">
            <ul class="menu-container">
                <li class="menu-item">
                    <a href="#" @click="currentPage = 'dashboard'; isMenuActive = false"
                        :class="{ 'current': currentPage === 'dashboard' }">Dashboard</a>
                </li>
                <li class="menu-item">
                    <a href="#" @click="currentPage = 'limits'; isMenuActive = false"
                        :class="{ 'current': currentPage === 'limits' }">Limits</a>
                </li>
                <li class="menu-item">
                    <a href="#" @click="currentPage = 'settings'; isMenuActive = false"
                        :class="{ 'current': currentPage === 'settings' }">Settings</a>
                </li>
                <li class="menu-item">
                    <a href="#" @click="currentPage = 'shortcuts'; isMenuActive = false"
                        :class="{ 'current': currentPage === 'shortcuts' }">Shortcuts</a>
                </li>
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
        <Card heading="Limits">
            <Limits />
        </Card>
        <Card heading="Settings">
            <Settings />
        </Card>
        <Card heading="Unlocks">
            <Rows :has-subtitle="true" :rows="unlocks" />
        </Card>
        <Card heading="Time Spent">
            <TabSelect />
            <Rows :rows="unlocks" />
        </Card>
        <Card heading="Intentions">
            <Rows :rows="unlocks" />
        </Card>
        <Card :button="true" @click.prevent="addLimit">
            Add limit
        </Card>
        <Card :button="true" @click.prevent="addLimit">
            Add current site
        </Card>
        <Card :button="true" @click.prevent="addLimit">
            Add other site
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
}

.body.active {
    opacity: 0;
}

.logo {
    z-index: 1;
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
}

nav.v-enter-from, nav.v-leave-to {
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

</style>