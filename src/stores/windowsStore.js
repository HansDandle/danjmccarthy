import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWindowsStore = defineStore('windows', () => {
  const openWindows = ref([])
  const activeWindowId = ref(null)
  const highestZ = ref(100)

  function openWindow(id) {
    const existing = openWindows.value.find(w => w.id === id)
    if (existing) {
      if (existing.minimized) existing.minimized = false
      setActive(id)
      return
    }
    highestZ.value++
    openWindows.value.push({ id, minimized: false, z: highestZ.value })
    activeWindowId.value = id
  }

  function closeWindow(id) {
    openWindows.value = openWindows.value.filter(w => w.id !== id)
    if (activeWindowId.value === id) {
      activeWindowId.value = openWindows.value.at(-1)?.id ?? null
    }
  }

  function toggleMinimize(id) {
    const w = openWindows.value.find(w => w.id === id)
    if (!w) return
    w.minimized = !w.minimized
    if (w.minimized && activeWindowId.value === id) {
      activeWindowId.value = openWindows.value.filter(x => !x.minimized).at(-1)?.id ?? null
    } else if (!w.minimized) {
      setActive(id)
    }
  }

  function setActive(id) {
    highestZ.value++
    const w = openWindows.value.find(w => w.id === id)
    if (w) {
      w.z = highestZ.value
      w.minimized = false
    }
    activeWindowId.value = id
  }

  return { openWindows, activeWindowId, highestZ, openWindow, closeWindow, toggleMinimize, setActive }
})
