<template>
  <component
    :is="href ? 'a' : 'div'"
    v-bind="href ? { href, target: '_blank', rel: 'noopener' } : {}"
    class="flex flex-col items-center w-[76px] cursor-default p-1 rounded select-none group no-underline"
    :class="selected ? 'bg-[rgba(49,106,197,0.5)] border border-[rgba(49,106,197,0.8)]' : 'border border-transparent hover:bg-[rgba(49,106,197,0.3)] hover:border-[rgba(49,106,197,0.6)]'"
    @click="href ? null : (selected = !selected)"
    @dblclick="$emit('dblclick')"
  >
    <span class="text-[40px] leading-none">{{ icon }}</span>
    <span class="mt-1 text-white text-[11px] text-center leading-snug max-w-[72px] break-words"
          style="text-shadow: 1px 1px 2px #000, 0 0 4px #000">{{ label }}</span>
  </component>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ icon: String, label: String, href: String })
defineEmits(['dblclick'])
const selected = ref(false)
</script>
