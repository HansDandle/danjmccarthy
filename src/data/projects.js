const fav = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
const emoji = (e) => `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='%23e0e0e0'/><text x='32' y='46' text-anchor='middle' font-size='36'>${e}</text></svg>`

export const CATEGORIES = [
  { id: 'leadgen',      label: 'Lead Gen',            icon: '🎯', blurb: 'Tools and sites that turn searches and public records into customers.' },
  { id: 'marketplaces', label: 'Marketplaces',        icon: '🤝', blurb: 'Two-sided platforms connecting Austin locals with each other.' },
  { id: 'utilities',    label: 'Utilities',           icon: '🧰', blurb: 'Single-purpose tools, web apps and downloads that do one job well.' },
  { id: 'community',    label: 'Community & Content', icon: '📰', blurb: 'Information, history and campaign sites.' },
]

export const PROJECTS = [
  // ── Lead Gen ────────────────────────────────────────
  {
    id: 'newpours',
    category: 'leadgen',
    featured: true,
    label: 'PourScout',
    url: 'https://pourscout.com',
    favicon: fav('pourscout.com'),
    description: 'A B2B sales CRM with built-in lead sourcing and enrichment: pipeline, contacts, activity and call logging, route planning and email sequences. I use it every day to sell to local businesses of every kind, nonprofits and government departments.',
  },
  {
    id: 'plumbersatx',
    category: 'leadgen',
    label: 'PlumbersATX',
    url: 'https://plumbersatx.com',
    favicon: emoji('🔧'),
    description: 'Lead generation platform connecting Austin homeowners with licensed plumbers.',
  },
  {
    id: 'crittergitter',
    category: 'leadgen',
    label: 'CritterGitter',
    url: 'https://www.sitesshield.net',
    favicon: emoji('🦝'),
    description: 'Referral platform connecting property owners with licensed wildlife exclusion specialists.',
  },
  {
    id: 'centexrealty',
    category: 'leadgen',
    label: 'CentEx Realty',
    url: 'https://www.centraltxrealty.com',
    favicon: fav('centraltxrealty.com'),
    description: 'Local insights and expert commentary on Central Texas real estate.',
  },
  {
    id: 'glpscreen',
    category: 'leadgen',
    label: 'GLP Screen',
    url: 'https://glpscreen.com',
    favicon: fav('glpscreen.com'),
    description: 'Guide to the bloodwork done before and during GLP-1 treatment: what it costs and where to order it.',
  },

  // ── Marketplaces ────────────────────────────────────
  {
    id: 'taskcoop',
    category: 'marketplaces',
    label: 'Task Coop',
    url: 'https://taskcoop.org',
    favicon: '/favicon-taskcoop.png',
    description: "Austin's worker-owned local services marketplace. Workers keep 95% of earnings.",
  },
  {
    id: 'atexchange',
    category: 'marketplaces',
    label: 'Austin Talent Exchange',
    url: 'https://www.austintalentexchange.com',
    favicon: fav('austintalentexchange.com'),
    description: 'Connects Austin bands and venues: band EPKs, venue calendars, gig applications and messaging.',
  },

  // ── Utilities ───────────────────────────────────────
  {
    id: 'scratchscout',
    category: 'utilities',
    label: 'ScratchScout',
    url: 'https://scratchscout.com',
    favicon: emoji('🎟️'),
    description: 'Live scratch-off odds, ROI and expected value for state lottery games. Find the best tickets before you buy.',
  },
  {
    id: 'jesustakethewheel',
    category: 'utilities',
    label: 'Jesus Take The Wheel',
    url: 'https://jesustakethewheel.dev',
    favicon: fav('jesustakethewheel.dev'),
    description: 'Car-buying copilot: answer a few questions, get a shortlist with honest tradeoffs, and keep dealer spam out of your inbox.',
  },
  {
    id: 'priorscout',
    category: 'utilities',
    label: 'PriorScout',
    url: null,
    favicon: emoji('🔍'),
    description: 'A tool for IP attorneys who want a smarter way to search for prior art. Coming soon.',
  },
  {
    id: 'linedrive',
    category: 'utilities',
    label: 'LineDrive',
    url: 'https://github.com/HansDandle/LineDrive',
    favicon: emoji('📺'),
    description: 'Self-hosted DVR for HDHomeRun tuners: program guide, series recording and plain-English search. Free download.',
  },
  {
    id: 'pdfacil',
    category: 'utilities',
    label: 'PDFacil',
    url: 'https://github.com/HansDandle/PDFacil',
    favicon: emoji('📄'),
    description: 'Edit Canva PDFs without going back to Canva. Runs locally, keeps your fonts. Free download.',
  },
  {
    id: 'nocapcalc',
    category: 'utilities',
    label: 'No Cap Calculator',
    url: 'https://projectnocap-district-tool.vercel.app',
    favicon: fav('projectnocap.com'),
    description: 'Enter an address to see your U.S. House district and how it would change under seven apportionment rules.',
  },

  // ── Community & Content ─────────────────────────────
  {
    id: 'btcfaq',
    category: 'community',
    label: 'BTC FAQ',
    url: 'https://btc-faq.com',
    favicon: fav('btc-faq.com'),
    description: 'Comprehensive FAQ resource covering Bitcoin, crypto security, and earning opportunities.',
  },
  {
    id: 'poundtown',
    category: 'community',
    label: 'Pound Town',
    url: 'https://poundtowntx.com',
    favicon: fav('poundtowntx.com'),
    description: 'Celebrates the heritage of Dripping Springs, TX founders - history site + local merch.',
  },
  {
    id: 'tedbrown',
    category: 'community',
    label: 'Ted Brown TX',
    url: 'https://tedbrown.org',
    favicon: fav('tedbrown.org'),
    description: 'Libertarian candidate for U.S. Senate from Texas - campaign site.',
  },
]

// Categories in display order, each with its projects
export const PROJECT_GROUPS = CATEGORIES.map(c => ({
  ...c,
  projects: PROJECTS.filter(p => p.category === c.id),
}))
