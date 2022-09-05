<script setup lang="ts">
const props = defineProps({
    text: String,
    hasStrg: Boolean
});
</script>

<template>
    <span class="bold">{{text}}</span>
</template>

<style scoped>

.bold {
   font-weight: bold; 
}
</style>

