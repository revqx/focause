<script setup lang="ts">
const limits = [{ "website": "facebook.com", "time": 30 }, { "website": "youtube.com", "time": 15 }, { "website": "reddit.com", "time": 5 }];

</script>
<template>
    <div class="outer">
        <div class="line" v-for="limit in limits">
            <button class="delete">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.188822 0.188822C0.248525 0.128968 0.319449 0.0814802 0.397533 0.0490789C0.475617 0.0166777 0.559326 0 0.643866 0C0.728405 0 0.812114 0.0166777 0.890198 0.0490789C0.968282 0.0814802 1.03921 0.128968 1.09891 0.188822L4.50017 3.59137L7.90143 0.188822C7.96118 0.129065 8.03213 0.0816626 8.1102 0.0493223C8.18828 0.0169819 8.27196 0.000336506 8.35647 0.000336506C8.44098 0.000336506 8.52466 0.0169819 8.60274 0.0493223C8.68082 0.0816626 8.75176 0.129065 8.81151 0.188822C8.87127 0.248579 8.91868 0.319521 8.95102 0.397598C8.98336 0.475674 9 0.559356 9 0.643866C9 0.728375 8.98336 0.812057 8.95102 0.890134C8.91868 0.968211 8.87127 1.03915 8.81151 1.09891L5.40897 4.50017L8.81151 7.90143C8.87127 7.96118 8.91868 8.03213 8.95102 8.1102C8.98336 8.18828 9 8.27196 9 8.35647C9 8.44098 8.98336 8.52466 8.95102 8.60274C8.91868 8.68082 8.87127 8.75176 8.81151 8.81151C8.75176 8.87127 8.68082 8.91868 8.60274 8.95102C8.52466 8.98336 8.44098 9 8.35647 9C8.27196 9 8.18828 8.98336 8.1102 8.95102C8.03213 8.91868 7.96118 8.87127 7.90143 8.81151L4.50017 5.40897L1.09891 8.81151C1.03915 8.87127 0.968211 8.91868 0.890134 8.95102C0.812057 8.98336 0.728375 9 0.643866 9C0.559356 9 0.475674 8.98336 0.397598 8.95102C0.319521 8.91868 0.248579 8.87127 0.188822 8.81151C0.129065 8.75176 0.0816626 8.68082 0.0493223 8.60274C0.0169819 8.52466 0.000336506 8.44098 0.000336506 8.35647C0.000336506 8.27196 0.0169819 8.18828 0.0493223 8.1102C0.0816626 8.03213 0.129065 7.96118 0.188822 7.90143L3.59137 4.50017L0.188822 1.09891C0.128968 1.03921 0.0814802 0.968282 0.0490789 0.890198C0.0166777 0.812114 0 0.728405 0 0.643866C0 0.559326 0.0166777 0.475617 0.0490789 0.397533C0.0814802 0.319449 0.128968 0.248525 0.188822 0.188822Z"
                        fill="white" />
                </svg>
            </button>
            <span class="name">{{ limit.website }}</span>
            <input :value="limit.time" type=number />
            &nbsp;min
        </div>
    </div>
</template>

<style scoped>
.outer {
    margin: 11px 0 0 0;
}

.delete {
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;   
}

.delete svg {
    transform: rotate(0deg);
}

.delete svg:hover {
    transform: rotate(-90deg);
    transition-duration: 160ms;
}

.delete:focus svg {
    transform: rotate(-90deg);
    transition-duration: 160ms;
}

.line {
    display: flex;
    line-height: 19px;
    font-size: 16px;
    align-items: center;
    margin: 0 0 8px 0;
}

.line svg {
    margin: 0 8px 0 0;
}

input {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    text-align: right;
    width: 30px;
    flex-shrink: 1;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid white;
    overflow: visible;
    outline: none;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

.name {
    flex-grow: 1;
}
</style>