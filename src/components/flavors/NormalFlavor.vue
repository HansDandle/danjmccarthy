<template>
  <div class="w-screen h-screen overflow-y-auto bg-[#f8f8f8] text-[#111]" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">

    <!-- Nav -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#e5e5e5] px-6 py-3 flex items-center justify-between">
      <span class="font-bold text-[15px]">Dan McCarthy</span>
      <div class="flex gap-6 text-sm text-[#555]">
        <a href="#about" class="hover:text-black transition-colors">About</a>
        <a href="#experience" class="hover:text-black transition-colors">Experience</a>
        <a href="#projects" class="hover:text-black transition-colors">Projects</a>
        <a href="#contact" class="hover:text-black transition-colors">Contact</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="max-w-3xl mx-auto px-6 pt-20 pb-16">
      <div class="flex items-center gap-6 mb-8">
        <img src="/danselfie.jpg" alt="Dan McCarthy" class="w-20 h-20 rounded-full object-cover border border-[#ddd]" @error="e => e.target.style.display='none'" />
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Dan McCarthy</h1>
          <p class="text-[#666] mt-1">SaaS Implementation & Customer Success · Austin, TX</p>
        </div>
      </div>
      <p class="text-[17px] leading-relaxed text-[#333] max-w-2xl">
        Customer-facing SaaS professional with 8+ years helping enterprise customers adopt technology and get value fast. Also an indie builder: I've shipped AI-enabled SaaS products, a worker-owned marketplace, a live trading system, and more - mostly with Claude doing the heavy lifting.
      </p>
      <div class="flex flex-wrap gap-3 mt-8">
        <a href="/danmccarthyresume.pdf" target="_blank" class="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-[#222] transition-colors">Download Resume</a>
        <a href="https://linkedin.com/in/danjmccarthy" target="_blank" class="px-4 py-2 border border-[#ddd] rounded-lg text-sm font-medium hover:border-[#999] transition-colors">LinkedIn</a>
        <a href="https://github.com/HansDandle" target="_blank" class="px-4 py-2 border border-[#ddd] rounded-lg text-sm font-medium hover:border-[#999] transition-colors">GitHub</a>
        <a href="mailto:danshandle@gmail.com" class="px-4 py-2 border border-[#ddd] rounded-lg text-sm font-medium hover:border-[#999] transition-colors">Email</a>
      </div>
    </section>

    <div class="max-w-3xl mx-auto px-6 border-t border-[#e5e5e5]" />

    <!-- Experience -->
    <section id="experience" class="max-w-3xl mx-auto px-6 py-14">
      <h2 class="text-xl font-bold mb-8">Experience</h2>
      <div class="space-y-10">
        <ExpItem v-for="j in jobs" :key="j.title + j.org" v-bind="j" />
      </div>
    </section>

    <div class="max-w-3xl mx-auto px-6 border-t border-[#e5e5e5]" />

    <!-- Projects -->
    <section id="projects" class="max-w-3xl mx-auto px-6 py-14">
      <h2 class="text-xl font-bold mb-8">Projects</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <component
          v-for="p in projects" :key="p.id"
          :is="p.url ? 'a' : 'div'"
          v-bind="p.url ? { href: p.url, target: '_blank', rel: 'noopener' } : {}"
          class="flex items-start gap-3 p-4 rounded-xl border border-[#e5e5e5] hover:border-[#ccc] hover:shadow-sm transition-all no-underline text-inherit"
          :class="!p.url ? 'opacity-60 cursor-default' : ''"
        >
          <img :src="p.favicon" :alt="p.label" class="w-8 h-8 object-contain rounded flex-shrink-0 mt-0.5" @error="e => e.target.style.display='none'" />
          <div>
            <div class="font-semibold text-sm">{{ p.label }}</div>
            <div class="text-[#666] text-[12px] mt-0.5 leading-snug">{{ p.description }}</div>
          </div>
        </a>
      </div>
    </section>

    <div class="max-w-3xl mx-auto px-6 border-t border-[#e5e5e5]" />

    <!-- Skills -->
    <section id="about" class="max-w-3xl mx-auto px-6 py-14">
      <h2 class="text-xl font-bold mb-6">Skills</h2>
      <div class="space-y-3">
        <SkillRow v-for="s in skills" :key="s.label" v-bind="s" />
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="max-w-3xl mx-auto px-6 py-14 border-t border-[#e5e5e5]">
      <h2 class="text-xl font-bold mb-4">Get in touch</h2>
      <p class="text-[#555] mb-4">Open to new opportunities in SaaS implementation, customer success, and solutions engineering.</p>
      <a href="mailto:danshandle@gmail.com" class="text-black font-medium underline underline-offset-2">danshandle@gmail.com</a>
    </section>

    <footer class="text-center text-[#aaa] text-xs py-8">© 2025 Dan McCarthy</footer>
  </div>
