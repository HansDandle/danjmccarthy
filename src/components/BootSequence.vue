<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center bg-black">
    <!-- XP logo area -->
    <div class="flex flex-col items-center gap-8 mb-12">
      <!-- Windows XP wordmark (CSS-only) -->
      <div class="flex items-center gap-3">
        <!-- 4-color flag -->
        <div class="grid grid-cols-2 gap-0.5 w-14 h-14">
          <div class="rounded-tl-full bg-[#f25022]" />
          <div class="rounded-tr-full bg-[#7fba00]" />
          <div class="rounded-bl-full bg-[#00a4ef]" />
          <div class="rounded-br-full bg-[#ffb900]" />
        </div>
        <div class="flex flex-col leading-none">
          <span class="text-white font-light text-4xl tracking-wide" style="font-family: Franklin Gothic Medium, Arial Narrow, sans-serif">Windows</span>
          <span class="text-[#7ecfff] font-bold text-2xl italic" style="font-family: Franklin Gothic Medium, Arial Narrow, sans-serif">XP</span>
        </div>
      </div>

      <!-- "Professional" tagline -->
      <p class="text-[#a0c0e0] text-sm tracking-widest uppercase">Professional</p>
    </div>

    <!-- Progress bar -->
    <div class="w-64">
      <div class="h-4 bg-[#111] border border-[#333] rounded-full overflow-hidden">
        <div
          class="h-full rounded-full bg-gradient-to-r from-[#4488cc] to-[#88ccff] transition-all duration-300 ease-linear"
          :style="{ width: progress + '%' }"
        />
      </div>
      <p class="text-[#6090c0] text-xs text-center mt-3 tracking-wide">{{ statusText }}</p>
    </div>

    <p class="absolute bottom-6 text-[#304060] text-[10px]">Copyright © Microsoft Corporation. This is a portfolio — not the real Windows XP.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['done'])

const progress = ref(0)
const statusText = ref('Starting Windows…')

const steps = [
  [15, 400, 'Loading system files…'],
  [35, 600, 'Initializing hardware…'],
  [55, 500, 'Loading Dan McCarthy portfolio…'],
  [75, 700, 'Applying personal settings…'],
  [90, 400, 'Almost ready…'],
  [100, 300, 'Welcome!'],
]

onMounted(async () => {
  for (const [pct, delay, text] of steps) {
    await wait(delay)
    progress.value = pct
    statusText.value = text
  }
  await wait(600)
  emit('done')
})

function wait(ms) { return new Promise(r => setTimeout(r, ms)) }
</script>
