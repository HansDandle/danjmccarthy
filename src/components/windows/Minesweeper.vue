<template>
  <div ref="rootEl" class="bg-[#c0c0c0] p-2 flex flex-col items-center gap-2 select-none h-full overflow-hidden" style="font-family: 'Courier New', monospace">
    <!-- Header panel -->
    <div ref="headerEl" class="xp-inset px-2 py-1 bg-[#c0c0c0] flex items-center justify-between flex-shrink-0"
      :style="{ width: (cellSize * COLS + 4) + 'px' }">
      <div class="xp-inset bg-black text-[#ff0000] text-lg font-bold px-1 min-w-[3ch] text-center tabular-nums">
        {{ String(minesLeft).padStart(3, '0') }}
      </div>
      <button
        class="xp-raised w-8 h-8 flex items-center justify-center text-xl cursor-pointer hover:xp-inset active:xp-inset"
        @click="reset"
      >{{ faceEmoji }}</button>
      <div class="xp-inset bg-black text-[#ff0000] text-lg font-bold px-1 min-w-[3ch] text-center tabular-nums">
        {{ String(timer).padStart(3, '0') }}
      </div>
    </div>

    <!-- Grid -->
    <div
      class="xp-inset"
      :style="{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)` }"
    >
      <button
        v-for="(cell, i) in cells"
        :key="i"
        class="flex items-center justify-center font-bold cursor-default touch-manipulation"
        :style="{ width: cellSize + 'px', height: cellSize + 'px', fontSize: (cellSize * 0.45) + 'px' }"
        :class="cellClass(cell)"
        @click="reveal(i)"
        @contextmenu.prevent="flag(i)"
        @touchstart.passive="onTouchStart(i)"
        @touchend="onTouchEnd"
        @touchmove="onTouchEnd"
      >{{ cellLabel(cell) }}</button>
    </div>

    <p ref="hintEl" class="text-[10px] text-[#444] flex-shrink-0">{{ isTouch ? 'Tap: reveal · Long-press: flag' : 'Click: reveal · Right-click: flag' }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const ROWS = 9, COLS = 9, MINES = 10
const isTouch = window.matchMedia('(pointer: coarse)').matches

// Fit the grid to the space the window gives us (root minus padding, header, hint, gaps, borders)
const rootEl = ref(null)
const headerEl = ref(null)
const hintEl = ref(null)
const avail = ref({ w: 200, h: 200 })
const cellSize = computed(() => {
  const size = Math.floor(Math.min(avail.value.w / COLS, avail.value.h / ROWS))
  return Math.max(14, Math.min(size, 40))
})
function updateSize() {
  const el = rootEl.value
  if (!el) return
  const CHROME = 16 + 4 // root padding + grid inset border
  const GAPS = 16       // two gap-2 between header / grid / hint
  avail.value = {
    w: el.clientWidth - CHROME,
    h: el.clientHeight - CHROME - GAPS - (headerEl.value?.offsetHeight ?? 40) - (hintEl.value?.offsetHeight ?? 15),
  }
}
let resizeObs = null
onMounted(() => {
  updateSize()
  resizeObs = new ResizeObserver(updateSize)
  resizeObs.observe(rootEl.value)
})

const cells = ref([])
const gameState = ref('idle') // idle | playing | won | lost
const timer = ref(0)
let timerInterval = null

const minesLeft = computed(() => {
  const flagged = cells.value.filter(c => c.flagged).length
  return MINES - flagged
})

const faceEmoji = computed(() => {
  if (gameState.value === 'won') return '😎'
  if (gameState.value === 'lost') return '😵'
  return '🙂'
})

function reset() {
  clearInterval(timerInterval)
  timer.value = 0
  gameState.value = 'idle'

  cells.value = Array.from({ length: ROWS * COLS }, () => ({
    mine: false, revealed: false, flagged: false, count: 0,
  }))

  // Place mines
  let placed = 0
  while (placed < MINES) {
    const i = Math.floor(Math.random() * ROWS * COLS)
    if (!cells.value[i].mine) { cells.value[i].mine = true; placed++ }
  }

  // Count neighbours
  for (let i = 0; i < ROWS * COLS; i++) {
    if (cells.value[i].mine) continue
    cells.value[i].count = neighbours(i).filter(j => cells.value[j].mine).length
  }
}

function neighbours(i) {
  const r = Math.floor(i / COLS), c = i % COLS
  const ns = []
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    if (dr === 0 && dc === 0) continue
    const nr = r + dr, nc = c + dc
    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) ns.push(nr * COLS + nc)
  }
  return ns
}

function startTimer() {
  if (timerInterval) return
  timerInterval = setInterval(() => {
    if (timer.value < 999) timer.value++
  }, 1000)
}

function reveal(i) {
  if (gameState.value === 'won' || gameState.value === 'lost') return
  const cell = cells.value[i]
  if (cell.revealed || cell.flagged) return

  if (gameState.value === 'idle') {
    gameState.value = 'playing'
    startTimer()
  }

  cell.revealed = true

  if (cell.mine) {
    gameState.value = 'lost'
    clearInterval(timerInterval)
    cells.value.forEach(c => { if (c.mine) c.revealed = true })
    return
  }

  if (cell.count === 0) {
    neighbours(i).forEach(j => {
      if (!cells.value[j].revealed && !cells.value[j].flagged) reveal(j)
    })
  }

  checkWin()
}

function flag(i) {
  if (gameState.value === 'won' || gameState.value === 'lost') return
  const cell = cells.value[i]
  if (cell.revealed) return
  cell.flagged = !cell.flagged
}

function checkWin() {
  const unrevealed = cells.value.filter(c => !c.revealed).length
  if (unrevealed === MINES) {
    gameState.value = 'won'
    clearInterval(timerInterval)
  }
}

const numberColors = ['', '#0000ff','#008000','#ff0000','#000080','#800000','#008080','#000000','#808080']

function cellClass(cell) {
  if (!cell.revealed) return 'xp-raised bg-[#c0c0c0] hover:bg-[#d0d0d0]'
  if (cell.mine) return 'bg-[#ff0000]'
  return 'xp-inset bg-[#c0c0c0]'
}

function cellLabel(cell) {
  if (!cell.revealed) return cell.flagged ? '🚩' : ''
  if (cell.mine) return '💣'
  if (cell.count === 0) return ''
  return cell.count
}

reset()

onUnmounted(() => { clearInterval(timerInterval); resizeObs?.disconnect() })

let longPressTimer = null
function onTouchStart(i) {
  longPressTimer = setTimeout(() => { flag(i); longPressTimer = null }, 500)
}
function onTouchEnd() { if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null } }
</script>

<style scoped>
.xp-inset {
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-bottom: 2px solid #fff;
  border-right: 2px solid #fff;
}
.xp-raised {
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #808080;
  border-right: 2px solid #808080;
}
</style>
