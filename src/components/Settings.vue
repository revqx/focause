<script setup lang="ts">
const settings = [{
    text: "Hide cause placeholder", key: "hidecauseplaceholder"
},
{ text: "Unlock whole site after promt", key: "unlockafterpromt" },
{ text: "Disable limits", key: "disable" },
{ text: "Hide shortcut suggestions" },
{ text: "Hide motivational quote" },
{ text: "Hide gradient" }]
</script>

<template>
    <div class="outer">

    
<svg
   width="56.663052"
   height="37.771431">
   <g
     id="g7971">
     <circle
       style="fill:none;fill-opacity:1;stroke:#000000;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:3.8;stroke-dasharray:none;stroke-opacity:1;stop-color:#000000"
       id="path4854"
       cx="0"
       cy="0"
       r="4.5" /><path
       id="path4854-5"
       style="fill:none;stroke:#000000;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:3.8;stroke-dasharray:none;stroke-opacity:1;stop-color:#000000"
       d="m 72.019208,89.52702 c -2.483107,0 -4.49606,-2.012953 -4.49606,-4.49606 0,-2.483109 2.012953,-4.496062 4.49606,-4.496062 h 4.999979 c 2.483104,0 4.49606,2.012953 4.49606,4.496062 0,2.483103 -2.012956,4.49606 -4.49606,4.49606 z"
       sodipodi:nodetypes="csccscc" /></g></svg>


        <div class="line" v-for="line in settings">
            <button class="toggle">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.375 1.2C13.5685 1.2 14.7131 1.70571 15.557 2.60589C16.4009 3.50606 16.875 4.72696 16.875 6C16.875 7.27304 16.4009 8.49394 15.557 9.39411C14.7131 10.2943 13.5685 10.8 12.375 10.8H9C9.69912 10.2416 10.2665 9.51704 10.6571 8.68379C11.0477 7.85054 11.2507 6.9316 11.25 6C11.2507 5.0684 11.0477 4.14946 10.6571 3.31621C10.2665 2.48296 9.69912 1.75836 9 1.2H12.375ZM5.625 10.8C4.43153 10.8 3.28693 10.2943 2.44302 9.39411C1.59911 8.49394 1.125 7.27304 1.125 6C1.125 4.72696 1.59911 3.50606 2.44302 2.60589C3.28693 1.70571 4.43153 1.2 5.625 1.2C6.81847 1.2 7.96307 1.70571 8.80698 2.60589C9.65089 3.50606 10.125 4.72696 10.125 6C10.125 7.27304 9.65089 8.49394 8.80698 9.39411C7.96307 10.2943 6.81847 10.8 5.625 10.8ZM0 6C0 7.5913 0.592632 9.11742 1.64752 10.2426C2.70242 11.3679 4.13316 12 5.625 12H12.375C13.8668 12 15.2976 11.3679 16.3525 10.2426C17.4074 9.11742 18 7.5913 18 6C18 4.4087 17.4074 2.88258 16.3525 1.75736C15.2976 0.632141 13.8668 0 12.375 0H5.625C4.13316 0 2.70242 0.632141 1.64752 1.75736C0.592632 2.88258 0 4.4087 0 6Z"
                        fill="white" />
                </svg>
            </button>
            {{ line.text }}
        </div>
    </div>
</template>

<style scoped>
.outer {
    margin: 12px 0 0 0;
}

.line {
    line-height: 19px;
    font-size: 16px;
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    margin: 0 0 8px 0;
}

.line svg {
    margin: 0 8px 0 0;
}

.toggle {
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
}
</style>