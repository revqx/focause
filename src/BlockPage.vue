<script setup lang="ts">
import {ref} from "vue";
import Shortcut from "./components/Shortcut.vue";
import { Unlock } from "./types/types";
const text = ref("");

const submit = (recent : string | undefined) => {
    if(recent !== "") {
        chrome.runtime.sendMessage({reason: recent});
    }
    else {
        chrome.runtime.sendMessage({reason: text.value});
    }
};

// calculate recent unlocks

const sortByStarted = (a : Unlock, b : Unlock) => {
    return Number(a.started < b.started) - Number(a.started > b.started);
};

let hist = ref<Array<Unlock>>([]);
let states = ref<Array<Unlock>>([]);
let recents = ref<Array<Unlock>>([]);

if(!chrome.storage) {
    hist = ref<Array<Unlock>>([
        {
            url: "facebook.com",
            started: Date.now() - 2000000000,
            duration: 551900,
            reason: "communicate with my aunt",
            limit: "facebook.com"
        },
        {
            url: "stackoverflow.com",
            started: Date.now() - 500000000,
            duration: 1608000,
            reason: "create google 2.0",
            limit: "facebook.com"
        },
        {
            url: "facebook.com",
            started: Date.now() - 500000000,
            duration: 207,
            reason: "communicate with my aunt",
            limit: "facebook.com"
        }
    ]);
    states = ref<Array<Unlock>>([
        {
            url: "facebook.com",
            started: Date.now() - 100000,
            reason: "communicate with my aunt 1",
            duration: 0,
            limit: "facebook.com"
        },
        {
            url: "stackoverflow.com",
            started: Date.now() - 1200000,
            reason: "create google 2.0 2",
            duration: 0,
            limit: "facebook.com"
        },
        {
            url: "facebook.com",
            started: Date.now() - 1400000,
            reason: "communicate with my aunt 3",
            duration: 0,
            limit: "facebook.com"

        }
    ]);
}

if (chrome?.storage) {

    const promise1 = new Promise<void>((resolve, reject) => {
        chrome.storage.sync.get(["history"], (result) => {
            hist.value = result["history"];
            resolve();
        })
    });
    const promise2 = new Promise<void>((resolve, reject) => {
        chrome.storage.local.get('states', (result) => {
            console.log("Restored tabStates from disk: ");
            console.log(result["states"]);
            states.value = Object.values(result["states"] || {});
            resolve();
        });
    });

    Promise.all([promise1, promise2]).then(() => {
        hist.value.concat(states.value).filter((x) => x.started && x.reason).sort(sortByStarted).forEach((x) => {
            let d : Boolean = false;
            recents.value.forEach((y) => {
                if(x.reason === y.reason)
                    d = true;
            })
            if(!d && x)
                recents.value.push(x);
        });
        console.log("history");
        console.log(hist.value.concat(states.value).sort(sortByStarted));
        console.log("recents");
        console.log(recents);
    });

}
else {
    hist.value.concat(states.value).sort(sortByStarted).forEach((x) => {
        let d : Boolean = false;
        recents.value.forEach((y) => {
            if(x.reason === y.reason)
                d = true;
        })
        if(!d)
            recents.value.push(x);
    });
}


</script>

