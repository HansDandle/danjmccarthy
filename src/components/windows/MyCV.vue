<template>
  <div class="p-4 overflow-auto text-[11px] sm:text-[13px] bg-white h-full">

    <!-- Header -->
    <div class="flex items-center gap-4 border-b-2 border-[#0058e6] pb-3 mb-4">
      <img :src="photoSrc" alt="Dan McCarthy"
        class="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-[#0058e6]"
        @error="e => e.target.style.display='none'" />
      <div>
        <h1 class="text-xl font-bold text-[#003580]">Dan McCarthy</h1>
        <p class="text-[#555]">B2B Sales & Account Management</p>
        <p class="text-[#777] text-[10px]">Austin, TX</p>
        <div class="flex flex-wrap gap-3 mt-1 text-[10px] text-[#316ac5]">
          <a href="tel:5129214157" class="hover:underline">📞 (512) 921-4157</a>
          <a href="mailto:danshandle@gmail.com" class="hover:underline">✉ danshandle@gmail.com</a>
          <a href="https://linkedin.com/in/danjmccarthy" target="_blank" class="hover:underline">💼 LinkedIn</a>
          <a href="https://github.com/HansDandle" target="_blank" class="hover:underline">🐙 GitHub</a>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <Section title="Summary">
      <p class="text-[#333] leading-relaxed">
        Austin sales professional selling advertising and underwriting across a four-station radio portfolio, closing municipal and public-agency accounts in the first quarter in seat, with eight years of enterprise and public-sector account management behind it. Owns the full cycle from self-sourced prospecting through contract and renewal, and builds his own sales tooling, including PourScout, a B2B sales CRM with a built-in lead sourcing and enrichment pipeline.
      </p>
    </Section>

    <!-- Experience -->
    <Section title="Experience">
      <CVItem
        title="Account Executive"
        org="Recharge Media PBC"
        period="Jun 2026 – Present · Austin, TX"
        :bullets="[
          'Sell advertising and underwriting across a four-station Central Texas portfolio (Sun Radio, Jack FM 96.3, Crush FM, KGID), owning the cycle from first contact through signed contract and renewal',
          'Manage a book spanning local independents to regional agencies, structuring multi-flight campaigns and revising inventory mid-flight to protect committed spend',
          'Closed Austin Watershed Protection, Austin Transportation and Public Works, and CARTS within the first quarter in seat, building a public-agency book from self-sourced outreach',
          'Sell event and broadcast sponsorships, including Austin City Limits Festival activations',
          'Build the materials sold against: industry-specific collateral, underwriting proposals, rate grids, and sponsorship one-sheets',
        ]"
      />
      <CVItem
        title="Partner Success Manager"
        org="Indeed Flex"
        period="Dec 2024 – Mar 2026 · Austin, TX"
        :bullets="[
          'Owned enterprise staffing partners on a national marketplace from contract signed through go-live and ongoing growth, serving as the single point of contact',
          'Ran concurrent implementations, clearing integration issues, operational blockers, and escalations across internal teams',
          'Lifted SLA attainment from the low 80s to 95%+ by tracking performance trends and attacking recurring bottlenecks',
        ]"
      />
      <CVItem
        title="Director of Business Development"
        org="Crowdstake Global"
        period="May 2024 – Dec 2024 · Austin, TX"
        :bullets="[
          'Owned new accounts from closed-won through first successful use across a high-volume pipeline',
          'Built HubSpot workflows, lifecycle tracking, and reporting dashboards to give leadership visibility into account movement',
        ]"
      />
      <CVItem
        title="Account Manager"
        org="RFD & Associates"
        period="Jul 2019 – Apr 2024 · Austin, TX"
        :bullets="[
          'Carried a portfolio of enterprise and public-sector accounts for five years, owning renewals and expansion',
          'Held 93% retention through proactive account management, executive communication, and structured business reviews',
        ]"
      />
      <CVItem
        title="Sales Manager"
        org="Hometown Hero"
        period="Jun 2017 – Jul 2019 · Austin, TX"
        :bullets="[
          'Opened and grew B2B accounts in a fast-moving consumer brand, building the training collateral and follow-up cadences behind them',
        ]"
      />
      <CVItem
        title="Client Development Manager"
        org="Eva Street Advisors"
        period="Jan 2016 – May 2017 · Austin, TX"
        :bullets="[
          'Managed client development for a professional services firm, using CRM and SQL segmentation to prioritize outreach',
        ]"
      />
    </Section>

    <!-- Ventures -->
    <Section title="Ventures">
      <CVItem
        title="Founder"
        org="PourScout"
        period="2025 – Present"
        :bullets="[
          'Built and launched pourscout.com, a B2B sales CRM that pairs pipeline, contact, and activity management with built-in lead sourcing and enrichment',
          'Shipped the product end to end on Next.js, Firebase, and Stripe, including integrations with existing CRMs, and ran positioning, pricing, and partner outreach solo',
        ]"
      />
      <CVItem
        title="Host & Organizer"
        org="TriviATX"
        period="2019 – Present"
        :bullets="[
          'Produce and host a weekly pub quiz series in Austin, sourcing and retaining hospitality venues as recurring accounts',
        ]"
      />
    </Section>

    <!-- Skills -->
    <Section title="Skills">
      <div class="flex flex-col gap-2">
        <SkillRow label="Sales" :items="['Full-cycle B2B','Self-sourced prospecting','Media & sponsorship sales','Proposals & rate cards','Negotiation','Renewals & expansion']" />
        <SkillRow label="Tools" :items="['Salesforce','HubSpot','Airtable','SQL','Google Workspace','Excel']" />
        <SkillRow label="Technical" :items="['Next.js','Firebase','Stripe','LLM integrations','Production SaaS']" />
      </div>
    </Section>

    <!-- Education -->
    <Section title="Education">
      <ul class="list-disc ml-4 text-[#444] space-y-0.5">
        <li>B.A., Texas State University</li>
        <li>Full-Stack Web Development Certificate, University of Texas at Austin</li>
      </ul>
    </Section>

    <!-- Download -->
    <div class="mt-4 pt-3 border-t border-[#ddd]">
      <a href="/Dan_McCarthy_Resume_Fall26.pdf" target="_blank"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#316ac5] text-white rounded hover:bg-[#2255a0] text-[11px]">
        ⬇ Download PDF Resume
      </a>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, h } from 'vue'

