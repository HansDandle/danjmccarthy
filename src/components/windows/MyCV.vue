<template>
  <div class="p-4 overflow-auto text-[11px] bg-white h-full">

    <!-- Header -->
    <div class="flex items-center gap-4 border-b-2 border-[#0058e6] pb-3 mb-4">
      <img :src="photoSrc" alt="Dan McCarthy"
        class="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-[#0058e6]"
        @error="e => e.target.style.display='none'" />
      <div>
        <h1 class="text-xl font-bold text-[#003580]">Dan McCarthy</h1>
        <p class="text-[#555]">SaaS Implementation & Customer Success</p>
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
    <Section title="Professional Summary">
      <p class="text-[#333] leading-relaxed">
        Customer-facing SaaS implementation and customer success professional with 8+ years of experience helping enterprise and mid-market customers adopt new technology, optimize workflows, and navigate complex onboarding and rollout processes. Skilled at translating technical concepts for non-technical stakeholders, managing concurrent implementation pipelines, and partnering cross-functionally across Sales, Product, Operations, and Support. Hands-on builder of AI-enabled SaaS products and LLM-powered automations, with a practical, data-curious approach to process improvement and customer enablement.
      </p>
    </Section>

    <!-- Experience -->
    <Section title="Experience">
      <CVItem
        title="Partner Success Manager"
        org="Indeed Flex"
        period="Dec 2024 – Mar 2026 · Austin, TX"
        :bullets="[
          'Owned end-to-end onboarding for enterprise staffing partners on a national SaaS marketplace, serving as primary POC from contract signed through go-live and beyond',
          'Managed concurrent implementation pipelines, triaging integration issues, missing assets, operational blockers, and customer escalations',
          'Analyzed onboarding performance trends to improve SLA attainment from the low-80s to 95%+',
          'Delivered training and enablement sessions to partner teams with varying levels of technical comfort',
        ]"
      />
      <CVItem
        title="Director of Business Development"
        org="Crowdstake Global"
        period="May 2024 – Dec 2024 · Austin, TX"
        :bullets="[
          'Managed onboarding and activation for new accounts across a high-volume SaaS pipeline',
          'Built and maintained HubSpot workflows, lifecycle tracking, reporting cadences, and operational dashboards',
          'Worked directly with customers to troubleshoot onboarding friction and improve platform adoption',
        ]"
      />
      <CVItem
        title="Account Manager"
        org="RFD & Associates"
        period="Jul 2019 – Apr 2024 · Austin, TX"
        :bullets="[
          'Managed a portfolio of enterprise and public-sector SaaS accounts, owning onboarding, adoption, renewals, and expansion',
          'Maintained 93% retention through proactive account management and structured business reviews',
          'Coordinated across Product, Support, and Operations to resolve technical blockers and keep implementations on track',
        ]"
      />
      <CVItem
        title="Sales Manager"
        org="Hometown Hero"
        period="Jun 2017 – Jul 2019 · Austin, TX"
        :bullets="[
          'Built onboarding and activation workflows for new B2B accounts',
          'Coached reps on customer communication, operational consistency, and platform enablement',
        ]"
      />
      <CVItem
        title="Client Development Manager"
        org="Eva Street Advisors"
        period="Jan 2016 – May 2017 · Austin, TX"
        :bullets="[
          'Managed client onboarding and enablement for a professional services firm',
          'Used CRM and SQL-based data segmentation workflows to support outreach prioritization',
        ]"
      />
    </Section>

    <!-- Projects -->
    <Section title="Projects">
      <CVItem
        title="Founder"
        org="Scout Industries"
        period="2025 – Present"
        :bullets="[
          'Built and launched ScratchScout, PourScout, and PriorScout - AI-enabled SaaS platforms using Next.js, Firebase, Vercel, Stripe, and LLM integrations',
          'Designed onboarding flows, workflow automations, and user enablement systems from the ground up',
        ]"
      />
      <CVItem
        title="Host & Organizer"
        org="TriviATX"
        period="2019 – Present"
        :bullets="[
          'Produce and host a weekly trivia event series in Austin - 100+ editions - managing venue coordination, scheduling, and live event operations independently',
        ]"
      />
    </Section>

    <!-- Skills -->
    <Section title="Skills & Tools">
      <div class="flex flex-col gap-2">
        <SkillRow label="Implementation & CS" :items="['Enterprise onboarding','Implementation management','Go-live coordination','Customer enablement','Training delivery','Adoption tracking']" />
        <SkillRow label="Analytics & Ops" :items="['Process improvement','Workflow analysis','SLA management','Pipeline tracking','Operational reporting']" />
        <SkillRow label="Tools" :items="['Salesforce','HubSpot','Airtable','SQL','Google Workspace','Slack','Excel']" />
        <SkillRow label="Technical" :items="['SaaS configuration','Workflow automation','REST APIs','LLM integrations','Next.js','Firebase','AI-assisted tooling']" />
      </div>
    </Section>

    <!-- Download -->
    <div class="mt-4 pt-3 border-t border-[#ddd]">
      <a href="/danmccarthyresume.pdf" target="_blank"
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
