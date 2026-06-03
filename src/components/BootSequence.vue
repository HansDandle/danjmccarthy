<template>
  <div class="w-screen h-screen overflow-hidden">

    <!-- Step 1: plain black -->
    <div v-if="step === 1" class="w-full h-full bg-black" />

    <!-- Step 2: logo screen -->
    <div v-else-if="step === 2" class="w-full h-full bg-black flex flex-col items-center justify-center relative select-none">

      <!-- Logo + name block -->
      <div class="flex flex-col items-center gap-2">
        <!-- XP orb logo -->
        <img src="/winlogo.png" alt="Windows XP logo" class="w-44 h-44 object-contain" />

        <!-- Name + title text -->
        <div class="text-center mt-2">
          <p class="text-white text-lg font-light tracking-wide"
            style="font-family:'Franklin Gothic Medium','Arial Narrow',Arial,sans-serif">
            Dan McCarthy
          </p>
          <p class="text-white leading-none" style="font-size:clamp(3rem,8vw,5.5rem); font-family:'Franklin Gothic Medium','Arial Narrow',Arial,sans-serif; font-weight:900; letter-spacing:-.01em">
            Portfolio<span class="text-[#f26522] italic" style="font-size:.45em; vertical-align:super; font-weight:900">xp</span>
          </p>
        </div>
      </div>

      <!-- Loading bar pinned to bottom -->
      <div class="absolute bottom-12 flex flex-col items-center gap-3">
        <div class="loading-bar overflow-hidden rounded px-px py-px flex items-center gap-0.5" style="width:320px;height:26px">
          <div class="loading-box h-5/6 w-4 flex-shrink-0" />
          <div class="loading-box h-5/6 w-4 flex-shrink-0" style="animation-delay:.18s" />
          <div class="loading-box h-5/6 w-4 flex-shrink-0" style="animation-delay:.36s" />
        </div>
      </div>
    </div>

    <!-- Step 3: XP blue "starting" screen -->
    <div v-else-if="step === 3"
      class="w-full h-full flex flex-col select-none"
      style="background:radial-gradient(29.68% 27.76% at 5.94% 14.64%, rgba(255,255,255,.2) 0%, rgba(255,255,255,.16) 59.9%, rgba(255,255,255,0) 100%), #567DDA">
      <div class="w-full h-32 flex-shrink-0" style="background:#012F9E; border-bottom:2px solid #fff" />
      <div class="flex-1 flex items-center justify-center">
        <div class="flex items-center gap-4 mb-10">
          <img src="/winlogo.png" alt="Windows XP logo" class="w-20 h-20 object-contain" />
          <div class="flex flex-col leading-none">
            <span class="text-black font-light text-4xl tracking-wide"
              style="font-family:'Franklin Gothic Medium','Arial Narrow',Arial,sans-serif">Portfolio</span>
            <span class="text-[#f26522] font-bold text-2xl italic"
              style="font-family:'Franklin Gothic Medium','Arial Narrow',Arial,sans-serif">XP</span>
          </div>
        </div>
      </div>
      <div class="w-full h-48 flex-shrink-0" style="background:#012F9E; border-top:2px solid #13920D" />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['done'])
const step = ref(1)

onMounted(async () => {
  await wait(1200)
  step.value = 2
  await wait(5500)
  step.value = 3
  await wait(2000)
  emit('done')
})

function wait(ms) { return new Promise(r => setTimeout(r, ms)) }
</script>

<style scoped>
/* ── Loading bar ── */
.loading-bar {
  border: 2px solid #6a6a6a;
  background: #000;
}

.loading-box {
  background: linear-gradient(
    to bottom,
    #2838c7 0%, #5979ef 17%, #869ef3 32%,
    #869ef3 45%, #5979ef 59%, #2838c7 100%
  );
  animation: loader 3.5s infinite linear;
}

@keyframes loader {
  0%   { transform: translateX(-320px); }
  100% { transform: translateX(360px); }
}
</style>
