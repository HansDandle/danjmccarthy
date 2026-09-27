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
          <p class="text-[#666] mt-1">B2B Sales & Account Management · Austin, TX</p>
        </div>
      </div>
      <p class="text-[17px] leading-relaxed text-[#333] max-w-2xl">
        Account Executive at Recharge Media, selling advertising, underwriting and sponsorships across four Central Texas radio stations, with eight years of enterprise and public-sector account management behind it. I also build my own sales tooling: PourScout, the CRM I prospect and sell from every day, plus a worker-owned marketplace, lead-gen sites and more - mostly with Claude doing the heavy lifting.
      </p>
      <div class="flex flex-wrap gap-3 mt-8">
        <a href="/DanMcCarthyResume.pdf" target="_blank" class="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-[#222] transition-colors">Download Resume</a>
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
      <div class="space-y-10">
        <div v-for="g in groups" :key="g.id">
          <h3 class="text-[13px] font-semibold uppercase tracking-wide text-[#999] mb-3">{{ g.label }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <component
              v-for="p in g.projects" :key="p.id"
              :is="p.url ? 'a' : 'div'"
              v-bind="p.url ? { href: p.url, target: '_blank', rel: 'noopener' } : {}"
              class="flex items-start gap-3 p-4 rounded-xl border border-[#e5e5e5] hover:border-[#ccc] hover:shadow-sm transition-all no-underline text-inherit"
              :class="[!p.url ? 'opacity-60 cursor-default' : '', p.featured ? 'sm:col-span-2 border-[#ccc]' : '']"
            >
              <img :src="p.favicon" :alt="p.label" class="w-8 h-8 object-contain rounded flex-shrink-0 mt-0.5" @error="e => e.target.style.display='none'" />
              <div>
                <div class="font-semibold text-sm">
                  {{ p.label }}
                  <span v-if="p.featured" class="ml-1.5 text-[10px] font-medium bg-black text-white px-1.5 py-0.5 rounded">Daily driver</span>
                </div>
                <div class="text-[#666] text-[12px] mt-0.5 leading-snug">{{ p.description }}</div>
              </div>
            </component>
          </div>
        </div>
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
      <p class="text-[#555] mb-4">Advertising and sponsorships on Central Texas radio, a sales role, or something I've built - happy to talk.</p>
      <a href="mailto:danshandle@gmail.com" class="text-black font-medium underline underline-offset-2">danshandle@gmail.com</a>
    </section>

    <footer class="text-center text-[#aaa] text-xs py-8">© 2026 Dan McCarthy</footer>
  </div>
</template>

<script setup>
import { defineComponent, h } from 'vue'
import { PROJECT_GROUPS } from '../../data/projects.js'

const groups = PROJECT_GROUPS

const jobs = [
  { title: 'Account Executive', org: 'Recharge Media PBC', period: 'Jun 2026 - Present', bullets: ['Sell advertising and underwriting across Sun Radio, Jack FM 96.3, Crush FM and KGID, from first contact through signed contract and renewal', 'Closed Austin Watershed Protection, Austin Transportation and Public Works, and CARTS within the first quarter in seat, all self-sourced', 'Sell event and broadcast sponsorships, including Austin City Limits Festival activations'] },
  { title: 'Partner Success Manager', org: 'Indeed Flex', period: 'Dec 2024 - Mar 2026', bullets: ['Owned enterprise staffing partners on a national marketplace from contract signed through go-live and ongoing growth', 'Lifted SLA attainment from the low 80s to 95%+ by tracking performance trends and attacking recurring bottlenecks'] },
  { title: 'Director of Business Development', org: 'Crowdstake Global', period: 'May 2024 - Dec 2024', bullets: ['Owned new accounts from closed-won through first successful use across a high-volume pipeline', 'Built HubSpot workflows, lifecycle tracking, and reporting dashboards for leadership'] },
  { title: 'Account Manager', org: 'RFD & Associates', period: 'Jul 2019 - Apr 2024', bullets: ['Carried a portfolio of enterprise and public-sector accounts for five years, owning renewals and expansion', 'Held 93% retention through proactive account management and structured business reviews'] },
  { title: 'Sales Manager', org: 'Hometown Hero', period: 'Jun 2017 - Jul 2019', bullets: ['Opened and grew B2B accounts in a fast-moving consumer brand'] },
]

const skills = [
  { label: 'Sales', items: ['Full-cycle B2B', 'Self-sourced prospecting', 'Media & sponsorship sales', 'Proposals & rate cards', 'Negotiation', 'Renewals & expansion'] },
  { label: 'Tools', items: ['Salesforce', 'HubSpot', 'Airtable', 'SQL', 'Google Workspace', 'Excel'] },
  { label: 'Technical', items: ['Next.js', 'Firebase', 'Stripe', 'LLM integrations', 'Production SaaS'] },
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
