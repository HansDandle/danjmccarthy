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
