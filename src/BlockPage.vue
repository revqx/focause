<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
import {ref} from "vue";
import Brand from "./components/Brand.vue";
const text = ref("");
</script>

<template>
  <Brand class="brand" />
  <div class="main">
    <img class="lock" src="./assets/lock.svg" alt="Vue logo" />
    <span class="left">Be intentional.</span>
    <span class="right">Live on purpose.</span>
    <input v-model="text" placeholder="What task are you up to?" autofocus/>
  </div> 
</template>

<style scoped>

.lock{
  width: 30px;
  height: 32px; 
}
.main {
  max-width: 832px;
  position: absolute;
  top: 36vh;
  left: 50vw;
  display: flex;
  align-items: center;
  flex-direction: column;
  transform: translate(-50%, -50%);
  font-size: 26px;
  font-style: italic;
  width: 100%;
}
.main > span.left{
  margin: 32px 0 0 0;
  transform: translate(calc(13px - 50%));
}
.main > span.right{
  margin: 16px 0 0 0;
  transform: translate(calc(-13px + 50%));
}

input {
  margin: 54px 16px 0 16px;
  padding: 15px 15px 15px 15px;
  font-size: 24px;
  align-self: stretch;
  border-radius: 10px;
  border: none;
  color: var(--light-text);
  background-color: rgba(17, 18, 19, 0.3);
  box-sizing: border-box;
  outline: none;
}

::placeholder {
    color: var(--light-text);
    opacity: 0.3;
}

::ms-input-placeholder {
    color: white;
    opacity: 0.3;
}

.brand {
  position: absolute;
  top: 19px;
  left: 19px;
  align-self: center;
  font-size: 19px;
}

</style>
