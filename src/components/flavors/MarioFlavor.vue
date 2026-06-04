<template>
  <div ref="container" class="w-screen h-screen overflow-hidden relative touch-none select-none"
    style="background:linear-gradient(180deg,#87ceeb 0%,#b0e0f5 60%,#87ceeb 100%)">
    <canvas ref="canvas" class="absolute inset-0 w-full h-full" />

    <!-- Content modals -->
    <Transition name="pop">
      <div v-if="modal" class="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-6"
        style="background:rgba(0,0,0,0.55)">
        <div class="bg-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl"
          :style="{ maxHeight: isMobile ? '88vh' : '80vh' }">
          <div class="flex items-center justify-between px-4 py-3 border-b border-[#eee] flex-shrink-0">
            <span class="font-bold text-sm">{{ modal.title }}</span>
            <button class="px-3 py-1 bg-[#e55] text-white rounded text-sm font-bold" @click="modal = null">✕</button>
          </div>
          <div class="overflow-y-auto" :style="{ maxHeight: isMobile ? 'calc(88vh - 52px)' : 'calc(80vh - 52px)' }">
            <!-- CV -->
            <MyCV v-if="modal.type === 'cv'" />
            <!-- Bio -->
            <Bio v-else-if="modal.type === 'bio'" />
            <!-- Projects -->
            <div v-else class="p-4 grid grid-cols-2 gap-3">
              <a v-for="p in projects" :key="p.id" :href="p.url" target="_blank" rel="noopener"
                class="flex items-center gap-3 p-3 rounded-xl border border-[#eee] no-underline text-inherit hover:border-[#aaa] transition-colors">
                <img :src="p.favicon" class="w-8 h-8 object-contain rounded flex-shrink-0"
                  @error="e => e.target.style.display='none'" />
                <div>
                  <div class="font-semibold text-[12px]">{{ p.label }}</div>
                  <div class="text-[#888] text-[10px] mt-0.5 leading-snug line-clamp-2">{{ p.description }}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Game over screen -->
    <Transition name="pop">
      <div v-if="gameOver"
        class="absolute inset-0 z-40 flex flex-col items-center justify-center"
        style="background:rgba(0,0,0,0.6)">
        <div class="bg-white rounded-2xl p-8 text-center shadow-2xl mx-4 max-w-sm w-full">
          <div class="text-5xl mb-3">😬</div>
          <h2 class="text-2xl font-bold mb-1">Out of birds!</h2>
          <p class="text-[#666] text-sm mb-6">You missed a few. That's ok — Dan's easy to reach.</p>
          <div class="flex flex-col gap-3">
            <a href="tel:5129214157"
              class="px-5 py-3 bg-[#34c759] text-white rounded-xl text-sm font-bold no-underline flex items-center justify-center gap-2">
              📞 Call Dan — (512) 921-4157
            </a>
            <button class="px-5 py-2.5 border border-[#ddd] rounded-xl text-sm font-medium" @click="restart">
              Try Again
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Win screen -->
    <Transition name="pop">
      <div v-if="allCleared" class="absolute inset-0 z-40 flex flex-col items-center justify-center"
        style="background:rgba(0,0,0,0.5)">
        <div class="bg-white rounded-2xl p-8 text-center shadow-2xl mx-4">
          <div class="text-5xl mb-3">🎉</div>
          <h2 class="text-2xl font-bold mb-2">You found everything!</h2>
          <p class="text-[#666] text-sm mb-6">Dan McCarthy · Austin, TX</p>
          <div class="flex flex-col gap-2">
            <a href="mailto:danshandle@gmail.com"
              class="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium no-underline">Get in touch</a>
            <button class="px-5 py-2 border border-[#ddd] rounded-lg text-sm" @click="restart">Play again</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Ammo counter -->
    <div class="absolute top-3 left-3 z-10 flex gap-1.5 items-center">
      <span v-for="i in totalBirds" :key="i"
        class="inline-block rounded-full border-2 border-[rgba(0,0,0,0.2)]"
        :style="{ width:'18px', height:'18px', background: i <= birdsLeft ? '#e52521' : 'rgba(0,0,0,0.15)' }" />
    </div>

    <!-- Score -->
    <div class="absolute top-3 right-3 z-10 font-bold text-white text-sm"
      style="text-shadow:1px 1px 3px rgba(0,0,0,0.5)">{{ score.toLocaleString() }}</div>

    <!-- Hint bubble near the slingshot -->
    <div v-if="!hasFired && !modal"
      class="absolute z-10 pointer-events-none flex flex-col items-center gap-1"
      :style="hintStyle">
      <div class="bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm whitespace-nowrap">
        👆 Drag the bird to aim
      </div>
      <div class="w-0.5 h-4 bg-black/40 rounded-full" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import MyCV from '../windows/MyCV.vue'
