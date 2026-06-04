<template>
  <div
    class="w-screen relative"
    :class="isMobile ? 'overflow-y-auto' : 'overflow-hidden'"
    style="height: calc(100vh - 30px)"
    :style="{ backgroundImage: 'url(/bliss.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }"
    @click="startMenuOpen = false"
  >
    <!-- Mobile: scrollable icon grid -->
    <div v-if="isMobile" class="grid gap-3 p-3" style="grid-template-columns: repeat(3, 1fr)">
      <DesktopIcon
        v-for="ic in allIcons" :key="ic.id"
        :icon="ic.icon"
        :img-src="ic.imgSrc"
        :label="ic.label"
        :href="ic.href"
        :tooltip="ic.tooltip"
        :mobile="true"
        @open="winStore.openWindow(ic.id)"
      />
    </div>

    <!-- Desktop icons (draggable, absolutely positioned) -->
    <template v-else>
    <DesktopIcon
      v-for="ic in allIcons" :key="ic.id"
      :icon="ic.icon"
      :img-src="ic.imgSrc"
      :label="ic.label"
      :href="ic.href"
      :tooltip="ic.tooltip"
      :init-x="ic.x"
      :init-y="ic.y"
      @open="winStore.openWindow(ic.id)"
    />

    </template>

    <!-- Windows -->
    <XpWindow
      v-for="w in openWindows"
      :key="w.id"
      v-bind="winDef(w.id)"
      :is-active="w.id === winStore.activeWindowId"
      :minimized="w.minimized"
      :z-index="w.z"
      :mobile="isMobile"
      @close="winStore.closeWindow(w.id)"
      @minimize="winStore.toggleMinimize(w.id)"
      @activate="winStore.setActive(w.id)"
    >
      <component :is="windowComponent(w.id)" />
    </XpWindow>
  </div>

  <Taskbar
    :open-windows="openWindows"
    :active-id="winStore.activeWindowId"
    @toggle-start="startMenuOpen = !startMenuOpen"
    @taskbar-click="onTaskbarClick"
  />

  <StartMenu
    :open="startMenuOpen"
    @open="id => { winStore.openWindow(id); startMenuOpen = false }"
    @close="startMenuOpen = false"
    @reset="$emit('reset')"
  />

  <div v-if="startMenuOpen" class="fixed inset-0 z-[9997]" @click="startMenuOpen = false" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWindowsStore } from '../stores/windowsStore.js'
import { WINDOWS } from '../data/windows.js'
import { PROJECTS } from '../data/projects.js'
import XpWindow from './XpWindow.vue'
import DesktopIcon from './DesktopIcon.vue'
import Taskbar from './Taskbar.vue'
import StartMenu from './StartMenu.vue'
import MyCV from './windows/MyCV.vue'
import Minesweeper from './windows/Minesweeper.vue'
import Terminal from './windows/Terminal.vue'
import Bio from './windows/Bio.vue'

defineEmits(['reset'])
const winStore = useWindowsStore()
const startMenuOpen = ref(false)
const openWindows = computed(() => winStore.openWindows)

const isMobile = ref(window.innerWidth < 768)
function onResize() { isMobile.value = window.innerWidth < 768 }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

// ── Icon grid layout helper ──────────────────────────────
// Lays out icons in a 2-column grid starting from (startX, startY)
const COL_W = 130  // icon width + gap
const ROW_H = 110  // icon height + gap

function gridPos(index, startX = 10, startY = 10, cols = 2) {
  const col = index % cols
  const row = Math.floor(index / cols)
  return { x: startX + col * COL_W, y: startY + row * ROW_H }
}

// Portfolio windows (openable)
const portfolioIcons = WINDOWS.filter(w => w.onDesktop).map((w, i) => ({
  id: w.id,
  icon: w.icon,
  label: w.title,
  ...gridPos(i),
}))

// Static link icons appended after portfolio windows
const linkIcons = [
  { id: 'linkedin', icon: '💼', label: 'LinkedIn', href: 'https://linkedin.com/in/danjmccarthy' },
  { id: 'github',   icon: '🐙', label: 'GitHub',   href: 'https://github.com/HansDandle' },
].map((ic, i) => ({
  ...ic,
  ...gridPos(portfolioIcons.length + i),
}))

// Project icons — continue the grid after portfolio icons
const projectIcons = PROJECTS.map((p, i) => ({
  id: p.id,
  imgSrc: p.favicon,
  label: p.label,
  href: p.url,
  tooltip: p.description,
  ...gridPos(portfolioIcons.length + linkIcons.length + i),
}))

const allIcons = [...portfolioIcons, ...linkIcons, ...projectIcons]

// ── Window plumbing ──────────────────────────────────────
function winDef(id) {
  const w = WINDOWS.find(w => w.id === id)
  return {
    id: w.id, title: w.title, icon: w.icon,
    initX: w.initX, initY: w.initY,
    initW: w.initW, initH: w.initH,
    minW: w.minW,   minH: w.minH,
    resizable: w.resizable !== false,
  }
}

const componentMap = { cv: MyCV, minesweeper: Minesweeper, terminal: Terminal, bio: Bio }
function windowComponent(id) { return componentMap[id] }

function onTaskbarClick(id) {
  const w = winStore.openWindows.find(x => x.id === id)
  if (!w) return
  if (winStore.activeWindowId === id && !w.minimized) winStore.toggleMinimize(id)
  else winStore.setActive(id)
}
</script>
