<template>
  <div
    class="bg-black text-[#00ff00] font-mono text-[12px] p-2 overflow-auto h-full flex flex-col"
    @click="focusInput"
    ref="container"
  >
    <div v-for="(line, i) in lines" :key="i" class="whitespace-pre-wrap leading-5" v-html="line" />
    <div class="flex items-center mt-0.5">
      <span class="text-[#00ff00]">C:\Portfolio&gt;&nbsp;</span>
      <input
        ref="inputEl"
        v-model="current"
        class="bg-transparent text-[#00ff00] outline-none border-none flex-1 font-mono text-[12px]"
        @keydown.enter="submit"
        @keydown.up="historyUp"
        @keydown.down="historyDown"
        spellcheck="false"
        autocomplete="off"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const lines = ref([
  'Microsoft Windows XP [Version 5.1.2600]',
  '(C) Copyright 1985-2001 Microsoft Corp.',
  '',
  'Type <span style="color:#ffff00">help</span> for a list of commands.',
  '',
])
const current = ref('')
const history = ref([])
const histIdx = ref(-1)
const inputEl = ref(null)
const container = ref(null)

function focusInput() { inputEl.value?.focus() }

const commands = {
  help: () => [
    'Available commands:',
    '  <span style="color:#ffff00">about</span>      — About Dan McCarthy',
    '  <span style="color:#ffff00">skills</span>     — Technical skills',
    '  <span style="color:#ffff00">contact</span>    — Contact information',
    '  <span style="color:#ffff00">projects</span>   — List of projects',
    '  <span style="color:#ffff00">cls</span>        — Clear screen',
    '  <span style="color:#ffff00">exit</span>       — Close terminal',
    '',
  ],
  about: () => [
    'Dan McCarthy — Software Developer',
    '─────────────────────────────────',
    'I build things for the web. Passionate about clean code,',
    'great UX, and making complex problems look simple.',
    '',
    'Based in [Your City]. Open to new opportunities.',
    '',
  ],
  skills: () => [
    'Technical Skills:',
    '  Languages   : JavaScript, TypeScript, Python',
    '  Frontend    : Vue, React, HTML, CSS, Tailwind',
    '  Backend     : Node.js, FastAPI, PostgreSQL',
    '  Tools       : Git, Docker, AWS, Vite',
    '',
  ],
  contact: () => [
    'Contact:',
    '  Email    : danshandle@gmail.com',
    '  LinkedIn : linkedin.com/in/danjmccarthy',
    '  GitHub   : github.com/HansDandle',
    '',
  ],
  projects: () => [
    'Projects:',
    '  1. Project One    — React + Node.js + PostgreSQL',
    '  2. Project Two    — Vue + Python + FastAPI',
    '  3. Project Three  — React Native + Firebase',
    '',
    'Open the "My Projects" window for more details.',
    '',
  ],
  cls: () => { lines.value = []; return [] },
}

function submit() {
  const cmd = current.value.trim().toLowerCase()
  lines.value.push(`C:\\Portfolio&gt; ${current.value}`)
  history.value.unshift(current.value)
  histIdx.value = -1
  current.value = ''

  if (!cmd) { lines.value.push(''); return scroll() }

  if (cmd === 'exit') {
    lines.value.push('Goodbye!', '')
    return scroll()
  }

  const handler = commands[cmd]
  if (handler) {
    const out = handler()
    if (out) lines.value.push(...out)
  } else {
    lines.value.push(
      `'${cmd}' is not recognized as an internal command.`,
      'Type <span style="color:#ffff00">help</span> for available commands.',
      ''
    )
  }

  scroll()
}

function historyUp() {
  if (history.value.length === 0) return
  histIdx.value = Math.min(histIdx.value + 1, history.value.length - 1)
  current.value = history.value[histIdx.value]
}
function historyDown() {
  histIdx.value = Math.max(histIdx.value - 1, -1)
  current.value = histIdx.value >= 0 ? history.value[histIdx.value] : ''
}

function scroll() {
  nextTick(() => {
    if (container.value) container.value.scrollTop = container.value.scrollHeight
  })
}
</script>