import Bio from '../windows/Bio.vue'
import { PROJECTS } from '../../data/projects.js'

const projects = PROJECTS
const container = ref(null)
const canvas = ref(null)
const modal = ref(null)
const hintStyle = ref({})
const isMobile = ref(window.innerWidth < 768)

// ── Game config ─────────────────────────────────────────────────────────────
const totalBirds = 6
const birdsLeft = ref(totalBirds)
const score = ref(0)
const hasFired = ref(false)
const targetsHit = ref(0)
const allCleared = computed(() => targetsHit.value >= TARGET_DEFS.length && !modal.value)
const gameOver = ref(false)

// ── Canvas state ─────────────────────────────────────────────────────────────
let W = 800, H = 500
let ctx = null
let animId = null
let dpr = 1
let animFrame = 0

// Slingshot
const SL = { x: 0, y: 0, forkW: 22, forkH: 60, trunkH: 80 }

// Bird
let bird = null
let dragging = false
let dragPos = { x: 0, y: 0 }
let inFlight = false
let trail = []

// Targets — defined as fractions, resolved after resize
const TARGET_DEFS = [
  { key: 'cv',       label: '📄 Resume',  type: 'cv',       fx: 0.48, fy: 0.55, fw: 0.14, fh: 0.10, color: '#316ac5', textColor: '#fff', pts: 1000 },
  { key: 'bio',      label: '👤 About',   type: 'bio',      fx: 0.65, fy: 0.45, fw: 0.13, fh: 0.10, color: '#34a853', textColor: '#fff', pts: 1500 },
  { key: 'projects', label: '🚀 Projects',type: 'projects', fx: 0.82, fy: 0.35, fw: 0.14, fh: 0.10, color: '#e8a000', textColor: '#fff', pts: 2000 },
]

let targets = []

function buildTargets() {
  targets = TARGET_DEFS.map(d => ({
    ...d,
    x: d.fx * W,
    y: d.fy * H,
    w: d.fw * W,
    h: d.fh * H,
    hit: false,
    cracks: [],
    shakeX: 0,
    hitFrame: 0,
  }))
}

function buildSlingshot() {
  SL.x = W * 0.18
  SL.y = H * 0.78
  SL.forkW = Math.max(16, W * 0.028)
  SL.forkH = Math.max(40, H * 0.12)
  SL.trunkH = Math.max(50, H * 0.16)
}

function resetBird() {
  bird = {
    x: SL.x,
    y: SL.y - SL.forkH * 0.7,
    vx: 0,
    vy: 0,
    r: Math.max(12, W * 0.022),
    alive: true,
  }
  inFlight = false
  dragging = false
  trail = []
}

// ── Physics ──────────────────────────────────────────────────────────────────
const GRAVITY = 0.35
const PULL_RADIUS = Math.min(W, H) * 0.1

function getPullRadius() { return Math.min(W, H) * 0.22 }

function clampPull(px, py) {
  const r = getPullRadius()
  const dx = px - SL.x, dy = py - (SL.y - SL.forkH * 0.7)
  const dist = Math.hypot(dx, dy)
  if (dist <= r) return { x: px, y: py }
  return { x: SL.x + dx / dist * r, y: SL.y - SL.forkH * 0.7 + dy / dist * r }
}

function firebird() {
  if (!bird || inFlight) return
  const cx = SL.x, cy = SL.y - SL.forkH * 0.7
  const dx = cx - dragPos.x, dy = cy - dragPos.y
  const power = 0.28
  bird.vx = dx * power
  bird.vy = dy * power
  inFlight = true
  dragging = false
  hasFired.value = true
  birdsLeft.value--
}

