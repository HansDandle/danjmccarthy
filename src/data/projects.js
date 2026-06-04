const fav = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

export const PROJECTS = [
  {
    id: 'taskcoop',
    label: 'Task Coop',
    url: 'https://taskcoop.org',
    favicon: '/favicon-taskcoop.png',
    description: "Austin's worker-owned local services marketplace. Workers keep 95% of earnings.",
  },
  {
    id: 'newpours',
    label: 'PourScout',
    url: 'https://pourscout.com',
    favicon: fav('pourscout.com'),
    description: 'Monitors Texas TABC license filings and delivers structured business leads by county or zip.',
  },
  {
    id: 'btcfaq',
    label: 'BTC FAQ',
    url: 'https://btc-faq.com',
    favicon: fav('btc-faq.com'),
    description: 'Comprehensive FAQ resource covering Bitcoin, crypto security, and earning opportunities.',
  },
  {
    id: 'poundtown',
    label: 'Pound Town',
    url: 'https://poundtowntx.com',
    favicon: fav('poundtowntx.com'),
    description: 'Celebrates the heritage of Dripping Springs, TX founders - history site + local merch.',
  },
  {
    id: 'crittergitter',
    label: 'CritterGitter',
    url: 'https://www.sitesshield.net',
    favicon: fav('sitesshield.net'),
    description: 'Referral platform connecting property owners with licensed wildlife exclusion specialists.',
  },
  {
    id: 'centexrealty',
    label: 'CentEx Realty',
    url: 'https://www.centraltxrealty.com',
    favicon: fav('centraltxrealty.com'),
    description: "Local insights and expert commentary on Central Texas real estate.",
  },
  {
    id: 'plumbersatx',
    label: 'PlumbersATX',
    url: 'https://plumbersatx.com',
    favicon: fav('plumbersatx.com'),
    description: 'Lead generation platform connecting Austin homeowners with licensed plumbers.',
  },
  {
    id: 'priorscout',
    label: 'PriorScout',
    url: null,
    favicon: fav('priorscout.vercel.app'),
    description: 'Better IP & prior art searches - coming soon.',
  },
  {
    id: 'tedbrown',
    label: 'Ted Brown TX',
    url: 'https://tedbrown.org',
    favicon: fav('tedbrown.org'),
    description: 'Libertarian candidate for U.S. Senate from Texas - campaign site.',
  },
]