</template>

<script setup>
import { defineComponent, h } from 'vue'
import { PROJECTS } from '../../data/projects.js'

const projects = PROJECTS

const jobs = [
  { title: 'Partner Success Manager', org: 'Indeed Flex', period: 'Dec 2024 - Mar 2026', bullets: ['Owned end-to-end onboarding for enterprise staffing partners on a national SaaS marketplace', 'Analyzed onboarding trends to improve SLA attainment from low-80s to 95%+', 'Delivered training and enablement sessions to partner teams with varying technical comfort'] },
  { title: 'Director of Business Development', org: 'Crowdstake Global', period: 'May 2024 - Dec 2024', bullets: ['Managed onboarding and activation for new accounts across a high-volume SaaS pipeline', 'Built and maintained HubSpot workflows, lifecycle tracking, and operational dashboards'] },
  { title: 'Account Manager', org: 'RFD & Associates', period: 'Jul 2019 - Apr 2024', bullets: ['Managed enterprise and public-sector SaaS accounts through onboarding, adoption, renewals, and expansion', 'Maintained 93% retention through proactive account management and structured business reviews'] },
  { title: 'Sales Manager', org: 'Hometown Hero', period: 'Jun 2017 - Jul 2019', bullets: ['Built onboarding and activation workflows for new B2B accounts'] },
]

const skills = [
  { label: 'Implementation & CS', items: ['Enterprise onboarding', 'Implementation management', 'Customer enablement', 'SLA management', 'Adoption tracking'] },
  { label: 'Tools', items: ['Salesforce', 'HubSpot', 'Airtable', 'SQL', 'Google Workspace', 'Excel'] },
  { label: 'Technical', items: ['SaaS configuration', 'Workflow automation', 'REST APIs', 'LLM integrations', 'Next.js', 'Firebase'] },
]

const ExpItem = defineComponent({
  props: ['title', 'org', 'period', 'bullets'],
  setup(props) {
    return () => h('div', [
      h('div', { class: 'flex items-baseline justify-between gap-4 flex-wrap mb-1' }, [
        h('div', [
          h('span', { class: 'font-semibold' }, props.title),
          h('span', { class: 'text-[#666] ml-2 text-sm' }, '· ' + props.org),
        ]),
        h('span', { class: 'text-[#999] text-xs whitespace-nowrap' }, props.period),
      ]),
      h('ul', { class: 'mt-1 space-y-1' },
        props.bullets.map(b => h('li', { class: 'text-[#555] text-sm leading-relaxed flex gap-2' }, [
          h('span', { class: 'text-[#ccc] flex-shrink-0 mt-0.5' }, '—'),
          h('span', b),
        ]))
      ),
    ])
  },
})

const SkillRow = defineComponent({
  props: ['label', 'items'],
  setup(props) {
    return () => h('div', { class: 'flex items-start gap-4' }, [
      h('span', { class: 'text-[#999] text-sm w-36 flex-shrink-0 pt-0.5' }, props.label),
      h('div', { class: 'flex flex-wrap gap-2' },
        props.items.map(s => h('span', { class: 'text-sm bg-[#f0f0f0] text-[#333] px-2.5 py-0.5 rounded-full' }, s))
      ),
    ])
  },
})
</script>
