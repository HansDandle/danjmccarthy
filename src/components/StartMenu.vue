<template>
  <Transition name="start">
    <div v-if="open"
      class="fixed bottom-[30px] left-0 w-[370px] z-[9998] overflow-hidden"
      style="border:1px solid #0b3fa5; border-radius:6px 6px 0 0; box-shadow:3px -3px 12px rgba(0,0,0,.5)">

      <!-- Header -->
      <div class="flex items-center gap-3 p-2"
           style="background:linear-gradient(90deg,#1e50c8 0%,#3a8fe8 100%)">
        <div class="w-12 h-12 rounded flex items-center justify-center text-3xl bg-gradient-to-br from-yellow-300 to-orange-400 flex-shrink-0">🧑‍💻</div>
        <span class="text-white font-bold text-[14px]" style="text-shadow:1px 1px 2px rgba(0,0,0,.4)">Dan McCarthy</span>
      </div>

      <!-- Body -->
      <div class="flex" style="background:#fff; min-height:220px">
        <!-- Left -->
        <div class="flex-1 border-r border-[#d4d0c8] py-2">
          <p class="text-[10px] font-bold text-[#666] uppercase tracking-wide px-3 mb-1">Portfolio</p>
          <MenuItem icon="📝" label="bio.txt" sub="About Dan" @click="$emit('open', 'bio')" />
          <MenuItem icon="📄" label="My CV" sub="View resume" @click="$emit('open', 'cv')" />
          <MenuItem icon="💣" label="Minesweeper" sub="Take a break" @click="$emit('open', 'minesweeper')" />
          <MenuItem icon="🖥️" label="Terminal" sub="Run commands" @click="$emit('open', 'terminal')" />
          <div class="border-t border-[#d4d0c8] my-1" />
          <MenuItem icon="💼" label="LinkedIn" sub="linkedin.com/in/danjmccarthy" :href="'https://linkedin.com/in/danjmccarthy'" />
          <MenuItem icon="🐙" label="GitHub" sub="github.com/HansDandle" :href="'https://github.com/HansDandle'" />
        </div>
        <!-- Right: projects -->
        <div class="w-[148px] py-2 overflow-y-auto" style="background:#dce4f5; max-height:300px">
          <p class="text-[10px] font-bold text-[#666] uppercase tracking-wide px-3 mb-1">Projects</p>
          <ProjectItem v-for="p in PROJECTS" :key="p.id" :project="p" @click="$emit('close')" />
          <div class="border-t border-[#b0b8d0] my-1" />
          <MenuItem icon="✉️" label="Email Me" :href="'mailto:danshandle@gmail.com'" small />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-1.5 px-2 py-1 border-t border-[#9eb1d8]"
           style="background:linear-gradient(180deg,#d4ddf5 0%,#c0cce8 100%)">
        <FooterBtn @click="$emit('close')">🚪 Log Off</FooterBtn>
        <FooterBtn @click="$emit('close')">⏻ Shut Down</FooterBtn>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineComponent, h } from 'vue'
import { PROJECTS } from '../data/projects.js'

defineProps({ open: Boolean })
defineEmits(['open', 'close'])

const ProjectItem = defineComponent({
  props: ['project'],
  emits: ['click'],
  setup(props, { emit }) {
    return () => h('a', {
      href: props.project.url,
      target: '_blank',
      rel: 'noopener',
      class: 'flex items-center gap-1.5 px-2 py-1 cursor-default hover:bg-[#316ac5] hover:text-white no-underline text-black',
      onClick: () => emit('click'),
    }, [
      h('img', { src: props.project.favicon, alt: '', class: 'w-4 h-4 object-contain flex-shrink-0' }),
      h('span', { class: 'text-[11px] font-bold truncate' }, props.project.label),
    ])
  },
})

const MenuItem = defineComponent({
  props: ['icon', 'label', 'sub', 'href', 'small'],
  emits: ['click'],
  setup(props, { emit }) {
    return () => {
      const content = [
        h('span', { class: 'text-[20px] leading-none flex-shrink-0' }, props.icon),
        h('div', [
          h('div', { class: 'font-bold text-[11px]' }, props.label),
          props.sub ? h('div', { class: 'text-[10px] opacity-60 truncate max-w-[110px]' }, props.sub) : null,
        ]),
      ]
      const base = 'flex items-center gap-2 px-3 py-1 cursor-default hover:bg-[#316ac5] hover:text-white no-underline text-black'
      if (props.href) {
        return h('a', { href: props.href, target: '_blank', rel: 'noopener', class: base, onClick: () => emit('click') }, content)
      }
      return h('div', { class: base, onClick: () => emit('click') }, content)
    }
  },
})

const FooterBtn = defineComponent({
  emits: ['click'],
  setup(_, { slots, emit }) {
    return () => h('button',
      { class: 'flex items-center gap-1 px-2 py-0.5 text-[11px] rounded cursor-default border border-[#8a9dc9] hover:bg-[#b8c4e0]', style: 'background:linear-gradient(180deg,#eef2ff,#dce3f5)', onClick: () => emit('click') },
      slots.default?.()
    )
  },
})
</script>

<style scoped>
.start-enter-active, .start-leave-active { transition: opacity .15s, transform .15s; }
.start-enter-from, .start-leave-to { opacity: 0; transform: translateY(8px); }
</style>
