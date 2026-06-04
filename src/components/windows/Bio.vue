<template>
  <div class="bg-white overflow-auto">

    <!-- Hero banner with avatar anchored to bottom -->
    <div class="relative h-20 flex-shrink-0"
      style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)">
      <div class="absolute inset-0 opacity-20"
        style="background:radial-gradient(circle at 70% 50%,#5b6ef5 0%,transparent 60%)" />
      <img src="/danselfie.jpg" alt="Dan McCarthy"
        class="absolute bottom-0 left-5 translate-y-1/2 w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
        @error="e => e.target.style.display='none'" />
    </div>

    <!-- Content — top padding makes room for the overlapping avatar -->
    <div class="px-5 pb-5 pt-14">
      <div class="mb-4">
        <h1 class="text-lg sm:text-xl font-bold text-[#111] leading-tight">Dan McCarthy</h1>
        <p class="text-[#666] text-[12px] sm:text-[13px]">Austin, TX</p>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 mb-5">
        <Chip v-for="t in tags" :key="t" :label="t" />
      </div>

      <!-- Bio sections -->
      <Section title="Who I am">
        I'm a B2B sales and account management veteran turned indie software builder.
        8+ years of customer-facing SaaS work - enterprise onboarding, customer success,
        and getting people to actually get value from software.
      </Section>

      <Section title="What I build">
        I run <strong>Scout Industries</strong> - a portfolio of indie SaaS products I've built
        and shipped alongside a full-time career. I think of myself as a code coxswain:
        I don't row, I steer. AI agents handle the oars. Knowing where the boat is supposed
        to go - and why - that's the job.
      </Section>

      <Section title="Outside the keyboard">
        I live in South Austin with my wife, our one-year-old son, and our old dog Willie.
        I also host <strong>TriviATX</strong> - a weekly pub quiz now past 100 editions.
        I run the whole thing solo: writing, hosting, venue coordination, and keeping the
        crowd honest.
      </Section>

      <!-- Links -->
      <div class="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#f0f0f0]">
        <a href="mailto:danshandle@gmail.com"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-full text-[11px] font-medium no-underline">
          ✉ Email
        </a>
        <a href="https://linkedin.com/in/danjmccarthy" target="_blank" rel="noopener"
          class="flex items-center gap-1.5 px-3 py-1.5 border border-[#ddd] rounded-full text-[11px] font-medium no-underline text-[#333]">
          💼 LinkedIn
        </a>
        <a href="https://github.com/HansDandle" target="_blank" rel="noopener"
          class="flex items-center gap-1.5 px-3 py-1.5 border border-[#ddd] rounded-full text-[11px] font-medium no-underline text-[#333]">
          🐙 GitHub
        </a>
        <a href="/danmccarthyresume.pdf" target="_blank"
          class="flex items-center gap-1.5 px-3 py-1.5 border border-[#ddd] rounded-full text-[11px] font-medium no-underline text-[#333]">
          ⬇ Resume
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, h } from 'vue'

const tags = ['SaaS', 'Customer Success', 'Implementation', 'Indie Builder', 'Austin TX', 'TriviATX']

const Chip = defineComponent({
  props: ['label'],
  setup(props) {
    return () => h('span', {
      class: 'px-2.5 py-0.5 rounded-full text-[11px] font-medium',
      style: 'background:#f0f4ff;color:#3050b0'
    }, props.label)
  }
})

const Section = defineComponent({
  props: ['title'],
  setup(props, { slots }) {
    return () => h('div', { class: 'mb-4' }, [
      h('h2', { class: 'text-[11px] font-bold uppercase tracking-widest text-[#999] mb-1.5' }, props.title),
      h('p', { class: 'text-[13px] sm:text-[15px] text-[#444] leading-relaxed' }, slots.default?.()),
    ])
  }
})
</script>