function trajectory(steps = 40) {
  if (!dragging) return []
  const cx = SL.x, cy = SL.y - SL.forkH * 0.7
  const dx = cx - dragPos.x, dy = cy - dragPos.y
  const power = 0.28
  let vx = dx * power, vy = dy * power
  let x = bird.x, y = bird.y
  const pts = []
  for (let i = 0; i < steps; i++) {
    x += vx; y += vy; vy += GRAVITY
    if (y > H + 50) break
    pts.push({ x, y })
  }
  return pts
}

// ── Game tick ─────────────────────────────────────────────────────────────────
function tick() {
  if (!bird || !inFlight || !bird.alive) return

  bird.x += bird.vx
  bird.y += bird.vy
  bird.vy += GRAVITY

  trail.push({ x: bird.x, y: bird.y })
  if (trail.length > 18) trail.shift()

  // Hit ground
  if (bird.y > H + bird.r * 2) {
    bird.alive = false
    setTimeout(() => {
      if (birdsLeft.value > 0) resetBird()
      else if (targetsHit.value < TARGET_DEFS.length) gameOver.value = true
    }, 800)
    return
  }

  // Check target collisions
  for (const t of targets) {
    if (t.hit) continue
    if (bird.x + bird.r > t.x && bird.x - bird.r < t.x + t.w &&
        bird.y + bird.r > t.y && bird.y - bird.r < t.y + t.h) {
      t.hit = true
      t.hitFrame = 0
      score.value += t.pts
      targetsHit.value++
      // Generate crack lines
      t.cracks = Array.from({ length: 6 }, () => ({
        x1: t.x + Math.random() * t.w,
        y1: t.y + Math.random() * t.h,
        x2: t.x + Math.random() * t.w,
        y2: t.y + Math.random() * t.h,
      }))
      bird.alive = false
      setTimeout(() => {
        modal.value = { title: t.label, type: t.type }
        if (birdsLeft.value > 0 && !targets.every(x => x.hit)) resetBird()
      }, 400)
      return
    }
  }
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  if (!ctx) return
  const c = ctx
  c.save()
  c.scale(dpr, dpr)
  c.clearRect(0, 0, W, H)

  // Sky gradient
  const sky = c.createLinearGradient(0, 0, 0, H)
  sky.addColorStop(0, '#5ca8e8')
  sky.addColorStop(0.6, '#a8d8f0')
  sky.addColorStop(1, '#c8e8c0')
  c.fillStyle = sky
  c.fillRect(0, 0, W, H)

  // Clouds
  drawCloud(c, W * 0.1, H * 0.12, 1.0)
  drawCloud(c, W * 0.35, H * 0.07, 0.7)
  drawCloud(c, W * 0.6, H * 0.15, 0.85)
  drawCloud(c, W * 0.82, H * 0.09, 0.6)

  // Ground
  const gY = H * 0.88
  c.fillStyle = '#5a9e3a'
  c.fillRect(0, gY, W, H - gY)
  c.fillStyle = '#3d7a28'
  c.fillRect(0, gY, W, 8)

  // Hills
  drawHill(c, W * 0.08, gY, W * 0.22)
  drawHill(c, W * 0.45, gY, W * 0.18)
  drawHill(c, W * 0.78, gY, W * 0.15)

  // Targets (structures)
  for (const t of targets) {
    t.hitFrame++
    drawTarget(c, t)
  }

  // Trajectory dots
  if (dragging && bird) {
    const pts = trajectory()
    c.fillStyle = 'rgba(255,255,255,0.7)'
    for (let i = 0; i < pts.length; i += 2) {
      const r = Math.max(1.5, 4 - i * 0.08)
      c.beginPath()
      c.arc(pts[i].x, pts[i].y, r, 0, Math.PI * 2)
      c.fill()
    }
  }

  // Slingshot
  drawSlingshot(c)

  // Trail
  for (let i = 0; i < trail.length; i++) {
    const a = i / trail.length
    c.fillStyle = `rgba(255,120,50,${a * 0.5})`
    c.beginPath()
    c.arc(trail[i].x, trail[i].y, bird ? bird.r * 0.5 * a : 4, 0, Math.PI * 2)
    c.fill()
  }

  // Bird
  if (bird && bird.alive) {
    const bx = dragging ? dragPos.x : bird.x
    const by = dragging ? dragPos.y : bird.y
    drawPulse(c, bx, by, bird.r, animFrame)

    // Elastic bands (only while dragging)
    if (dragging) {
      const lx = SL.x - SL.forkW / 2, ly = SL.y - SL.forkH
      const rx = SL.x + SL.forkW / 2, ry = SL.y - SL.forkH
      c.strokeStyle = '#8B4513'
      c.lineWidth = 3
      c.beginPath(); c.moveTo(lx, ly); c.lineTo(bx, by); c.stroke()
      c.beginPath(); c.moveTo(rx, ry); c.lineTo(bx, by); c.stroke()
    }

    drawBird(c, bx, by, bird.r)
  }

  c.restore()
}

