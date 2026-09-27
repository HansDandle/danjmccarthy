<template>
  <div class="flex h-full text-[11px]">
    <!-- Left task pane -->
    <div class="w-44 flex-shrink-0 p-2.5 flex flex-col gap-3 overflow-y-auto max-sm:hidden"
      style="background:linear-gradient(180deg,#7ba2e7 0%,#6375d6 100%)">
      <div class="rounded overflow-hidden">
        <p class="font-bold text-[#215dc6] px-2.5 py-1.5" style="background:linear-gradient(90deg,#fff 0%,#c6d3f7 100%)">Other Places</p>
        <div class="bg-[#d6dff7] px-2.5 py-2 flex flex-col gap-1.5">
          <button
            v-for="c in otherFolders" :key="c.id"
            class="flex items-center gap-1.5 text-left text-[#215dc6] hover:underline"
            @click="winStore.openWindow(`folder-${c.id}`)"
          >
            <span>📁</span><span>{{ c.label }}</span>
          </button>
        </div>
      </div>
      <div class="rounded overflow-hidden">
        <p class="font-bold text-[#215dc6] px-2.5 py-1.5" style="background:linear-gradient(90deg,#fff 0%,#c6d3f7 100%)">Details</p>
        <div class="bg-[#d6dff7] px-2.5 py-2 text-[#333] leading-snug">
          <p class="font-bold">{{ group.label }}</p>
          <p class="mt-1">{{ group.projects.length }} {{ group.projects.length === 1 ? 'project' : 'projects' }}</p>
          <p class="mt-1 text-[#555]">{{ group.blurb }}</p>
        </div>
      </div>
    </div>

    <!-- Tiles -->
    <div class="flex-1 overflow-auto bg-white p-3">
      <div class="grid gap-2" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">
        <component
          v-for="p in group.projects" :key="p.id"
          :is="p.url ? 'a' : 'div'"
          v-bind="p.url ? { href: p.url, target: '_blank', rel: 'noopener' } : {}"
          class="flex items-start gap-2.5 p-2 rounded border border-transparent no-underline text-black cursor-default"
          :class="[
            p.url ? 'hover:bg-[#e8eefa] hover:border-[#b0c4ec]' : 'opacity-60',
            p.featured ? 'col-span-full bg-[#fdf8e4] border-[#e8d98c]' : '',
          ]"
          :title="p.url || 'Coming soon'"
        >
          <img :src="p.favicon" :alt="p.label" class="w-8 h-8 object-contain flex-shrink-0 mt-0.5"
            @error="e => e.target.style.visibility = 'hidden'" />
          <div class="min-w-0">
            <div class="font-bold text-[12px] flex items-center gap-1.5">
              {{ p.label }}
              <span v-if="p.featured" class="text-[9px] font-bold uppercase tracking-wide bg-[#316ac5] text-white px-1.5 py-px rounded">Daily driver</span>
            </div>
            <div class="text-[#555] leading-snug mt-0.5">{{ p.description }}</div>
          </div>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PROJECT_GROUPS } from '../../data/projects.js'
import { useWindowsStore } from '../../stores/windowsStore.js'

const props = defineProps({ category: { type: String, required: true } })
const winStore = useWindowsStore()

const group = computed(() => PROJECT_GROUPS.find(g => g.id === props.category))
const otherFolders = computed(() => PROJECT_GROUPS.filter(g => g.id !== props.category))
</script>
