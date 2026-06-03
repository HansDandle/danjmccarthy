<template>
  <div
    class="w-screen overflow-hidden relative"
    style="height: calc(100vh - 30px)"
    :style="{ backgroundImage: 'url(/bliss.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }"
    @click="startMenuOpen = false"
  >
    <!-- Desktop icons (all draggable, absolutely positioned) -->
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

    <!-- Windows -->
    <XpWindow
      v-for="w in openWindows"
      :key="w.id"
      v-bind="winDef(w.id)"
      :is-active="w.id === winStore.activeWindowId"
      :minimized="w.minimized"
      :z-index="w.z"
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
  />

  <div v-if="startMenuOpen" class="fixed inset-0 z-[9997]" @click="startMenuOpen = false" />
</template>

<script setup>
import { ref, computed } from 'vue'
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

const winStore = useWindowsStore()
const startMenuOpen = ref(false)
const openWindows = computed(() => winStore.openWindows)

// ── Icon grid layout helper ──────────────────────────────
// Lays out icons in a 2-column grid starting from (startX, startY)
const COL_W = 88   // icon width + gap
const ROW_H = 90   // icon height + gap

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
