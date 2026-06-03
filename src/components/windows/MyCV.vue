<template>
  <div class="p-4 overflow-auto text-[11px] bg-white h-full">

    <!-- Header -->
    <div class="flex items-center gap-4 border-b-2 border-[#0058e6] pb-3 mb-4">
      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#4488cc] to-[#0058e6] flex items-center justify-center text-white text-3xl flex-shrink-0">
        🧑‍💻
      </div>
      <div>
        <h1 class="text-xl font-bold text-[#003580]">Dan McCarthy</h1>
        <p class="text-[#555]">Software Developer</p>
        <div class="flex gap-3 mt-1 text-[10px] text-[#316ac5]">
          <a href="mailto:danshandle@gmail.com" class="hover:underline">✉ danshandle@gmail.com</a>
          <a href="https://linkedin.com/in/danjmccarthy" target="_blank" class="hover:underline">💼 LinkedIn</a>
          <a href="https://github.com/HansDandle" target="_blank" class="hover:underline">🐙 GitHub</a>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <Section title="Summary">
      <p class="text-[#333] leading-relaxed">
        Add your professional summary here. Describe your background, what kind of work you love doing, and what you're looking for. Keep it 2–3 sentences.
      </p>
    </Section>

    <!-- Experience -->
    <Section title="Work Experience">
      <CVItem
        title="Senior Developer"
        org="Company Name"
        period="2022 – Present"
        bullets="Led development of core product features; Reduced load time by 40%; Mentored 3 junior developers"
      />
      <CVItem
        title="Software Engineer"
        org="Previous Company"
        period="2019 – 2022"
        bullets="Built REST APIs serving 100k+ users; Migrated legacy codebase to React; Improved test coverage from 20% to 80%"
      />
    </Section>

    <!-- Education -->
    <Section title="Education">
      <CVItem
        title="B.Sc. Computer Science"
        org="Your University"
        period="2015 – 2019"
        bullets="Graduated with honors; Thesis on distributed systems"
      />
    </Section>

    <!-- Skills -->
    <Section title="Skills">
      <div class="flex flex-wrap gap-1.5">
        <span v-for="s in skills" :key="s"
          class="bg-[#dce4f5] text-[#003580] px-2 py-0.5 rounded text-[10px]">{{ s }}</span>
      </div>
    </Section>

    <!-- Download CTA -->
    <div class="mt-4 pt-3 border-t border-[#ddd]">
      <a href="#" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#316ac5] text-white rounded hover:bg-[#2255a0] text-[11px]">
        ⬇ Download PDF Resume
      </a>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, h } from 'vue'

const skills = [
  'JavaScript', 'TypeScript', 'Vue', 'React', 'Node.js',
  'Python', 'PostgreSQL', 'Docker', 'AWS', 'Git',
]

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
      h('div', { class: 'flex justify-between items-baseline' }, [
        h('span', { class: 'font-bold text-[#222]' }, props.title),
        h('span', { class: 'text-[10px] text-[#666]' }, props.period),
      ]),
      h('div', { class: 'text-[#444] mb-1' }, props.org),
      h('ul', { class: 'list-disc ml-4 text-[#555] space-y-0.5' },
        props.bullets.split(';').map(b =>
          h('li', b.trim())
        )
      ),
    ])
  },
})
</script>
