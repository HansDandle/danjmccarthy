<template>
  <div class="flex h-full text-[11px]">
    <!-- Left panel -->
    <div class="w-44 flex-shrink-0 bg-[#dce4f5] border-r border-[#b0b8d0] p-2 flex flex-col gap-2">
      <p class="font-bold text-[#003580] text-[10px] uppercase tracking-wide border-b border-[#b0b8d0] pb-1 mb-1">Projects</p>
      <button
        v-for="p in projects"
        :key="p.id"
        class="text-left px-2 py-1 rounded hover:bg-[#316ac5] hover:text-white w-full truncate"
        :class="selected?.id === p.id ? 'bg-[#316ac5] text-white' : ''"
        @click="selected = p"
      >{{ p.name }}</button>
    </div>

    <!-- Main panel -->
    <div class="flex-1 overflow-auto p-4 bg-white">
      <div v-if="selected" class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <span class="text-4xl">{{ selected.icon }}</span>
          <div>
            <h2 class="text-lg font-bold text-[#003580]">{{ selected.name }}</h2>
            <div class="flex gap-1 flex-wrap mt-1">
              <span v-for="t in selected.tags" :key="t"
                class="bg-[#dce4f5] text-[#003580] px-1.5 py-0.5 rounded text-[10px]">{{ t }}</span>
            </div>
          </div>
        </div>
        <p class="text-[#333] leading-relaxed">{{ selected.description }}</p>
        <div class="flex gap-2 mt-1">
          <a v-if="selected.url" :href="selected.url" target="_blank" rel="noopener"
            class="px-3 py-1 bg-[#316ac5] text-white rounded hover:bg-[#2255a0] text-[11px]">
            🔗 Visit Site
          </a>
          <a v-if="selected.github" :href="selected.github" target="_blank" rel="noopener"
            class="px-3 py-1 bg-[#333] text-white rounded hover:bg-[#555] text-[11px]">
            🐙 GitHub
          </a>
        </div>
      </div>
      <div v-else class="text-[#888] flex flex-col items-center justify-center h-full gap-2">
        <span class="text-5xl">📂</span>
        <p>Select a project from the left panel</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const projects = [
  {
    id: 'project1',
    name: 'Project One',
    icon: '📊',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    description: 'Add your project description here. Tell visitors what problem it solves, the tech stack you used, and any interesting challenges you overcame building it.',
    url: '#',
    github: '#',
  },
  {
    id: 'project2',
    name: 'Project Two',
    icon: '🌐',
    tags: ['Vue', 'Python', 'FastAPI'],
    description: 'Add your second project description here. Highlight what makes it unique and what you learned from building it.',
    url: '#',
    github: '#',
  },
  {
    id: 'project3',
    name: 'Project Three',
    icon: '📱',
    tags: ['React Native', 'Firebase'],
    description: 'Add your third project description here.',
    url: '#',
    github: '#',
  },
]

const selected = ref(projects[0])
</script>
