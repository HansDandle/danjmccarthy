<template>
  <div
    ref="rootEl"
    class="absolute flex flex-col items-center w-[80px] select-none"
    :style="{ left: pos.x + 'px', top: pos.y + 'px', zIndex: dragging ? 999 : 1 }"
    @mousedown="onMouseDown"
    @dblclick="onDblClick"
    @mouseenter="onEnter"
    @mouseleave="showTip = false"
  >
    <div
      class="flex flex-col items-center w-full p-1 rounded border"
      :class="selected
        ? 'bg-[rgba(49,106,197,0.55)] border-[rgba(49,106,197,0.85)]'
        : 'border-transparent hover:bg-[rgba(49,106,197,0.25)] hover:border-[rgba(49,106,197,0.55)]'"
    >
      <img v-if="imgSrc" :src="imgSrc" :alt="label"
        class="w-10 h-10 object-contain" style="image-rendering:pixelated" />
      <span v-else class="text-[40px] leading-none">{{ icon }}</span>

      <span class="mt-1 text-white text-[11px] text-center leading-snug break-words max-w-[72px]"
        style="text-shadow:1px 1px 2px #000,0 0 5px #000">{{ label }}</span>
    </div>
  </div>

  <!-- Tooltip teleported to body so it's never clipped -->
  <Teleport to="body">
    <div
      v-if="showTip && tooltip && !dragging"
      class="fixed z-[99999] pointer-events-none bg-[#ffffe1] border border-black text-black text-[11px] px-1.5 py-0.5 shadow max-w-[260px]"
      style="font-family:Tahoma,sans-serif; word-break:break-word"
      :style="tipStyle"
    >{{ tooltip }}</div>
  </Teleport>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  icon: String,
  label: String,
  href: String,
  imgSrc: String,
  tooltip: String,
  initX: { type: Number, default: 0 },
  initY: { type: Number, default: 0 },
})
const emit = defineEmits(['open'])

const rootEl = ref(null)
const pos = ref({ x: props.initX, y: props.initY })
const selected = ref(false)
const dragging = ref(false)
const showTip = ref(false)
const tipStyle = ref({})

const TIP_W = 260
const TIP_H = 36   // rough max height for one line; real height calculated after render

function onEnter() {
  if (!props.tooltip) return
  showTip.value = true

  const el = rootEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight - 30  // account for taskbar

  // Prefer showing below the icon; fall back to above if too close to bottom
  let top, left

  if (rect.bottom + TIP_H + 4 < vh) {
    top = rect.bottom + 4
  } else {
    top = rect.top - TIP_H - 4
  }

  // Center under icon, then clamp horizontally
  left = rect.left + rect.width / 2 - TIP_W / 2
  left = Math.max(4, Math.min(left, vw - TIP_W - 4))

  tipStyle.value = { top: top + 'px', left: left + 'px', width: TIP_W + 'px' }
}

let startMouseX = 0, startMouseY = 0
let startPosX = 0, startPosY = 0
let moved = false

function onMouseDown(e) {
  if (e.button !== 0) return
  e.stopPropagation()
  selected.value = true
  dragging.value = true
  showTip.value = false
  moved = false
  startMouseX = e.clientX
  startMouseY = e.clientY
  startPosX = pos.value.x
  startPosY = pos.value.y
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e) {
  const dx = e.clientX - startMouseX
  const dy = e.clientY - startMouseY
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true
  if (moved) {
    pos.value.x = Math.max(0, startPosX + dx)
    pos.value.y = Math.max(0, startPosY + dy)
  }
}

function onMouseUp() {
  dragging.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

function onDblClick() {
  if (props.href) window.open(props.href, '_blank', 'noopener')
  else emit('open')
}

function deselect() { selected.value = false }
window.addEventListener('mousedown', deselect)
onUnmounted(() => window.removeEventListener('mousedown', deselect))
</script>