function drawCloud(c, x, y, scale) {
  c.fillStyle = 'rgba(255,255,255,0.85)'
  const s = scale * 50
  c.beginPath()
  c.arc(x, y, s * 0.5, 0, Math.PI * 2)
  c.arc(x + s * 0.5, y - s * 0.2, s * 0.35, 0, Math.PI * 2)
  c.arc(x + s, y, s * 0.45, 0, Math.PI * 2)
  c.arc(x + s * 0.6, y + s * 0.25, s * 0.4, 0, Math.PI * 2)
  c.arc(x + s * 0.2, y + s * 0.25, s * 0.4, 0, Math.PI * 2)
  c.fill()
}

function drawHill(c, cx, baseY, r) {
  c.fillStyle = '#4a8c2a'
  c.beginPath()
  c.arc(cx, baseY, r, Math.PI, 0)
  c.fill()
}

function drawTarget(c, t) {
  const shake = t.hit ? 0 : t.shakeX
  const tx = t.x + shake

  if (t.hit && t.hitFrame < 30) {
    // Exploding — draw fragments
    const prog = t.hitFrame / 30
    const numFrag = 8
    for (let i = 0; i < numFrag; i++) {
      const angle = (i / numFrag) * Math.PI * 2
      const dist = prog * 60
      const fx = tx + t.w / 2 + Math.cos(angle) * dist
      const fy = t.y + t.h / 2 + Math.sin(angle) * dist + prog * 20
      const fw = t.w / 4 * (1 - prog)
      const fh = t.h / 4 * (1 - prog)
      c.fillStyle = t.color
      c.globalAlpha = 1 - prog
      c.fillRect(fx - fw / 2, fy - fh / 2, fw, fh)
    }
    c.globalAlpha = 1
    return
  }
  if (t.hit) return

  // Shadow
  c.fillStyle = 'rgba(0,0,0,0.12)'
  c.fillRect(tx + 4, t.y + 4, t.w, t.h)

  // Block
  c.fillStyle = t.color
  c.beginPath()
  c.roundRect(tx, t.y, t.w, t.h, 6)
  c.fill()

  // Highlight
  c.fillStyle = 'rgba(255,255,255,0.2)'
  c.beginPath()
  c.roundRect(tx + 3, t.y + 3, t.w - 6, t.h * 0.4, 4)
  c.fill()

  // Crack lines
  if (t.cracks.length) {
    c.strokeStyle = 'rgba(0,0,0,0.3)'
    c.lineWidth = 1.5
    for (const cr of t.cracks) {
      c.beginPath(); c.moveTo(cr.x1, cr.y1); c.lineTo(cr.x2, cr.y2); c.stroke()
    }
  }

  // Label
  c.fillStyle = t.textColor
  c.font = `bold ${Math.max(10, t.h * 0.22)}px sans-serif`
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillText(t.label, tx + t.w / 2, t.y + t.h / 2)
  c.textAlign = 'left'
  c.textBaseline = 'alphabetic'

  // Wooden legs / base
  const legW = Math.max(6, t.w * 0.1)
  c.fillStyle = '#8B5E3C'
  c.fillRect(tx + t.w * 0.1, t.y + t.h, legW, H * 0.88 - (t.y + t.h))
  c.fillRect(tx + t.w - t.w * 0.1 - legW, t.y + t.h, legW, H * 0.88 - (t.y + t.h))
}

