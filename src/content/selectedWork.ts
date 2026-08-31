import type { SelectedWorkContent } from '@/types/components'

// Only user-confirmed facts: these are live configurators worked on recently.
// No claims about contribution scope, technologies, or outcomes.
export const selectedWorkContent: SelectedWorkContent = {
  headingNumber: '03.',
  headingText: 'Selected Work',
  description:
    'Live automotive configurators I have worked on recently. The links open the live products.',
  items: [
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
