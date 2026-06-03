<template>
  <button
    class="w-5 h-5 text-[10px] flex items-center justify-center rounded-sm font-bold leading-none cursor-default"
    :class="red
      ? 'bg-gradient-to-b from-[#f08070] to-[#c84040] hover:from-[#ff9080] hover:to-[#e05050] border border-[#800000]'
      : 'bg-gradient-to-b from-[#e0e8ff] to-[#8aabdf] hover:from-[#eef2ff] hover:to-[#a0bde8] border border-[#00008b]'"
    :title="title"
    @mousedown.stop
  >{{ icon }}</button>
</template>

<script setup>
defineProps({ icon: String, title: String, red: Boolean })
</script>
