<template>
  <div class="bg-[#c0c0c0] p-2 flex flex-col items-center gap-2 select-none h-full" style="font-family: 'Courier New', monospace">
    <!-- Header panel -->
    <div class="xp-inset w-full px-2 py-1 bg-[#c0c0c0] flex items-center justify-between">
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

    <p class="text-[10px] text-[#444]">Tap: reveal · Long-press: flag</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const ROWS = 9, COLS = 9, MINES = 10

const containerW = ref(300)
const cellSize = computed(() => Math.floor(Math.min(containerW.value - 16, window.innerHeight * 0.55) / COLS))
function updateSize() { containerW.value = Math.min(window.innerWidth, 500) }
onMounted(() => { updateSize(); window.addEventListener('resize', updateSize) })

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

onUnmounted(() => { clearInterval(timerInterval); window.removeEventListener('resize', updateSize) })

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
