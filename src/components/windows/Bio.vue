<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Notepad-style menu bar override (no File/View/Help — real notepad has its own) -->
    <textarea
      readonly
      class="flex-1 w-full resize-none border-none outline-none p-2 font-mono text-[12px] leading-relaxed text-[#111] bg-white"
      :value="bio"
    />
  </div>
</template>

<script setup>
const bio = `Dan McCarthy — bio.txt
════════════════════════════════════════════════════════════════

I'm a B2B sales and account management veteran turned indie
software builder, based in Austin, Texas.

For the past several years I've been running Scout Industries,
a portfolio of independent software products I've built and
shipped while holding down a career, raising a kid, and hosting
TriviATX, a weekly pub quiz now past its 100th edition.

I call myself a code coxswain. I don't row, I steer. Claude
handles the oars, and together we've shipped:

  • Task Coop      — a worker-owned local services marketplace
                     competing with TaskRabbit and Thumbtack
  • StratScout     — a walk-forward quant trading system running
                     live in a real brokerage account
  • ScratchScout   — a scratch-off lottery EV tracker

Plus two dozen more repos across leads generation, patent
search, senior connectivity, and whatever problem showed up next.

────────────────────────────────────────────────────────────────

My sales background shapes how I build. I know what a prospect
actually needs to hear, what a customer actually needs to do,
and where most software loses people before they ever get value.
That perspective is baked into everything I ship.

A metronome can't replace a coxswain. Neither can Claude replace
someone who knows where the boat is supposed to go.

────────────────────────────────────────────────────────────────
📍 Austin, Texas
🔗 linkedin.com/in/danjmccarthy
🐙 github.com/HansDandle
`
</script>
