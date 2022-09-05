<script setup lang="ts">
import Switch from "./Switch.vue";
const settings = [{
    text: "Hide cause placeholder", key: "hidecauseplaceholder"
},
{ text: "Disable limits", key: "disable" },
{ text: "Hide shortcut suggestions" },
{ text: "Hide motivational quote" },
]
</script>

<template>
    <div class="outer">
        <Switch :id="index+''" v-for="line, index in settings" :text="line.text"/>
    </div>
</template>

<style scoped>
.outer {
    margin: 12px 0 0 0;
}

.line svg {
    padding: 0 8px 0 0;
}

</style>