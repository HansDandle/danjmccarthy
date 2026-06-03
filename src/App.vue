<template>
  <div class="w-screen h-screen overflow-hidden">
    <!-- Flavor picker -->
    <FlavorPicker v-if="!flavor" @pick="onPick" />

    <!-- XP flavor -->
    <template v-else-if="flavor === 'xp'">
      <BootSequence v-if="booting" @done="booting = false" />
      <Desktop v-else />
    </template>

    <!-- Other flavors -->
    <NormalFlavor v-else-if="flavor === 'normal'" />
    <IphoneFlavor v-else-if="flavor === 'iphone'" />
    <MarioFlavor v-else-if="flavor === 'mario'" />

    <!-- Reset button (always visible, top-right) -->
    <button
      v-if="flavor"
      class="fixed top-2 right-2 z-[99999] text-[10px] px-2 py-1 rounded opacity-30 hover:opacity-80 transition-opacity"
      style="background:rgba(0,0,0,0.5);color:#fff"
      @click="reset"
      title="Change experience"
    >⊞ switch</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FlavorPicker from './components/FlavorPicker.vue'
import BootSequence from './components/BootSequence.vue'
import Desktop from './components/Desktop.vue'
import NormalFlavor from './components/flavors/NormalFlavor.vue'
import IphoneFlavor from './components/flavors/IphoneFlavor.vue'
import MarioFlavor from './components/flavors/MarioFlavor.vue'

const saved = localStorage.getItem('portfolio-flavor')
const flavor = ref(saved || null)
const booting = ref(true)

function onPick(id) {
  booting.value = true
  flavor.value = id
}

function reset() {
  localStorage.removeItem('portfolio-flavor')
  flavor.value = null
  booting.value = true
}
</script>