<template>
    <!-- <video playsinline autoplay muted loop poster="background.webp" id="bgvid">
        <source src="background.mp4" type="video/mp4">
    </video> -->
    <div class="main-container">
        <div class="main">
            <svg class="lock" width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M4.8 7.2V12H2.4C1.07452 12 0 13.0745 0 14.4V27.6C0 28.9255 1.07452 30 2.4 30H22.8C24.1255 30 25.2 28.9255 25.2 27.6V14.4C25.2 13.0745 24.1255 12 22.8 12H20.4V7.2C20.0821 3.17066 16.7111 0 12.6 0C8.48898 0 5.11795 3.17066 4.8 7.2ZM12.6 2.4C15.3846 2.4 17.6791 4.49831 17.9885 7.2H18V12H7.2V7.2H7.21152C7.52098 4.49831 9.81545 2.4 12.6 2.4Z"
                    fill="white" />
            </svg>

            <span class="quote">be <span style="font-style: italic">intentional</span><span style="color: #ff6900">.</span></span>
            <div class="outer-container">
                <div class="input-container">
                    <input v-model="text" placeholder="What's your focus?" autofocus spellcheck="false"
                        @keydown.enter="submit('')" />
                    <div v-if="text.length" class="press-enter-container">
                        <span class="press-enter-span">
                            press
                            <Shortcut text="Enter" />
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            className="bi bi-arrow-return-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z" />
                        </svg>
                    </div>

                </div>
                <div class="reasons-container" v-for="reason in recents.slice(0, 3)">
                    <button class="reason" @click="submit(reason.reason)">
                        {{ reason.reason }}
                    </button>
                </div>
            </div>


        </div>
        <div class="brand">
            