function drawSlingshot(c) {
  const { x, y, forkW, forkH, trunkH } = SL
  const tw = Math.max(10, forkW * 0.5)
  const tipL = { x: x - forkW, y: y - forkH }
  const tipR = { x: x + forkW, y: y - forkH }
  const base = { x, y: y - trunkH * 0.35 }

  c.lineCap = 'round'
  c.lineJoin = 'round'

  // Shadow
  c.strokeStyle = 'rgba(0,0,0,0.2)'
  c.lineWidth = tw + 4
  c.beginPath(); c.moveTo(x + 3, y + 8); c.lineTo(x + 3, y - trunkH * 0.3); c.stroke()
  c.beginPath(); c.moveTo(base.x + 3, base.y); c.lineTo(tipL.x + 3, tipL.y); c.stroke()
  c.beginPath(); c.moveTo(base.x + 3, base.y); c.lineTo(tipR.x + 3, tipR.y); c.stroke()

  // Trunk
  c.strokeStyle = '#5a2d0c'
  c.lineWidth = tw
  c.beginPath(); c.moveTo(x, y + 8); c.lineTo(x, y - trunkH * 0.3); c.stroke()

  // Fork arms
  c.strokeStyle = '#6B3A10'
  c.lineWidth = tw * 0.85
  c.beginPath(); c.moveTo(base.x, base.y); c.lineTo(tipL.x, tipL.y); c.stroke()
  c.beginPath(); c.moveTo(base.x, base.y); c.lineTo(tipR.x, tipR.y); c.stroke()

  // Lighter grain highlight
  c.strokeStyle = 'rgba(255,200,100,0.25)'
  c.lineWidth = tw * 0.3
  c.beginPath(); c.moveTo(x - tw * 0.1, y + 8); c.lineTo(x - tw * 0.1, y - trunkH * 0.3); c.stroke()

  // Tip knobs
  c.fillStyle = '#8B4A18'
  c.beginPath(); c.arc(tipL.x, tipL.y, tw * 0.9, 0, Math.PI * 2); c.fill()
  c.beginPath(); c.arc(tipR.x, tipR.y, tw * 0.9, 0, Math.PI * 2); c.fill()
  c.fillStyle = '#a05520'
  c.beginPath(); c.arc(tipL.x, tipL.y, tw * 0.5, 0, Math.PI * 2); c.fill()
  c.beginPath(); c.arc(tipR.x, tipR.y, tw * 0.5, 0, Math.PI * 2); c.fill()

  // Resting band (when not dragging)
  if (!dragging && bird && bird.alive && !inFlight) {
    c.strokeStyle = '#8B5E3C'
    c.lineWidth = 2.5
    c.globalAlpha = 0.7
    c.beginPath(); c.moveTo(tipL.x, tipL.y); c.lineTo(bird.x, bird.y); c.stroke()
    c.beginPath(); c.moveTo(tipR.x, tipR.y); c.lineTo(bird.x, bird.y); c.stroke()
    c.globalAlpha = 1
  }
}

function drawPulse(c, x, y, r, frame) {
  if (inFlight || dragging) return
  const pulse = (Math.sin(frame * 0.08) + 1) / 2  // 0-1
  const pulseR = r + 6 + pulse * 10
  c.strokeStyle = `rgba(255,255,255,${0.6 - pulse * 0.4})`
  c.lineWidth = 2
  c.beginPath(); c.arc(x, y, pulseR, 0, Math.PI * 2); c.stroke()
}

