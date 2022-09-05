<script setup lang="ts">
defineProps({
    id: { type: String, required: true },
    text: { type: String }
})
const length = 16;
</script>
<template>
    <span>
        <input type="checkbox" :id="'checkbox' + id">
        <label :for="'checkbox' + id">
            <svg overflow="visible" height="11" viewBox="0 0 32 16">
                <mask :id="'mask' + id">
                    <rect width="24" height="16" fill="white" />
                    <path 
                        class="mover" 
                        :d="`M 8 0 A 8 8 0 0 0 8 16
                        L ${8+length} 16
                        A 8 8 0 0 0 ${8+length} 0
                        L 8 0`"
                        fill="black" />
                </mask>

                <path :d="`M 8 0 A 8 8 0 0 0 8 16
                        L ${8+length} 16
                        A 8 8 0 0 0 ${8+length} 0
                        L 8 0`"
                    fill="rgba(255,255,255,1)" 
                    :mask="'url(#mask' + id + ')'" 
                    />
                <path :d="`M 8 0 A 8 8 0 0 0 8 16
                        L ${8+length} 16
                        A 8 8 0 0 0 ${8+length} 0
                        L 8 0`"
                        stroke="white" 
                        stroke-width="1.5" 
                        fill="transparent" />
                <circle class="mover knob" stroke-width="1.5" r="8" cx="8" cy="8" stroke="white" />


            </svg>
            {{  text  }}
        </label>
    </span>
</template> 

<style scoped>
span {
    line-height: 19px;
    font-size: 16px;
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    margin: 0 0 6px 0;
}

label svg {
    margin-right: 4px;
}

label {
    fill: transparent;
    cursor: pointer;
}

span .mover {
    transition: transform 0.1s ease-in;
    transform: translate(0, 0);
    cursor: pointer;
}


input[type="checkbox"]:checked+label .mover {
    transform: translateX(16px);
}


input[type="checkbox"]:focus-visible+label {
    font-style: italic;
}


input[type="checkbox"] {
    -webkit-appearance: none;
    appearance: none;
    /* For iOS < 15 to remove gradient background */
    background-color: #fff;
    /* Not removed via appearance */
    margin: 0;
}
</style>