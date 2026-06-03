<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center bg-[#0a0a0f] overflow-hidden relative">

    <!-- Scanline overlay -->
    <div class="absolute inset-0 pointer-events-none" style="background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px); z-index:10" />

    <div class="relative z-20 flex flex-col items-center gap-10 px-4 w-full max-w-5xl">

      <div class="text-center">
        <p class="text-[#aaa] text-sm tracking-[0.3em] uppercase mb-2">Dan McCarthy · Portfolio</p>
        <h1 class="text-white text-3xl sm:text-4xl font-bold tracking-tight">Choose your experience</h1>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
        <FlavorCard
          v-for="f in flavors" :key="f.id"
          :flavor="f"
          :hovered="hovered === f.id"
          @mouseenter="hovered = f.id"
          @mouseleave="hovered = null"
          @click="pick(f.id)"
        />
      </div>

      <p class="text-[#555] text-xs">Your choice will be remembered</p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'

const emit = defineEmits(['pick'])
const hovered = ref(null)

const flavors = [
  {
    id: 'xp',
    name: 'Windows XP',
    desc: 'Classic desktop experience',
    emoji: '🖥️',
    bg: 'linear-gradient(135deg,#1e50c8 0%,#3a8fe8 100%)',
    border: '#316ac5',
    tag: 'Nostalgic',
  },
  {
    id: 'normal',
    name: 'Normal',
    desc: 'Clean modern portfolio',
    emoji: '📄',
    bg: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',
    border: '#444',
    tag: 'Professional',
  },
  {
    id: 'iphone',
    name: 'iPhone',
    desc: 'iOS home screen style',
    emoji: '📱',
    bg: 'linear-gradient(135deg,#1c1c1e 0%,#2c2c2e 100%)',
    border: '#3a3a3c',
    tag: 'Sleek',
  },
  {
    id: 'mario',
    name: 'Mario World',
    desc: 'Auto-playing adventure',
    emoji: '🍄',
    bg: 'linear-gradient(135deg,#5c94fc 0%,#3a6fd8 100%)',
    border: '#e52521',
    tag: '🔥 New',
  },
]

function pick(id) {
  localStorage.setItem('portfolio-flavor', id)
  emit('pick', id)
}

const FlavorCard = defineComponent({
  props: ['flavor', 'hovered'],
  emits: ['mouseenter', 'mouseleave', 'click'],
  setup(props, { emit }) {
    return () => h('button', {
      class: 'relative flex flex-col items-center gap-3 p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 text-left w-full',
      style: {
        background: props.flavor.bg,
        borderColor: props.hovered ? '#fff' : props.flavor.border,
        transform: props.hovered ? 'translateY(-4px) scale(1.02)' : 'none',
        boxShadow: props.hovered ? '0 12px 32px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
      },
      onMouseenter: () => emit('mouseenter'),
      onMouseleave: () => emit('mouseleave'),
      onClick: () => emit('click'),
    }, [
      h('div', { class: 'absolute top-2 right-2' },
        h('span', {
          class: 'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
          style: { background: 'rgba(255,255,255,0.15)', color: '#fff' }
        }, props.flavor.tag)
      ),
      h('span', { style: { fontSize: '2.5rem', lineHeight: 1 } }, props.flavor.emoji),
      h('div', [
        h('div', { class: 'text-white font-bold text-sm' }, props.flavor.name),
        h('div', { class: 'text-[rgba(255,255,255,0.6)] text-[11px] mt-0.5' }, props.flavor.desc),
      ]),
    ])
  },
})
</script>