<svg width="91" height="36" viewBox="0 0 91 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_b_205_4)">
<rect width="91" height="36" rx="10" fill="#1D1D1F" fill-opacity="0.3"/>
<path d="M30.8595 18.7969V27H28.7643V8.81818H30.8595V15.4943H31.037C31.3566 14.79 31.836 14.2307 32.4752 13.8164C33.1204 13.3962 33.9785 13.1861 35.0498 13.1861C35.979 13.1861 36.7928 13.3725 37.4912 13.7454C38.1896 14.1123 38.7311 14.6776 39.1159 15.4411C39.5065 16.1986 39.7018 17.1634 39.7018 18.3352V27H37.6066V18.4773C37.6066 17.3942 37.3255 16.5567 36.7632 15.9648C36.2069 15.3671 35.4345 15.0682 34.4461 15.0682C33.7596 15.0682 33.144 15.2132 32.5995 15.5032C32.0609 15.7932 31.6348 16.2164 31.3211 16.7727C31.0133 17.3291 30.8595 18.0038 30.8595 18.7969ZM47.5476 27.3196C46.6835 27.3196 45.8993 27.1568 45.195 26.8313C44.4906 26.4999 43.9313 26.0234 43.517 25.402C43.1027 24.7746 42.8956 24.017 42.8956 23.1293C42.8956 22.348 43.0495 21.7147 43.3572 21.2294C43.665 20.7382 44.0763 20.3535 44.5913 20.0753C45.1062 19.7971 45.6744 19.59 46.2958 19.4538C46.9232 19.3118 47.5535 19.1993 48.1868 19.1165C49.0154 19.0099 49.6871 18.93 50.2021 18.8768C50.7229 18.8176 51.1017 18.7199 51.3384 18.5838C51.5811 18.4477 51.7024 18.2109 51.7024 17.8736V17.8026C51.7024 16.9266 51.4627 16.246 50.9833 15.7607C50.5098 15.2753 49.7907 15.0327 48.826 15.0327C47.8258 15.0327 47.0415 15.2517 46.4734 15.6896C45.9052 16.1276 45.5057 16.5952 45.2749 17.0923L43.2862 16.3821C43.6413 15.5535 44.1148 14.9084 44.7067 14.4467C45.3045 13.9792 45.9555 13.6536 46.6598 13.4702C47.37 13.2808 48.0684 13.1861 48.755 13.1861C49.1929 13.1861 49.696 13.2393 50.2642 13.3459C50.8383 13.4465 51.3917 13.6566 51.9244 13.9762C52.4629 14.2958 52.9098 14.7782 53.2649 15.4233C53.62 16.0684 53.7976 16.9325 53.7976 18.0156V27H51.7024V25.1534H51.5959C51.4538 25.4493 51.2171 25.766 50.8857 26.1033C50.5542 26.4407 50.1133 26.7277 49.5629 26.9645C49.0124 27.2012 48.3407 27.3196 47.5476 27.3196ZM47.8672 25.4375C48.6958 25.4375 49.3942 25.2747 49.9624 24.9492C50.5365 24.6237 50.9685 24.2035 51.2585 23.6886C51.5545 23.1737 51.7024 22.6321 51.7024 22.0639V20.1463C51.6136 20.2528 51.4183 20.3505 51.1165 20.4393C50.8205 20.5221 50.4773 20.5961 50.0866 20.6612C49.7019 20.7204 49.3261 20.7737 48.9592 20.821C48.5981 20.8625 48.3052 20.898 48.0803 20.9276C47.5357 20.9986 47.0268 21.114 46.5533 21.2738C46.0857 21.4277 45.7069 21.6615 45.4169 21.9751C45.1328 22.2829 44.9908 22.7031 44.9908 23.2358C44.9908 23.9638 45.2601 24.5142 45.7987 24.8871C46.3432 25.254 47.0327 25.4375 47.8672 25.4375ZM67.2808 16.4176L65.3987 16.9503C65.2803 16.6366 65.1057 16.3318 64.8749 16.0359C64.65 15.734 64.3422 15.4854 63.9516 15.2901C63.561 15.0948 63.0609 14.9972 62.4513 14.9972C61.6167 14.9972 60.9213 15.1895 60.365 15.5742C59.8145 15.953 59.5393 16.4354 59.5393 17.0213C59.5393 17.5421 59.7287 17.9535 60.1075 18.2553C60.4863 18.5572 61.0782 18.8087 61.8831 19.0099L63.9072 19.5071C65.1265 19.803 66.0349 20.2558 66.6327 20.8654C67.2305 21.4691 67.5294 22.2474 67.5294 23.2003C67.5294 23.9815 67.3045 24.6799 66.8547 25.2955C66.4108 25.911 65.7893 26.3963 64.9903 26.7514C64.1913 27.1065 63.2621 27.2841 62.2027 27.2841C60.8118 27.2841 59.6607 26.9822 58.7492 26.3786C57.8377 25.7749 57.2607 24.893 57.018 23.733L59.0067 23.2358C59.1961 23.9697 59.5541 24.5201 60.0809 24.8871C60.6135 25.254 61.309 25.4375 62.1672 25.4375C63.1437 25.4375 63.9191 25.2304 64.4932 24.8161C65.0732 24.3958 65.3632 23.8928 65.3632 23.3068C65.3632 22.8333 65.1975 22.4368 64.866 22.1172C64.5346 21.7917 64.0256 21.549 63.339 21.3892L61.0663 20.8565C59.8175 20.5606 58.9001 20.1019 58.3142 19.4805C57.7342 18.8531 57.4442 18.0689 57.4442 17.1278C57.4442 16.3584 57.6602 15.6778 58.0922 15.0859C58.5302 14.4941 59.125 14.0295 59.8767 13.6921C60.6343 13.3548 61.4925 13.1861 62.4513 13.1861C63.8007 13.1861 64.8601 13.482 65.6295 14.0739C66.4049 14.6657 66.9553 15.447 67.2808 16.4176ZM70.6832 32.1136V13.3636H72.7074V15.5298H72.956C73.1098 15.2931 73.3229 14.9912 73.5952 14.6243C73.8733 14.2514 74.2699 13.92 74.7848 13.63C75.3056 13.334 76.0099 13.1861 76.8977 13.1861C78.0459 13.1861 79.058 13.4731 79.9339 14.0472C80.8099 14.6213 81.4935 15.4351 81.9847 16.4886C82.476 17.5421 82.7216 18.785 82.7216 20.2173C82.7216 21.6615 82.476 22.9132 81.9847 23.9727C81.4935 25.0262 80.8129 25.8429 79.9428 26.4229C79.0728 26.997 78.0696 27.2841 76.9332 27.2841C76.0573 27.2841 75.3559 27.1391 74.8292 26.8491C74.3024 26.5531 73.897 26.2187 73.6129 25.8459C73.3288 25.4671 73.1098 25.1534 72.956 24.9048H72.7784V32.1136H70.6832ZM72.7429 20.1818C72.7429 21.2116 72.8938 22.1201 73.1957 22.9073C73.4975 23.6886 73.9384 24.3011 74.5185 24.745C75.0985 25.183 75.8087 25.402 76.6491 25.402C77.5251 25.402 78.256 25.1712 78.842 24.7095C79.4338 24.242 79.8777 23.6146 80.1737 22.8274C80.4755 22.0343 80.6264 21.1525 80.6264 20.1818C80.6264 19.223 80.4785 18.3589 80.1825 17.5895C79.8925 16.8142 79.4516 16.2016 78.8597 15.7518C78.2738 15.296 77.5369 15.0682 76.6491 15.0682C75.7969 15.0682 75.0807 15.2842 74.5007 15.7163C73.9207 16.1424 73.4827 16.7402 73.1868 17.5096C72.8909 18.2731 72.7429 19.1638 72.7429 20.1818Z" fill="white" fill-opacity="0.6"/>
<rect x="28.75" y="5" width="2.25" height="25" rx="1.125" fill="#FF6900"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.88164 15.8778H8.01111C7.45269 15.8778 7 16.3305 7 16.8889V25.9889C7 26.5474 7.45269 27 8.01111 27H21.1556C21.714 27 22.1667 26.5474 22.1667 25.9889V16.8889C22.1667 16.3305 21.714 15.8778 21.1556 15.8778H19.285V13.5017C19.285 10.9051 17.18 8.80005 14.5833 8.80005C11.9866 8.80005 9.88164 10.9051 9.88164 13.5017V15.8778ZM11.3478 15.8778H17.8189V13.5017C17.8189 11.7148 16.3703 10.2662 14.5833 10.2662C12.7964 10.2662 11.3478 11.7148 11.3478 13.5017V15.8778Z" fill="white"/>
</g>
<defs>
<filter id="filter0_b_205_4" x="-4" y="-4" width="99" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feGaussianBlur in="BackgroundImage" stdDeviation="2"/>
<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_205_4"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_205_4" result="shape"/>
</filter>
</defs>
</svg>

        </div>
    </div>
