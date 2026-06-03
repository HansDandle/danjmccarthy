<template>
  <section
    v-show="!minimized"
    class="absolute rounded-t-sm overflow-hidden select-none"
    :style="style"
    @mousedown="onMouseDown"
  >
    <!-- Title bar -->
    <div
      class="flex items-center justify-between px-1 h-7 cursor-default"
      :class="isActive ? 'win-header-active' : 'win-header-inactive'"
      @mousedown.stop="startDrag"
    >
      <div class="flex items-center gap-1 overflow-hidden flex-1 pr-1">
        <span class="text-sm leading-none flex-shrink-0">{{ icon }}</span>
        <span class="text-white text-[11px] font-bold truncate" style="text-shadow: 1px 1px 0 #05127a">{{ title }}</span>
      </div>
      <div class="flex items-center gap-px">
        <WinBtn icon="🗕" title="Minimize" @click="$emit('minimize')" />
        <WinBtn v-if="resizable !== false" icon="🗗" title="Maximize" @click="toggleMaximize" />
        <WinBtn icon="✕" title="Close" red @click="$emit('close')" />
      </div>
    </div>

    <!-- Menu bar -->
    <div class="bg-[#ece9d8] border-b border-[#aca899] flex items-center px-1 gap-1 text-[11px] h-5">
      <span class="px-1 hover:bg-[#316ac5] hover:text-white cursor-default rounded-sm">File</span>
      <span class="px-1 hover:bg-[#316ac5] hover:text-white cursor-default rounded-sm">View</span>
      <span class="px-1 hover:bg-[#316ac5] hover:text-white cursor-default rounded-sm">Help</span>
    </div>

    <!-- Content -->
    <div class="overflow-auto bg-white" :style="contentStyle">
      <slot />
    </div>

    <!-- Resize handles — right handle starts below title bar so it doesn't block buttons -->
    <template v-if="resizable !== false && !maximized">
      <div class="absolute right-0 w-2 cursor-ew-resize" :style="{ top: (TITLE_H + MENU_H) + 'px', bottom: '8px' }" @mousedown.stop="startResize('right')" />
      <div class="absolute bottom-0 left-0 h-2 w-full cursor-ns-resize" @mousedown.stop="startResize('bottom')" />
      <div class="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize" @mousedown.stop="startResize('corner')" />
    </template>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import WinBtn from './WinBtn.vue'

const props = defineProps({
  id: String,
  title: String,
  icon: String,
  initX: { type: Number, default: 100 },
  initY: { type: Number, default: 100 },
  initW: { type: Number, default: 500 },
  initH: { type: Number, default: 400 },
  minW: { type: Number, default: 200 },
  minH: { type: Number, default: 160 },
  resizable: { type: Boolean, default: true },
  isActive: Boolean,
  minimized: Boolean,
  zIndex: Number,
  mobile: Boolean,
})

const emit = defineEmits(['close', 'minimize', 'activate'])

const x = ref(props.initX)
const y = ref(props.initY)
const w = ref(props.initW)
const h = ref(props.initH)
const maximized = ref(false)
const savedPos = ref(null)

const TITLE_H = 28
const MENU_H = 20

const style = computed(() => {
  if (props.mobile || maximized.value) {
    return { left: 0, top: 0, width: '100vw', height: 'calc(100vh - 30px)', zIndex: props.zIndex }
  }
  return {
    left: x.value + 'px',
    top: y.value + 'px',
    width: w.value + 'px',
    height: h.value + 'px',
    zIndex: props.zIndex,
    border: props.isActive ? '2px solid #0058e6' : '2px solid #7a96df',
    boxShadow: props.isActive ? '2px 2px 8px rgba(0,0,0,0.4)' : '1px 1px 4px rgba(0,0,0,0.2)',
  }
})

const contentStyle = computed(() => {
  const totalChrome = TITLE_H + MENU_H
  if (props.mobile || maximized.value) return { height: `calc(100vh - 30px - ${totalChrome}px)` }
  return { height: `${h.value - totalChrome}px` }
})

function toggleMaximize() {
  if (!maximized.value) {
    savedPos.value = { x: x.value, y: y.value, w: w.value, h: h.value }
    maximized.value = true
  } else {
    maximized.value = false
    if (savedPos.value) {
      x.value = savedPos.value.x; y.value = savedPos.value.y
      w.value = savedPos.value.w; h.value = savedPos.value.h
    }
  }
}

function onMouseDown() {
  emit('activate')
}

// ── Drag ──────────────────────────────────────────────
let dragging = false, ox = 0, oy = 0

function startDrag(e) {
  if (maximized.value) return
  emit('activate')
  dragging = true
  ox = e.clientX - x.value
  oy = e.clientY - y.value
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}
function onDrag(e) {
  if (!dragging) return
  x.value = Math.max(0, Math.min(e.clientX - ox, window.innerWidth - 80))
  y.value = Math.max(0, Math.min(e.clientY - oy, window.innerHeight - 60))
}
function stopDrag() {
  dragging = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

// ── Resize ────────────────────────────────────────────
let resizing = false, rDir = '', rox = 0, roy = 0, rw = 0, rh = 0

function startResize(dir) {
  emit('activate')
  resizing = true; rDir = dir
  rox = event.clientX; roy = event.clientY
  rw = w.value; rh = h.value
  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}
function onResize(e) {
  if (!resizing) return
  const dx = e.clientX - rox, dy = e.clientY - roy
  if (rDir === 'right' || rDir === 'corner') w.value = Math.max(props.minW, rw + dx)
  if (rDir === 'bottom' || rDir === 'corner') h.value = Math.max(props.minH, rh + dy)
}
function stopResize() {
  resizing = false
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
}
</script>
