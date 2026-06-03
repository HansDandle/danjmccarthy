<template>
  <div class="w-screen h-screen overflow-hidden">

    <!-- Logo screen -->
    <div v-if="step === 2" class="w-full h-full bg-black flex flex-col items-center justify-center relative select-none">

      <!-- Logo + name + loading bar as one block -->
      <div class="flex flex-col items-center gap-2">
        <img src="/winlogo.png" alt="Windows XP logo" class="w-44 h-44 object-contain" />

        <div class="text-left mt-2">
          <p class="text-white text-2xl font-light tracking-wide"
            style="font-family:'Franklin Gothic Medium','Arial Narrow',Arial,sans-serif">
            Dan McCarthy
          </p>
          <p class="text-white leading-none" style="font-size:clamp(3rem,8vw,5.5rem); font-family:'Franklin Gothic Medium','Arial Narrow',Arial,sans-serif; font-weight:900; letter-spacing:-.01em">
            Portfolio<span class="text-[#f26522] italic" style="font-size:.45em; vertical-align:super; font-weight:900">xp</span>
          </p>
        </div>

        <div class="loading-bar mt-4 overflow-hidden rounded px-px py-px flex items-center gap-0.5" style="width:320px;height:26px">
          <div class="loading-box h-5/6 w-4 flex-shrink-0" />
          <div class="loading-box h-5/6 w-4 flex-shrink-0" style="animation-delay:.18s" />
          <div class="loading-box h-5/6 w-4 flex-shrink-0" style="animation-delay:.36s" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['done'])
const step = ref(1)

onMounted(async () => {
  step.value = 2
  await wait(4500)
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
