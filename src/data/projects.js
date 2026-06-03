// Live projects — icons fetched via Google favicon service at runtime
const fav = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

export const PROJECTS = [
  {
    id: 'taskcoop',
    label: 'Task Coop',
    url: 'https://taskcoop.vercel.app',
    favicon: fav('taskcoop.vercel.app'),
    description: "Austin's worker-owned local services marketplace. Workers keep 95% of earnings.",
  },
  {
    id: 'newpours',
    label: 'PourScout',
    url: 'https://newpours.vercel.app',
    favicon: fav('newpours.vercel.app'),
    description: 'Monitors Texas TABC license filings and delivers structured business leads by county or zip.',
  },
  {
    id: 'btcfaq',
    label: 'BTC FAQ',
    url: 'https://btc-faq.vercel.app',
    favicon: fav('btc-faq.vercel.app'),
    description: 'Comprehensive FAQ resource covering Bitcoin, crypto security, and earning opportunities.',
  },
  {
    id: 'poundtown',
    label: 'Pound Town',
    url: 'https://pound-town.vercel.app',
    favicon: fav('pound-town.vercel.app'),
    description: 'Celebrates the heritage of Dripping Springs, TX founders — history site + local merch.',
  },
  {
    id: 'crittergitter',
    label: 'CritterGitter',
    url: 'https://crittergitter.vercel.app',
    favicon: fav('crittergitter.vercel.app'),
    description: 'Referral platform connecting property owners with licensed wildlife exclusion specialists.',
  },
  {
    id: 'centexrealty',
    label: 'CentEx Realty',
    url: 'https://centexrealty.vercel.app',
    favicon: fav('centexrealty.vercel.app'),
    description: "Local insights and expert commentary on Central Texas real estate.",
  },
  {
    id: 'plumbersatx',
    label: 'PlumbersATX',
    url: 'https://plumbers-atx.vercel.app',
    favicon: fav('plumbers-atx.vercel.app'),
    description: 'Lead generation platform connecting Austin homeowners with licensed plumbers.',
  },
  {
    id: 'plumbersnova',
    label: 'PlumbersNova',
    url: 'https://plumbers-nova.vercel.app',
    favicon: fav('plumbers-nova.vercel.app'),
    description: 'Lead generation platform for plumbers in Northern Virginia.',
  },
  {
    id: 'mavfaucet',
    label: 'MAV Faucet',
    url: 'https://mav-faucet.vercel.app',
    favicon: fav('mav-faucet.vercel.app'),
    description: 'MAV token faucet for EVMavericks NFT holders.',
  },
  {
    id: 'tedbrown',
    label: 'Ted Brown TX',
    url: 'https://ted-brown-campaign.vercel.app',
    favicon: fav('ted-brown-campaign.vercel.app'),
    description: 'Libertarian candidate for U.S. Senate from Texas — campaign site.',
  },
  {
    id: 'sillybuttons',
    label: 'Silly Buttons',
    url: 'https://sillybuttons-tawny.vercel.app',
    favicon: fav('sillybuttons-tawny.vercel.app'),
    description: "My nephew's silly button website.",
  },
]
