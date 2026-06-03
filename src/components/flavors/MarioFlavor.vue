<template>
  <div class="w-screen h-screen overflow-hidden relative" style="background:#5c94fc; image-rendering:pixelated">
    <canvas ref="canvas" class="absolute inset-0" :width="W" :height="H" style="width:100%;height:100%;image-rendering:pixelated" />

    <!-- Resume popup -->
    <Transition name="popup">
      <div v-if="showResume" class="absolute inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.6)">
        <div class="bg-white rounded-2xl overflow-hidden w-full max-w-lg" style="max-height:80vh">
          <div class="flex items-center justify-between px-4 py-3 border-b border-[#eee]">
            <span class="font-bold text-sm">📄 resume.txt</span>
            <button class="text-sm px-3 py-1 bg-[#e52521] text-white rounded font-bold" @click="showResume = false">Close ×</button>
          </div>
          <div class="overflow-y-auto" style="max-height:calc(80vh - 52px)">
            <MyCV />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bio popup (Toad dialog) -->
    <Transition name="popup">
      <div v-if="showBio" class="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 w-[min(420px,90vw)]">
        <div class="bg-white border-4 border-[#333] rounded-lg p-4 shadow-2xl relative" style="font-family:'Courier New',monospace">
          <div class="absolute -top-8 left-4 text-3xl">🍄</div>
          <div class="flex items-center gap-2 mb-2">
            <span class="font-bold text-sm text-[#e52521]">TOAD</span>
            <span class="text-[10px] text-[#888]">NPC · Mushroom Kingdom, Austin TX</span>
          </div>
          <p class="text-[12px] leading-relaxed text-[#333]">{{ bioLines[bioPage] }}</p>
          <div class="flex justify-between items-center mt-3">
            <span class="text-[10px] text-[#aaa]">{{ bioPage + 1 }} / {{ bioLines.length }}</span>
            <button class="text-[11px] px-3 py-1 bg-[#e52521] text-white rounded font-bold" @click="nextBio">
              {{ bioPage < bioLines.length - 1 ? 'Next ▶' : 'Thanks! ✕' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- World select -->
    <Transition name="warp">
      <div v-if="showWorldSelect" class="absolute inset-0 z-50 flex flex-col items-center justify-center p-6"
        style="background:linear-gradient(180deg,#000 0%,#1a0a2e 100%)">
        <h2 class="text-white font-bold text-2xl mb-2" style="font-family:'Courier New',monospace;text-shadow:0 0 20px #fff">- WORLD SELECT -</h2>
        <p class="text-[#aaa] text-sm mb-8" style="font-family:'Courier New',monospace">Choose a project to explore</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-xl">
          <a
            v-for="(p, i) in projects" :key="p.id"
            :href="p.url" target="_blank" rel="noopener"
            class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-[#444] hover:border-[#ffcc00] transition-colors no-underline text-white cursor-pointer"
            style="background:rgba(255,255,255,0.05)"
          >
            <div class="text-lg font-bold" style="font-family:'Courier New',monospace;color:#ffcc00">{{ `WORLD ${i+1}-1` }}</div>
            <img :src="p.favicon" :alt="p.label" class="w-10 h-10 object-contain rounded" @error="e => e.target.style.display='none'" />
            <span class="text-[11px] text-center leading-tight">{{ p.label }}</span>
          </a>
        </div>
        <button class="mt-8 text-[#888] text-sm hover:text-white transition-colors" style="font-family:'Courier New',monospace" @click="restartMario">↩ Play Again</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MyCV from '../windows/MyCV.vue'
import { PROJECTS } from '../../data/projects.js'

const projects = PROJECTS
const canvas = ref(null)
const showResume = ref(false)
const showBio = ref(false)
const showWorldSelect = ref(false)
const bioPage = ref(0)

const bioLines = [
  "It's-a me, TOAD! Welcome to Dan McCarthy's portfolio!",
  "Dan's a B2B SaaS veteran - 8 years of enterprise onboarding, customer success, and getting people to actually use software.",
  "He also runs Scout Industries - a portfolio of indie SaaS products he built with AI tooling. Real products, real users.",
  "He hosts TriviATX - Austin's best pub quiz, 100+ editions and counting. Ask him anything.",
  "Code coxswain: he doesn't row, he steers. Claude handles the oars. But knowing where to go? That's all Dan.",
]

function nextBio() {
  if (bioPage.value < bioLines.length - 1) { bioPage.value++; return }
  showBio.value = false
  // resume game after Toad
  if (gameState) gameState.phase = 'WALK_PIPE'
}

// ── Canvas game ───────────────────────────────────────────────────────────────

const W = 800, H = 300
const GROUND = H - 48

// Colors
const C = {
  sky: '#5c94fc',
  cloud: '#fff',
  ground: '#c84b0c',
  groundTop: '#59b135',
  brick: '#b56010',
  brickHL: '#d47820',
  qBlock: '#e8a000',
  qBlockHL: '#ffd000',
  mario: '#e52521',
  marioSkin: '#ffd0a0',
  goomba: '#a05000',
  pipe: '#00a000',
  pipeDark: '#007000',
  toad: '#fff',
  toadSpot: '#e52521',
  star: '#ffff00',
  text: '#fff',
}

let ctx = null
let animId = null
let gameState = null

const SCROLL_SPEED = 1.8

// Mario sprite (simple pixel-art using rects)
function drawMario(c, x, y, frame, dead = false) {
  const sx = Math.floor(x), sy = Math.floor(y)
  if (dead) {
    // Spinning dead mario
    c.save()
    c.translate(sx + 8, sy + 12)
    c.rotate(frame * 0.3)
    c.fillStyle = C.mario
    c.fillRect(-8, -8, 16, 10)
    c.fillStyle = C.marioSkin
    c.fillRect(-4, -14, 8, 8)
    c.restore()
    return
  }
  // Body
  c.fillStyle = C.mario
  c.fillRect(sx, sy + 10, 16, 10) // shirt
  c.fillRect(sx + 2, sy + 20, 12, 4) // pants top
  // Legs (walking animation)
  const legOffset = Math.sin(frame * 0.4) * 3
  c.fillRect(sx + 2, sy + 24, 5, 4 + legOffset) // left leg
  c.fillRect(sx + 9, sy + 24, 5, 4 - legOffset) // right leg
  // Shoes
  c.fillStyle = '#5c3a00'
  c.fillRect(sx, sy + 28 + legOffset, 7, 3)
  c.fillRect(sx + 9, sy + 28 - legOffset, 7, 3)
  // Head
  c.fillStyle = C.marioSkin
  c.fillRect(sx + 2, sy + 2, 12, 10)
  // Hat
  c.fillStyle = C.mario
  c.fillRect(sx + 1, sy, 14, 5)
  c.fillRect(sx, sy + 3, 16, 3)
  // Eyes
  c.fillStyle = '#000'
  c.fillRect(sx + 10, sy + 4, 2, 2)
  // Mustache
  c.fillStyle = '#5c3a00'
  c.fillRect(sx + 7, sy + 8, 8, 2)
  // Overalls
  c.fillStyle = '#003cff'
  c.fillRect(sx + 3, sy + 14, 10, 6)
}

function drawGoomba(c, x, y, frame, squished = false) {
  const sx = Math.floor(x), sy = Math.floor(y)
  if (squished) {
    c.fillStyle = C.goomba
    c.fillRect(sx, sy + 22, 20, 6)
    c.fillStyle = '#000'
    c.fillRect(sx + 2, sy + 24, 4, 2)
    c.fillRect(sx + 14, sy + 24, 4, 2)
    return
  }
  // Body
  c.fillStyle = C.goomba
  c.fillRect(sx + 2, sy + 8, 16, 14)
  // Head
  c.fillRect(sx, sy, 20, 12)
  // Feet (walking)
  const legOff = Math.sin(frame * 0.35) * 2
  c.fillStyle = '#7a3800'
  c.fillRect(sx + 1, sy + 22, 7, 6 + legOff)
  c.fillRect(sx + 12, sy + 22, 7, 6 - legOff)
  // Eyes
  c.fillStyle = '#fff'
  c.fillRect(sx + 3, sy + 3, 5, 5)
  c.fillRect(sx + 12, sy + 3, 5, 5)
  c.fillStyle = '#000'
  c.fillRect(sx + 5, sy + 4, 2, 3)
  c.fillRect(sx + 14, sy + 4, 2, 3)
  // Angry brows
  c.fillStyle = '#000'
  c.fillRect(sx + 2, sy + 2, 7, 2)
  c.fillRect(sx + 11, sy + 2, 7, 2)
  c.fillRect(sx + 2, sy + 1, 3, 2)
  c.fillRect(sx + 15, sy + 1, 3, 2)
}

function drawBrick(c, x, y, broken = false) {
  if (broken) return
  const sx = Math.floor(x), sy = Math.floor(y)
  c.fillStyle = C.brick
  c.fillRect(sx, sy, 32, 32)
  c.fillStyle = C.brickHL
  c.fillRect(sx + 1, sy + 1, 14, 6)
  c.fillRect(sx + 17, sy + 1, 14, 6)
  c.fillRect(sx + 1, sy + 9, 30, 1)
  c.fillRect(sx + 9, sy + 10, 14, 6)
  c.fillRect(sx + 1, sy + 17, 6, 6)
  c.fillRect(sx + 25, sy + 17, 6, 6)
  c.fillRect(sx + 1, sy + 25, 30, 1)
  c.fillRect(sx + 1, sy + 26, 14, 5)
  c.fillRect(sx + 17, sy + 26, 14, 5)
}

function drawQBlock(c, x, y, hit = false) {
  const sx = Math.floor(x), sy = Math.floor(y)
  c.fillStyle = hit ? '#888' : C.qBlock
  c.fillRect(sx, sy, 32, 32)
  if (!hit) {
    c.fillStyle = C.qBlockHL
    c.fillRect(sx + 2, sy + 2, 28, 4)
    c.fillRect(sx + 2, sy + 2, 4, 28)
    // ? mark
    c.fillStyle = '#fff'
    c.fillRect(sx + 12, sy + 6, 8, 4)
    c.fillRect(sx + 16, sy + 10, 4, 6)
    c.fillRect(sx + 12, sy + 18, 8, 4)
    c.fillRect(sx + 12, sy + 24, 8, 4)
  } else {
    c.fillStyle = '#666'
    c.fillRect(sx + 2, sy + 2, 28, 4)
    c.fillRect(sx + 2, sy + 2, 4, 28)
  }
}

function drawPipe(c, x, y, h = 80) {
  const sx = Math.floor(x), sy = Math.floor(y)
  c.fillStyle = C.pipe
  c.fillRect(sx + 4, sy + 16, 48, h)
  c.fillStyle = C.pipeDark
  c.fillRect(sx + 4, sy + 16, 8, h) // shadow left
  c.fillRect(sx + 40, sy + 16, 12, h) // shadow right
  // Pipe head
  c.fillStyle = C.pipe
  c.fillRect(sx, sy, 56, 20)
  c.fillStyle = C.pipeDark
  c.fillRect(sx, sy, 10, 20)
  c.fillRect(sx + 46, sy, 10, 20)
  c.fillRect(sx, sy, 56, 6)
}

function drawToad(c, x, y) {
  const sx = Math.floor(x), sy = Math.floor(y)
  // Body white
  c.fillStyle = '#fff'
  c.fillRect(sx + 2, sy + 12, 16, 14)
  // Head
  c.fillRect(sx, sy, 20, 14)
  // Vest
  c.fillStyle = '#3050c0'
  c.fillRect(sx + 4, sy + 14, 12, 12)
  // Mushroom cap
  c.fillStyle = '#fff'
  c.fillRect(sx - 4, sy - 10, 28, 14)
  c.fillStyle = C.toadSpot
  c.fillRect(sx - 2, sy - 8, 8, 8)
  c.fillRect(sx + 14, sy - 8, 8, 8)
  c.fillRect(sx + 6, sy - 4, 8, 4)
  // Eyes
  c.fillStyle = '#000'
  c.fillRect(sx + 3, sy + 4, 4, 4)
  c.fillRect(sx + 13, sy + 4, 4, 4)
  c.fillStyle = '#fff'
  c.fillRect(sx + 4, sy + 4, 2, 2)
  c.fillRect(sx + 14, sy + 4, 2, 2)
}

function drawCloud(c, x, y) {
  const sx = Math.floor(x), sy = Math.floor(y)
  c.fillStyle = C.cloud
  c.fillRect(sx + 8, sy + 8, 32, 16)
  c.fillRect(sx, sy + 16, 48, 12)
  c.fillRect(sx + 4, sy + 8, 16, 8)
  c.fillRect(sx + 28, sy + 8, 12, 8)
  c.fillRect(sx + 16, sy + 2, 16, 12)
}

function drawGround(c, scrollX) {
  // Ground strip
  c.fillStyle = C.groundTop
  c.fillRect(0, GROUND, W, 8)
  c.fillStyle = C.ground
  c.fillRect(0, GROUND + 8, W, H - GROUND - 8)
  // Ground pattern tiles
  c.fillStyle = '#a03808'
  for (let tx = (-(scrollX % 32) + 32) % 32 - 32; tx < W + 32; tx += 32) {
    c.fillRect(tx, GROUND + 8, 1, H - GROUND - 8)
    c.fillRect(tx + 16, GROUND + 8, 1, H - GROUND - 8)
  }
}

function drawHUD(c, score, coins) {
  c.fillStyle = '#fff'
  c.font = 'bold 14px "Courier New"'
  c.fillText(`MARIO`, 20, 20)
  c.fillText(String(score).padStart(6, '0'), 20, 36)
  c.fillText(`🪙 x${String(coins).padStart(2, '0')}`, W / 2 - 30, 28)
  c.fillText(`WORLD`, W - 100, 20)
  c.fillText(`  1-1`, W - 100, 36)
}

// ── Game state machine ─────────────────────────────────────────────────────

function createState() {
  return {
    frame: 0,
    scrollX: 0,
    phase: 'WALK_GOOMBA', // phases: WALK_GOOMBA, JUMP_GOOMBA, SQUISH_PAUSE, WALK_BRICK, JUMP_BRICK, RESUME_PAUSE, WALK_TOAD, TOAD_TALK, WALK_PIPE, PIPE_ENTER, DONE
    score: 0,
    coins: 0,

    mario: { x: 60, y: GROUND - 32, vy: 0, onGround: true },

    goomba: { x: 340, y: GROUND - 28, alive: true, squished: false, squishTimer: 0 },

    // blocks at world x-coords (relative to scroll)
    brickX: 520,
    brickBroken: false,
    brickBumpY: 0,
    brickBumpDir: 0,

    qBlockX: 556,
    qBlockHit: false,
    qBlockBumpY: 0,

    // flying resume item
    resumeItem: null, // { x, y, vy }

    toadX: 720,

    pipeX: 920,

    // clouds (parallax)
    clouds: [
      { x: 80, y: 40 },
      { x: 240, y: 60 },
      { x: 440, y: 30 },
      { x: 600, y: 55 },
    ],

    phaseTimer: 0,
    // jumpQueued is internal timing
    _jumpDone: false,
  }
}

function tick(s) {
  s.frame++
  s.phaseTimer++

  const MARIO_SCREEN_X = 80 // mario stays ~here on screen

  // ── Physics ──
  const m = s.mario
  if (!m.onGround) {
    m.vy += 0.55
    m.y += m.vy
    if (m.y >= GROUND - 32) {
      m.y = GROUND - 32
      m.vy = 0
      m.onGround = true
    }
  }

  // ── Goomba ──
  const g = s.goomba
  if (g.squished) {
    g.squishTimer++
    if (g.squishTimer > 40) g.alive = false
  }

  // ── Brick bump ──
  if (s.brickBumpDir !== 0) {
    s.brickBumpY += s.brickBumpDir * 4
    if (Math.abs(s.brickBumpY) >= 12) s.brickBumpDir *= -1
    if (s.brickBumpDir === 1 && s.brickBumpY >= 0) { s.brickBumpY = 0; s.brickBumpDir = 0 }
  }
  if (s.qBlockBumpY !== 0) {
    // similar for q block but we track it separately
    s.qBlockBumpY += s.qBlockBumpDir * 4
    if (Math.abs(s.qBlockBumpY) >= 12) s.qBlockBumpDir *= -1
    if (s.qBlockBumpDir === 1 && s.qBlockBumpY >= 0) { s.qBlockBumpY = 0; s.qBlockBumpDir = 0 }
  }

  // ── Resume item falling ──
  if (s.resumeItem) {
    s.resumeItem.vy += 0.4
    s.resumeItem.y += s.resumeItem.vy
    if (s.resumeItem.y > GROUND - 24) {
      s.resumeItem.y = GROUND - 24
      s.resumeItem.vy = 0
    }
  }

  // ── Scroll: keep mario near MARIO_SCREEN_X ──
  const targetScrollX = m.x - MARIO_SCREEN_X
  s.scrollX += (targetScrollX - s.scrollX) * 0.12

  // ── Phase logic ──
  switch (s.phase) {

    case 'WALK_GOOMBA':
      m.x += SCROLL_SPEED
      // Jump when close to goomba (screen space)
      if (g.alive && m.x + 30 >= g.x - 60 && !s._jumpDone) {
        s._jumpDone = true
        m.vy = -11
        m.onGround = false
      }
      // Check stomp
      if (g.alive && !g.squished && m.x + 12 >= g.x && m.x < g.x + 20 && m.y + 32 >= g.y && m.vy > 0) {
        g.squished = true
        g.squishTimer = 0
        m.vy = -6
        s.score += 100
        s.phase = 'SQUISH_PAUSE'
        s.phaseTimer = 0
      }
      break

    case 'SQUISH_PAUSE':
      m.x += SCROLL_SPEED * 0.5
      if (s.phaseTimer > 30) { s.phase = 'WALK_BRICK'; s._jumpDone = false; s.phaseTimer = 0 }
      break

    case 'WALK_BRICK': {
      m.x += SCROLL_SPEED
      const brickScreenX = s.brickX - s.scrollX
      if (!s.brickBroken && m.x + 8 >= s.brickX - 20 && !s._jumpDone) {
        s._jumpDone = true
        m.vy = -11
        m.onGround = false
      }
      // Check if mario head hits brick from below
      if (!s.brickBroken && !m.onGround && m.vy < 0
        && m.x + 4 < s.brickX + 32 && m.x + 28 > s.brickX
        && m.y <= GROUND - 32 - 100 && m.y >= GROUND - 32 - 110) {
        s.brickBroken = true
        s.brickBumpDir = -1
        s.score += 50
        // launch resume item from q-block
      }
      // After breaking, check q-block
      if (s.brickBroken && !s.qBlockHit && m.x + 8 >= s.qBlockX - 20 && !s._jumpDone) {
        s._jumpDone = false // reset for q block
        m.vy = -11
        m.onGround = false
        s._jumpDone = true
      }
      if (!s.qBlockHit && !m.onGround && m.vy < 0
        && m.x + 4 < s.qBlockX + 32 && m.x + 28 > s.qBlockX
        && m.y <= GROUND - 32 - 100 && m.y >= GROUND - 32 - 115) {
        s.qBlockHit = true
        s.qBlockBumpDir = -1
        s.qBlockBumpY = 0
        s.score += 200
        s.coins++
        // Spawn resume item
        s.resumeItem = { x: s.qBlockX + 6, y: GROUND - 32 - 132, vy: -3 }
        s.phase = 'RESUME_PAUSE'
        s.phaseTimer = 0
      }
      break
    }

    case 'RESUME_PAUSE':
      m.x += SCROLL_SPEED * 0.3
      if (s.phaseTimer > 90) {
        s.phase = 'WALK_TOAD'
        s._jumpDone = false
        s.phaseTimer = 0
        showResume.value = true
      }
      break

    case 'WALK_TOAD':
      if (showResume.value) { m.x += 0; break } // paused while resume open
      m.x += SCROLL_SPEED
      if (m.x + 20 >= s.toadX - 30) {
        s.phase = 'TOAD_TALK'
        s.phaseTimer = 0
        showBio.value = true
        bioPage.value = 0
      }
      break

    case 'TOAD_TALK':
      // wait for bio to close (nextBio sets phase to WALK_PIPE)
      break

    case 'WALK_PIPE':
      if (showBio.value) break
      m.x += SCROLL_SPEED
      if (m.x + 16 >= s.pipeX + 4) {
        s.phase = 'PIPE_ENTER'
        s.phaseTimer = 0
      }
      break

    case 'PIPE_ENTER':
      m.y += 2.5
      s.phaseTimer++
      if (s.phaseTimer > 50) {
        s.phase = 'DONE'
        showWorldSelect.value = true
      }
      break
  }

  // Cloud parallax
  for (const cl of s.clouds) {
    cl.x -= 0.3
    if (cl.x + 48 < 0) cl.x = W + 40
  }
}

function render(s) {
  if (!ctx) return
  const c = ctx
  c.clearRect(0, 0, W, H)

  // Sky
  c.fillStyle = C.sky
  c.fillRect(0, 0, W, H)

  // Clouds
  for (const cl of s.clouds) drawCloud(c, cl.x, cl.y)

  // Ground
  drawGround(c, s.scrollX)

  // Blocks (world coords -> screen coords)
  const bSx = s.brickX - s.scrollX
  const qSx = s.qBlockX - s.scrollX
  const pSx = s.pipeX - s.scrollX
  const tSx = s.toadX - s.scrollX
  const gSx = s.goomba.x - s.scrollX

  if (bSx > -40 && bSx < W + 40) drawBrick(c, bSx, GROUND - 32 - 96 + s.brickBumpY, s.brickBroken)
  if (qSx > -40 && qSx < W + 40) drawQBlock(c, qSx, GROUND - 32 - 96 + s.qBlockBumpY, s.qBlockHit)

  // Resume item
  if (s.resumeItem) {
    const rx = s.resumeItem.x - s.scrollX
    c.fillStyle = '#fff'
    c.fillRect(rx, s.resumeItem.y, 20, 24)
    c.fillStyle = '#316ac5'
    c.fillRect(rx + 2, s.resumeItem.y + 2, 16, 2)
    c.fillRect(rx + 2, s.resumeItem.y + 6, 16, 2)
    c.fillRect(rx + 2, s.resumeItem.y + 10, 10, 2)
    c.fillStyle = '#e52521'
    c.font = 'bold 7px "Courier New"'
    c.fillText('CV', rx + 5, s.resumeItem.y + 20)
  }

  // Pipe
  if (pSx > -60 && pSx < W + 60) drawPipe(c, pSx, GROUND - 80, 80)

  // Toad
  if (tSx > -30 && tSx < W + 30) drawToad(c, tSx, GROUND - 32)

  // Goomba
  if (s.goomba.alive && gSx > -30 && gSx < W + 30)
    drawGoomba(c, gSx, GROUND - 28, s.frame, s.goomba.squished)

  // Mario
  const mSx = s.mario.x - s.scrollX
  drawMario(c, mSx, s.mario.y, s.frame)

  // HUD
  drawHUD(c, s.score, s.coins)

  // Phase hint text
  if (s.phase === 'WALK_GOOMBA' && s.frame < 120) {
    c.fillStyle = 'rgba(0,0,0,0.5)'
    c.fillRect(W / 2 - 110, H - 36, 220, 22)
    c.fillStyle = '#fff'
    c.font = '12px "Courier New"'
    c.textAlign = 'center'
    c.fillText('Auto-playing... sit back and watch!', W / 2, H - 21)
    c.textAlign = 'left'
  }
}

function loop() {
  if (!gameState) return
  tick(gameState)
  render(gameState)
  if (gameState.phase !== 'DONE') animId = requestAnimationFrame(loop)
}

function restartMario() {
  showWorldSelect.value = false
  showResume.value = false
  showBio.value = false
  bioPage.value = 0
  gameState = createState()
  if (animId) cancelAnimationFrame(animId)
  loop()
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  gameState = createState()
  loop()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<style scoped>
.popup-enter-active, .popup-leave-active { transition: opacity .2s, transform .2s; }
.popup-enter-from, .popup-leave-to { opacity: 0; transform: scale(0.95); }
.warp-enter-active, .warp-leave-active { transition: opacity .4s; }
.warp-enter-from, .warp-leave-to { opacity: 0; }
</style>
