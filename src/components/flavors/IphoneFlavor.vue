<template>
  <div class="w-screen h-screen overflow-hidden relative select-none"
    style="background: linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)">

    <!-- Wallpaper blobs -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute w-96 h-96 rounded-full opacity-20 blur-3xl" style="background:#5b6ef5;top:-60px;left:-60px" />
      <div class="absolute w-80 h-80 rounded-full opacity-15 blur-3xl" style="background:#e056a0;bottom:80px;right:-40px" />
    </div>

    <!-- Status bar -->
    <div class="relative z-10 flex items-center justify-between px-6 pt-3 pb-1 text-white text-[12px] font-semibold">
      <span>{{ time }}</span>
      <div class="flex items-center gap-1.5 text-[11px]">
        <span>●●●</span>
        <span>WiFi</span>
        <span>🔋</span>
      </div>
    </div>

    <!-- Date / greeting -->
    <div class="relative z-10 text-center mt-4 mb-6">
      <p class="text-white/60 text-sm">{{ dateStr }}</p>
      <p class="text-white text-4xl font-thin mt-1">{{ time }}</p>
    </div>

    <!-- App grid -->
    <div class="relative z-10 px-6">
      <div class="grid grid-cols-4 gap-y-5 gap-x-3">
        <AppIcon
          v-for="app in apps" :key="app.id"
          :app="app"
          @tap="openApp(app)"
        />
      </div>
    </div>

    <!-- Dock -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 px-5 py-3 rounded-3xl"
      style="background:rgba(255,255,255,0.12);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.2)">
      <AppIcon v-for="app in dock" :key="app.id" :app="app" dock @tap="openApp(app)" />
    </div>

    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="activeApp" class="absolute inset-0 z-50" style="background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)" @click="activeApp = null" />
    </Transition>

    <!-- Sheet panel -->
    <Transition name="sheet">
      <div v-if="activeApp" class="absolute bottom-0 left-0 right-0 z-[51] bg-white rounded-t-3xl flex flex-col" style="max-height:88vh">
        <!-- Handle -->
        <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div class="w-10 h-1 rounded-full bg-[#ddd]" />
        </div>
        <!-- Title bar -->
        <div class="flex items-center justify-between px-5 py-3 border-b border-[#f0f0f0] flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ activeApp.emoji }}</span>
            <span class="font-semibold text-[15px]">{{ activeApp.name }}</span>
          </div>
          <button class="text-[#007aff] text-sm font-medium" @click="activeApp = null">Done</button>
        </div>
        <!-- Scrollable content -->
        <div class="overflow-y-auto flex-1 min-h-0">
          <component :is="activeApp.component" v-if="activeApp.component" />
          <div v-else class="p-5 text-[#333] text-sm leading-relaxed" v-html="activeApp.content" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineComponent, h } from 'vue'
import { PROJECTS } from '../../data/projects.js'
import MyCV from '../windows/MyCV.vue'
import Bio from '../windows/Bio.vue'

const time = ref('')
const dateStr = ref('')
const activeApp = ref(null)

function tick() {
  const n = new Date()
  time.value = n.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  dateStr.value = n.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}
tick()
const interval = setInterval(tick, 10000)
onUnmounted(() => clearInterval(interval))

const ProjectsApp = defineComponent({
  setup() {
    return () => h('div', { class: 'p-4 grid grid-cols-2 gap-3' },
      PROJECTS.map(p => h('a', {
        href: p.url, target: '_blank', rel: 'noopener',
        class: 'flex items-center gap-3 p-3 rounded-2xl border border-[#eee] no-underline text-inherit',
      }, [
        h('img', { src: p.favicon, class: 'w-8 h-8 object-contain rounded-lg', onError: e => e.target.style.display = 'none' }),
        h('div', [
          h('div', { class: 'font-semibold text-[12px]' }, p.label),
          h('div', { class: 'text-[#888] text-[10px] mt-0.5 leading-snug line-clamp-2' }, p.description),
        ]),
      ]))
    )
  },
})

const apps = [
  { id: 'cv',       name: 'Resume',   emoji: '📄', bg: 'linear-gradient(135deg,#007aff,#0055d4)', component: MyCV },
  { id: 'bio',      name: 'About',    emoji: '👤', bg: 'linear-gradient(135deg,#34c759,#248a3d)', component: Bio },
  { id: 'projects', name: 'Projects', emoji: '🚀', bg: 'linear-gradient(135deg,#ff9500,#c93400)', component: ProjectsApp },
  { id: 'linkedin', name: 'LinkedIn', emoji: '💼', bg: 'linear-gradient(135deg,#0077b5,#004182)', href: 'https://linkedin.com/in/danjmccarthy' },
  { id: 'github',   name: 'GitHub',   emoji: '🐙', bg: 'linear-gradient(135deg,#333,#111)', href: 'https://github.com/HansDandle' },
  { id: 'email',    name: 'Mail',     emoji: '✉️', bg: 'linear-gradient(135deg,#5ac8fa,#007aff)', href: 'mailto:danshandle@gmail.com' },
  { id: 'resume',   name: 'PDF',      emoji: '⬇️', bg: 'linear-gradient(135deg,#ff2d55,#c0002f)', href: '/danmccarthyresume.pdf' },
  { id: 'trivia',   name: 'TriviATX', emoji: '🎤', bg: 'linear-gradient(135deg,#af52de,#7d29b0)', content: '<div class="p-5"><h2 class="font-bold text-lg mb-2">TriviATX</h2><p>Austin\'s weekly pub quiz - 100+ editions hosted by Dan. Every week, live, in person. Ask him about it.</p></div>' },
]

const dock = [
  { id: 'phone',  name: 'Contact', emoji: '📞', bg: 'linear-gradient(135deg,#34c759,#248a3d)', href: 'tel:5129214157' },
  { id: 'safari', name: 'Resume',  emoji: '📄', bg: 'linear-gradient(135deg,#007aff,#0055d4)', component: MyCV },
  { id: 'mail2',  name: 'Mail',    emoji: '✉️', bg: 'linear-gradient(135deg,#5ac8fa,#007aff)', href: 'mailto:danshandle@gmail.com' },
]

function openApp(app) {
  if (app.href) { window.open(app.href, '_blank', 'noopener'); return }
  activeApp.value = app
}

const AppIcon = defineComponent({
  props: ['app', 'dock'],
  emits: ['tap'],
  setup(props, { emit }) {
    return () => h('div', {
      class: 'flex flex-col items-center gap-1.5 cursor-pointer',
      onClick: () => emit('tap'),
    }, [
      h('div', {
        class: 'rounded-[22%] flex items-center justify-center text-2xl shadow-lg active:scale-90 transition-transform',
        style: {
          background: props.app.bg,
          width: props.dock ? '52px' : '60px',
          height: props.dock ? '52px' : '60px',
        },
      }, props.app.emoji),
      !props.dock && h('span', {
        class: 'text-white text-[10px] font-medium drop-shadow text-center leading-none',
        style: 'text-shadow:0 1px 3px rgba(0,0,0,0.5)'
      }, props.app.name),
    ])
  },
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.sheet-enter-active, .sheet-leave-active { transition: transform .3s cubic-bezier(.32,0,.67,0); }
.sheet-enter-from, .sheet-leave-to { transform: translateY(100%); }
</style>
