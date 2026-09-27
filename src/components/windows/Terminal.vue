<template>
  <div
    class="bg-black text-[#00ff00] font-mono text-[11px] p-2 overflow-auto h-full flex flex-col overflow-x-hidden"
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
    '  <span style="color:#ffff00">about</span>      - About Dan McCarthy',
    '  <span style="color:#ffff00">skills</span>     - Technical skills',
    '  <span style="color:#ffff00">contact</span>    - Contact information',
    '  <span style="color:#ffff00">projects</span>   - List of projects',
    '  <span style="color:#ffff00">cls</span>        - Clear screen',
    '  <span style="color:#ffff00">exit</span>       - Close terminal',
    '',
  ],
  about: () => [
    'Dan McCarthy - Austin, TX',
    '─────────────────────────────────────────────────',
    'Account Executive at Recharge Media: advertising,',
    'underwriting and sponsorships across four Central',
    'Texas radio stations. 8 years of enterprise and',
    'public-sector account management before that.',
    '',
    'Also a code coxswain: founder of Scout Industries,',
    'builder of PourScout (the CRM I sell from daily),',
    'and host of TriviATX (100+ editions).',
    '',
  ],
  skills: () => [
    'Skills & Tools:',
    '  Sales       : Full-cycle B2B, self-sourced prospecting,',
    '                media & sponsorship sales, proposals and',
    '                rate cards, negotiation, renewals & expansion',
    '  Tools       : Salesforce, HubSpot, Airtable, SQL, Excel',
    '  Technical   : Next.js, Firebase, Stripe, LLM integrations,',
    '                ships production SaaS',
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
    'Lead Gen:',
    '  PourScout     - B2B sales CRM with built-in lead sourcing',
    '  PlumbersATX, CritterGitter, CentEx Realty, GLP Screen',
    'Marketplaces:',
    '  Task Coop     - Worker-owned local services marketplace',
    '  Austin Talent Exchange - Booking platform for Austin bands + venues',
    'Utilities:',
    '  ScratchScout  - Scratch-off lottery EV tracker',
    '  PriorScout    - Patent prior art search & ranking',
    '  LineDrive     - Self-hosted HDHomeRun DVR',
    '  PDFacil       - Edit Canva PDFs locally',
    '  Jesus Take The Wheel, No Cap Calculator',
    'Community & Content:',
    '  BTC FAQ, Pound Town, Ted Brown TX',
    'Private:',
    '  StratScout    - Walk-forward quant trading system (live)',
    '',
    'Open the project folders on the desktop to visit.',
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