const photoSrc = '/danselfie.jpg'

const Section = defineComponent({
  props: ['title'],
  setup(props, { slots }) {
    return () => h('div', { class: 'mb-4' }, [
      h('h2', { class: 'font-bold text-[#003580] text-[12px] uppercase tracking-wide border-b border-[#b0c8e8] pb-0.5 mb-2' }, props.title),
      slots.default?.(),
    ])
  },
})

const CVItem = defineComponent({
  props: ['title', 'org', 'period', 'bullets'],
  setup(props) {
    return () => h('div', { class: 'mb-3' }, [
      h('div', { class: 'flex justify-between items-baseline gap-2 flex-wrap' }, [
        h('span', { class: 'font-bold text-[#111]' }, props.title),
        h('span', { class: 'text-[10px] text-[#666] whitespace-nowrap' }, props.period),
      ]),
      h('div', { class: 'text-[#316ac5] font-semibold mb-1' }, props.org),
      h('ul', { class: 'list-disc ml-4 text-[#444] space-y-0.5' },
        props.bullets.map(b => h('li', { class: 'leading-relaxed' }, b))
      ),
    ])
  },
})

const SkillRow = defineComponent({
  props: ['label', 'items'],
  setup(props) {
    return () => h('div', { class: 'flex items-start gap-2' }, [
      h('span', { class: 'text-[#003580] font-bold w-28 flex-shrink-0' }, props.label + ':'),
      h('div', { class: 'flex flex-wrap gap-1' },
        props.items.map(s => h('span', {
          class: 'bg-[#dce4f5] text-[#003580] px-1.5 py-0.5 rounded text-[10px]'
        }, s))
      ),
    ])
  },
})
</script>
