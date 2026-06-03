<template>
  <div class="w-screen h-screen overflow-hidden">
    <BootSequence v-if="booting" @done="booting = false" />
    <Desktop v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BootSequence from './components/BootSequence.vue'
import Desktop from './components/Desktop.vue'

const booting = ref(true)
</script>