</template>

<style scoped>

video {
    object-fit: cover;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
}

.reasons-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 800px;
}

.reason {
    background-color: rgba(17, 18, 19, 0.35);
    padding: 12px 12px 12px 14px;
    margin-top: 12px;
    text-align: center;
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 19px;
    font-family: inherit;
    border: none;
    cursor: pointer;
    color: inherit;
    display: flex;
}

.shortcut {
    margin-right: 14px;
}

.reason:focus-visible {
    outline: none;
    font-style: italic;
}

.reason:hover {
    font-style: italic;
}

.main-container {
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.outer-container {
    width: 100%;
}

.input-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 15px 17px 15px 17px;
    margin-top: 8vh;
    font-size: 24px;
    border-radius: 10px;
    background-color: rgba(17, 18, 19, 0.35);
    box-sizing: border-box;
}

.press-enter-container {
    display: flex;
    align-items: center;
    margin-left: 10px;
}

.press-enter-container svg {
    height: 14px;
    width: 14px;
    color: white;
}

.press-enter-container svg path {
    stroke: white;
    stroke-width: 0.25px;
}

.press-enter-span {
    color: white;
    white-space: nowrap;
    margin-right: 4px;
    font-size: 15px;
}

.lock {
    width: 24px;
    margin-top: 16vh;
}

.main {
    max-width: 800px;
    position: absolute;
    top: 36vh;
    left: 50vw;
    display: flex;
    align-items: center;
    flex-direction: column;
    transform: translate(-50%, -50%);
    font-size: 26px;
    width: 100%;
    padding: 16px;
}

.quote {
    margin-top: 2.5vh;
}

input {
    flex-grow: 1;
    font-size: 24px;
    border: none;
    color: var(--light-text);
    background-color: transparent;
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
    bottom: 32px;
}

.brand svg {
    height: 30px;
}

</style>
