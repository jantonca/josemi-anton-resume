import type { SelectedWorkContent } from '@/types/components'

// Only user-confirmed facts. The configurator entries are client work delivered
// as part of a team, so they carry no contribution claims. Cortex TMS and the
// freelance sites are wholly owned and can be described directly.
export const selectedWorkContent: SelectedWorkContent = {
  headingNumber: '03.',
  headingText: 'Selected Work',
  description:
    'Open-source tooling I maintain, client sites I built end to end, and live automotive configurators I have worked on. The links open the live products.',
  items: [
    {
      title: 'Cortex TMS',
      description:
        'Open-source governance tooling for AI coding agents: a tiered documentation model, git-based staleness detection and optional LLM-assisted pattern review. Published on npm, MIT licensed.',
      url: 'https://cortex-tms.org/',
      linkText: 'View Cortex TMS',
      linkLabel: 'Open the Cortex TMS site (opens in a new tab)',
    },
    {
      title: 'Linda Jaivin',
      description:
        'Site for the Australian author Linda Jaivin, built and maintained end to end in Astro, TypeScript and Tailwind on Cloudflare.',
      url: 'https://lindajaivin.com.au/',
      linkText: 'View lindajaivin.com.au',
      linkLabel: 'Open lindajaivin.com.au (opens in a new tab)',
    },
    {
      title: 'Lexus Crafted NX',
      description:
        'Vehicle configurator for the Lexus NX, published on the Lexus Australia website.',
      url: 'https://crafted.lexus.com.au/nx/?materialCode=2M00560B2LB433T5&ep=2M00560B2_ep',
      linkText: 'View Lexus Crafted NX configurator',
      linkLabel:
        'Open the live Lexus Crafted NX configurator (opens in a new tab)',
    },
    {
      title: 'Toyota For You — HiLux',
      description:
        'Vehicle configurator for the HiLux, published on a Toyota dealer website.',
      url: 'https://sydneycitytoyota.dealer.toyota.com.au/toyota-for-you/home?vehicle=hilux&SC=37425',
      linkText: 'View Toyota For You HiLux configurator',
      linkLabel:
        'Open the live Toyota For You HiLux configurator (opens in a new tab)',
    },
  ],
}
