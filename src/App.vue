<template>
  <div class="w-screen h-screen overflow-hidden">
    <FlavorPicker v-if="!flavor" @pick="onPick" />

    <template v-else-if="flavor === 'xp'">
      <BootSequence v-if="booting" @done="booting = false" />
      <Desktop v-else @reset="reset" />
    </template>

    <template v-else>
      <NormalFlavor  v-if="flavor === 'normal'" />
      <IphoneFlavor  v-else-if="flavor === 'iphone'" />
      <MarioFlavor   v-else-if="flavor === 'mario'" />

      <!-- Prominent back-to-picker button for non-XP flavors -->
      <button
        class="fixed bottom-6 right-4 z-[99999] flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm shadow-lg transition-all active:scale-95"
        style="background:rgba(30,30,40,0.85);color:#fff;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15)"
        @click="reset"
      >
        ← Change Experience
      </button>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import FlavorPicker from './components/FlavorPicker.vue'
import BootSequence from './components/BootSequence.vue'
import Desktop from './components/Desktop.vue'
import NormalFlavor from './components/flavors/NormalFlavor.vue'
import IphoneFlavor from './components/flavors/IphoneFlavor.vue'
import MarioFlavor from './components/flavors/MarioFlavor.vue'

const flavor = ref(null)
const booting = ref(true)

function onPick(id) {
  booting.value = true
  flavor.value = id
  // Push a history entry so the back button returns to the picker
  history.pushState({ flavor: id }, '')
}

function reset() {
  flavor.value = null
  booting.value = true
}

function onPopState() {
  // Back button pressed — go to picker without leaving the site
  reset()
}

onMounted(() => window.addEventListener('popstate', onPopState))
onUnmounted(() => window.removeEventListener('popstate', onPopState))
</script>