function drawBird(c, x, y, r) {
  // Body
  c.fillStyle = '#e52521'
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill()
  // Highlight
  c.fillStyle = 'rgba(255,255,255,0.3)'
  c.beginPath(); c.arc(x - r * 0.25, y - r * 0.25, r * 0.45, 0, Math.PI * 2); c.fill()
  // Angry brow
  c.fillStyle = '#fff'
  c.beginPath(); c.arc(x + r * 0.2, y - r * 0.15, r * 0.28, 0, Math.PI * 2); c.fill()
  c.fillStyle = '#222'
  c.beginPath(); c.arc(x + r * 0.25, y - r * 0.1, r * 0.16, 0, Math.PI * 2); c.fill()
  c.fillStyle = '#555'
  c.strokeStyle = '#555'
  c.lineWidth = r * 0.12
  c.beginPath()
  c.moveTo(x + r * 0.05, y - r * 0.4)
  c.lineTo(x + r * 0.5, y - r * 0.25)
  c.stroke()
  // Beak
  c.fillStyle = '#f8a000'
  c.beginPath()
  c.moveTo(x + r * 0.7, y); c.lineTo(x + r * 1.1, y - r * 0.12); c.lineTo(x + r * 1.1, y + r * 0.12)
  c.closePath(); c.fill()
}

// ── Loop ──────────────────────────────────────────────────────────────────────
function loop() {
  animFrame++
  tick()
  render()
  animId = requestAnimationFrame(loop)
}

watch(modal, (val) => {
  if (val) {
    if (animId) { cancelAnimationFrame(animId); animId = null }
  } else {
    if (!animId) loop()
  }
})

// ── Resize ────────────────────────────────────────────────────────────────────
function resize() {
  const el = container.value
  if (!el || !canvas.value) return
  dpr = window.devicePixelRatio || 1
  W = el.clientWidth
  H = el.clientHeight
  canvas.value.width = W * dpr
  canvas.value.height = H * dpr
  isMobile.value = W < 768
  buildSlingshot()
  buildTargets()
  resetBird()
  updateHintStyle()
}

function updateHintStyle() {
  const birdY = SL.y - SL.forkH * 0.7
  const pct = (birdY / H) * 100
  const leftPct = (SL.x / W) * 100
  hintStyle.value = {
    bottom: `${100 - pct + 6}%`,
    left: `${leftPct}%`,
    transform: 'translateX(-50%)',
  }
}

// ── Pointer input ─────────────────────────────────────────────────────────────
function getPos(e) {
  const rect = canvas.value.getBoundingClientRect()
  const src = e.touches ? e.touches[0] : e
  return {
    x: (src.clientX - rect.left) * (W / rect.width),
    y: (src.clientY - rect.top) * (H / rect.height),
  }
}

function isNearBird(pos) {
  if (!bird || inFlight) return false
  const bx = bird.x, by = bird.y
  const hitR = bird.r * 5
  return Math.hypot(pos.x - bx, pos.y - by) < hitR
}

function onDown(e) {
  if (modal.value || inFlight || !bird || !bird.alive) return
  e.preventDefault()
  const pos = getPos(e)
  if (isNearBird(pos)) {
    dragging = true
    const clamped = clampPull(pos.x, pos.y)
    dragPos = clamped
  }
}

function onMove(e) {
  if (!dragging) return
  e.preventDefault()
  const pos = getPos(e)
  dragPos = clampPull(pos.x, pos.y)
  bird.x = dragPos.x
  bird.y = dragPos.y
}

function onUp(e) {
  if (!dragging) return
  e.preventDefault()
  firebird()
}

function restart() {
  birdsLeft.value = totalBirds
  score.value = 0
  hasFired.value = false
  targetsHit.value = 0
  modal.value = null
  gameOver.value = false
  inFlight = false
  buildTargets()
  resetBird()
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resize()
  loop()

  window.addEventListener('resize', resize)

  const el = canvas.value
  el.addEventListener('mousedown', onDown)
  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseup', onUp)
  el.addEventListener('touchstart', onDown, { passive: false })
  el.addEventListener('touchmove', onMove, { passive: false })
  el.addEventListener('touchend', onUp, { passive: false })
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
  if (canvas.value) {
    const el = canvas.value
    el.removeEventListener('mousedown', onDown)
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseup', onUp)
    el.removeEventListener('touchstart', onDown)
    el.removeEventListener('touchmove', onMove)
    el.removeEventListener('touchend', onUp)
  }
})
</script>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: opacity .2s, transform .2s; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.96) translateY(10px); }
</style>
