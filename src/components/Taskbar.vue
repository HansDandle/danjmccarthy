<template>
  <div class="fixed bottom-0 left-0 right-0 h-[30px] flex items-center z-[9999]"
       style="background: linear-gradient(180deg,#245edb 0%,#3a7fef 8%,#2b6dd6 50%,#1a56cc 51%,#1a4fc4 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), 0 -1px 0 #0b3a9a">

    <!-- Start button -->
    <button
      class="flex items-center gap-1.5 h-full px-3 font-bold text-[13px] text-white rounded-r-xl cursor-default"
      style="background:linear-gradient(180deg,#5aab3f 0%,#3e9227 40%,#2d7d1b 100%); border-right:2px solid #1a5c0e; text-shadow:1px 1px 1px rgba(0,0,0,0.5); letter-spacing:.3px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.4),2px 0 4px rgba(0,0,0,0.3)"
      @click="$emit('toggle-start')"
    >
      <span class="text-[18px] leading-none">⊞</span>
      <span>start</span>
    </button>

    <div class="w-px h-[22px] mx-1" style="background:linear-gradient(180deg,transparent,rgba(255,255,255,.3) 50%,transparent)" />

    <!-- Open windows -->
    <div class="flex items-center gap-1 flex-1 overflow-hidden px-1 h-full">
      <button
        v-for="w in openWindows"
        :key="w.id"
        class="flex items-center gap-1 h-[22px] px-2 max-w-[160px] rounded text-white text-[11px] truncate cursor-default"
        :class="w.id === activeId
          ? 'bg-[#1a4fc4] border border-[rgba(255,255,255,0.4)] shadow-inner'
          : 'bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.25)]'"
        @click="$emit('taskbar-click', w.id)"
      >
        <span>{{ winMeta(w.id)?.icon }}</span>
        <span class="truncate">{{ winMeta(w.id)?.title }}</span>
      </button>
    </div>

    <!-- System tray -->
    <div class="flex items-center gap-2 h-full px-3 border-l border-[rgba(255,255,255,0.2)] text-white text-[11px]"
         style="background:linear-gradient(180deg,#0d47be 0%,#1055d4 100%)">
      <span title="Network">🌐</span>
      <span title="Volume">🔊</span>
      <span class="tabular-nums">{{ time }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { WINDOWS } from '../data/windows.js'

defineProps({ openWindows: Array, activeId: String })
defineEmits(['toggle-start', 'taskbar-click'])

function winMeta(id) { return WINDOWS.find(w => w.id === id) }

const time = ref('')
function tick() {
  const n = new Date()
  time.value = n.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
tick()
const interval = setInterval(tick, 10000)
onUnmounted(() => clearInterval(interval))
</script>
