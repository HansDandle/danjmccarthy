<template>
  <!-- Desktop area -->
  <div
    class="w-screen overflow-hidden relative"
    style="height: calc(100vh - 30px); background: linear-gradient(180deg,#3a8fd4 0%,#6abde8 30%,#82cfee 42%,#5db85c 42%,#3ea13e 55%,#2e8a2e 100%)"
    @click="startMenuOpen = false"
  >
    <!-- Clouds -->
    <div class="cloud c1" />
    <div class="cloud c2" />
    <div class="cloud c3" />

    <!-- Left column: portfolio icons -->
    <div class="absolute top-3 left-3 flex flex-col gap-3 z-10">
      <DesktopIcon v-for="w in desktopWindows" :key="w.id"
        :icon="w.icon" :label="w.title"
        @dblclick="winStore.openWindow(w.id)"
      />
      <DesktopIcon icon="💼" label="LinkedIn" href="https://linkedin.com/in/danjmccarthy" />
      <DesktopIcon icon="🐙" label="GitHub" href="https://github.com/HansDandle" />
    </div>

    <!-- Right column: project icons -->
    <div class="absolute top-3 right-3 flex flex-col gap-3 z-10">
      <DesktopIcon
        v-for="p in PROJECTS"
        :key="p.id"
        :img-src="p.favicon"
        :label="p.label"
        :href="p.url"
      />
    </div>

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

  <!-- Taskbar -->
  <Taskbar
    :open-windows="openWindows"
    :active-id="winStore.activeWindowId"
    @toggle-start="startMenuOpen = !startMenuOpen"
    @taskbar-click="onTaskbarClick"
  />

  <!-- Start menu -->
  <StartMenu
    :open="startMenuOpen"
    @open="id => { winStore.openWindow(id); startMenuOpen = false }"
    @close="startMenuOpen = false"
  />

  <!-- Overlay to close start menu -->
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

const desktopWindows = WINDOWS.filter(w => w.onDesktop)
const openWindows = computed(() => winStore.openWindows)

function winDef(id) {
  const w = WINDOWS.find(w => w.id === id)
  return {
    id: w.id, title: w.title, icon: w.icon,
    initX: w.initX, initY: w.initY,
    initW: w.initW, initH: w.initH,
    minW: w.minW, minH: w.minH,
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

<style scoped>
.cloud {
  position: absolute;
  background: rgba(255,255,255,0.85);
  border-radius: 50px;
  filter: blur(2px);
  pointer-events: none;
}
.cloud::before, .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}
.c1 { width:120px; height:35px; top:8%; left:8%; }
.c1::before { width:70px; height:55px; top:-30px; left:15px; }
.c1::after  { width:50px; height:40px; top:-20px; left:55px; }
.c2 { width:90px; height:28px; top:14%; left:55%; }
.c2::before { width:55px; height:45px; top:-25px; left:10px; }
.c2::after  { width:40px; height:32px; top:-16px; left:42px; }
.c3 { width:70px; height:22px; top:6%; left:75%; }
.c3::before { width:40px; height:35px; top:-20px; left:8px; }
.c3::after  { width:30px; height:25px; top:-13px; left:32px; }
</style>
