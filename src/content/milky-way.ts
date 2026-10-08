/**
 * Every fact on the site lives here, taken from the live Google Slides deck
 * "MAIN DECK W CHANGES" (18 slides, read 4 Oct 2026) and the comments on it,
 * as updated by "Deck Changes from Chirag" (6 Oct 2026; `dc` below).
 * `s` = the deck slide each fact comes from; `c` = a change asked for in a
 * comment on that slide. The Road to Milky Way city names, and the order the
 * chart visits them in, were supplied by the Milky Way team.
 *
 * Editing rule: wording may be shortened for layout, never strengthened.
 * Numbers, units, qualifiers and names stay exactly as the deck states them.
 */

export const festival = {
  name: 'Milky Way',
  presenter: "Masters' Union University",
  line: 'A Fest Where the Universe Comes Alive', // s1; headings in title case (team review, 6 Oct)
  tagline: 'The universe is yours', // brand kit lockup (footer)
  dates: '18th–21st February 2027', // dc: the whole festival, campus days and Yashobhoomi
  // dc: the two halves of the festival, in the doc's own wording
  legs: [
    { dates: '18th–19th February 2027', place: "Masters' Union University", city: 'Gurugram, India', iso: '2027-02-18' },
    { dates: '20th–21st February 2027', place: 'Yashobhoomi Convention Centre', city: 'Delhi, India', iso: '2027-02-20' },
  ],
  venue: 'Yashobhoomi Convention Center', // s1
  city: 'Delhi, India', // s1
  // Team review (6 Oct): "MU Fest is wrong". The descriptor under the wordmark.
  lockupLine: "A Masters' Union University Fest",
} as const;

export const sky = {
  // s2
  // Team review (6 Oct): one number, not the 45K–1L+ range
  title: ['1L+ GenZs,', 'Under One Sky,', 'And You Light it Up.'],
  landing: 'Landing at',
  // As the deck gives it. Note: this point is in Gurugram (the earlier deck's
  // "Launching from"); Yashobhoomi itself is at 28.5549° N, 77.0446° E.
  coordinates: '28.5049° N, 77.0892° E',
  place: 'Yashobhoomi, Delhi',
  // s2: "add location pin here, hyperlink g maps address"
  mapHref: 'https://www.google.com/maps/search/?api=1&query=Yashobhoomi+Convention+Centre+Dwarka+New+Delhi',
} as const;

export const fest = {
  // s3
  label: "Masters' Union University's Cultural Fest",
  // Team review (6 Oct): this exact wording and casing
  title: "We are Building Asia's Largest College Festival, and We Want You to Shape it With Us.",
  subhead: 'From our classrooms to a cultural experience like never before',
  // s3: four callouts side by side; one size for all four (team review, 6 Oct)
  stats: [
    { value: '2L+', label: 'student registrations' }, // dc
    { value: '2500+', label: 'target colleges' }, // final overrides (6 Oct)
    { value: '70+', label: 'events' }, // dc
    { value: '6', label: 'cities' }, // RTM: six cities (8 Oct)
  ],
  // dc: sports becomes performing arts
  events: "It's bands, gaming, performing arts and informals all day long. And when the sun goes down, the pronites begin.",
  body: 'We are bringing the brightest stars from across India into one arena of music, competition and culture.',
  // s4 c: "use the visual symbols on this page for the previous slide where we introduce MW, and write about events"
  symbols: [
    { name: 'Bands', art: 'badge-guitar' },
    { name: 'Gaming', art: 'badge-crystal' },
    { name: 'Performing Arts', art: 'playground-5' },
    { name: 'Informals', art: 'badge-rollercoaster' },
    { name: 'Pronites', art: 'badge-keyboard' },
  ],
} as const;

export const audience = {
  // s5 (c: "needs to be highlighted with the help of design")
  title: 'The Audience',
  finding: ['They’re finding themselves.', 'Their tastes.', 'Their next favourite brands.'],
  who: 'College students between 18 to 22 are coming together around what they love.',
  brand: 'Your brand can be part of their experience,',
  ways: [
    { lead: 'through a', word: 'product', tail: 'they try,' },
    { lead: 'an', word: 'experience', tail: 'they join' },
    { lead: 'or a', word: 'competition', tail: 'you help bring to life.' },
  ],
  // s6 c: smaller pictures, added to this slide; the marked photo (festival
  // grounds at dusk) removed, with a backup picture in its place.
  photos: [
    { id: 'fest-01', alt: 'A performer on stage in coloured smoke', focus: '30% 50%' },
    { id: 'fest-06', alt: 'A crowd under stage lights and green smoke at night', focus: '62% 55%' },
    { id: 'fest-03', alt: 'A dance troupe performing on a lit stage', focus: '50% 55%' },
    { id: 'hyrox-athletes', alt: 'Two athletes with finisher medals at HYROX', focus: '50% 22%' },
    { id: 'fest-05', alt: 'A sports team celebrating together', focus: '50% 68%' },
    { id: 'fest-07', alt: 'A large group in festive dress posing together', focus: '50% 68%' },
    { id: 'hyrox-crowd', alt: "A Masters' Union fan club cheering with placards", focus: '50% 30%' },
  ],
} as const;

export const campus = {
  // Final overrides (6 Oct): campus first (18th–19th), then Yashobhoomi (20th–21st).
  kicker: 'Two days on campus',
  // dc: "Add campus photo slide (18th to 19th) - campus tour video". The video was
  // supplied by the Milky Way team (YouTube, Masters' Union University's channel).
  video: { youtube: 'N5Crw6YCkSU', title: "Masters' Union Campus Tour 2026" },
} as const;

export const venue = {
  // s7. The kicker states what the team's brief (6 Oct 2026) set: the main festival happens here.
  kicker: 'The main festival',
  title: 'The Venue',
  place: 'Yashobhoomi, Delhi',
  booked: 'Booked for 20th–21st February 2027',
  // dc: replaces the 20K figure, "bolder and bigger"
  statement: "One of India's Most Sought After Spaces",
  memorable: 'We are making room for something memorable',
  draw: 'With competitions, performances, branded experiences that draw students in.',
  photos: [
    { id: 'venue-stage', alt: 'Two performers on a lit stage before a dark arena' },
    { id: 'yashobhoomi-outside', alt: 'The exterior of Yashobhoomi Convention Center' },
    { id: 'venue-hall', alt: 'A packed hall facing a lit stage' },
  ],
} as const;

export const road = {
  // s8
  name: 'Road to Milky Way',
  title: 'The Journey',
  strapline: "Before Delhi, there's a whole universe to cover",
  // dc: the description, as given
  what: 'brings one signature experience to each city on the map, free for UG students across India.',
  // 8 Oct: six cities. The approved line was written for seven; this is the
  // team's own fallback wording until a six-city line is approved.
  subhead: 'Six cities. Six experiences. One Milky Way.',
  body: 'Ride the full journey with us, from the first city to the final night in Delhi.',
  // The Milky Way team's RTM sheet (8 Oct 2026): one signature experience in each
  // of six cities, in event-date order (Delhi 31 Oct, Bangalore 21 Nov, Jaipur
  // 28 Nov, Chandigarh 5 Dec, Mumbai 12 Dec, Varanasi 20 Dec), then everyone meets
  // in Delhi. The chart (scripts/build-map.mjs) flies them in this order.
  stops: ['Delhi', 'Bangalore', 'Jaipur', 'Chandigarh', 'Mumbai', 'Varanasi'],
} as const;

export const learned = {
  // s9 (c: "a horizontal auto scroll of these people with their name underneath").
  // Names for the five the deck leaves unnamed were supplied by the Milky Way team.
  title: 'We’ve Learned From the Best,',
  people: [
    { photo: 'rohit-sharma', name: 'Rohit Sharma' },
    { photo: 'samay-raina', name: 'Samay Raina' },
    { photo: 'tanmay-bhat', name: 'Tanmay Bhat' },
    { photo: 'guest-fireside', name: 'Sahiba Bali' },
    { photo: 'guest-01', name: 'Nuseir Yasin' },
    { photo: 'guest-08', name: 'Ganeshprasad Sridharan' },
    { photo: 'guest-saree', name: 'Dr. Nandini Seth' },
    { photo: 'guest-07', name: 'Peyush Bansal' },
  ],
} as const;

export const firsts = {
  // s10 (c: each photograph labelled)
  title: 'Pulled Off Our Firsts',
  items: [
    {
      figure: '40+',
      label: 'Student-built startups',
      photo: { id: 'lexis-kitchen', caption: "Lexi's Gourmet Sandwiches", alt: "The Lexi's Gourmet Sandwiches team in their kitchen" },
    },
    {
      figure: '₹1.2 crore+',
      label: 'Cumulative revenue through Dropshipping Melas',
      photo: { id: 'dropshipping', caption: 'The Dropshipping Mela', alt: 'Visitors at a student stall at the Dropshipping Mela' },
    },
    {
      figure: '₹5 crore',
      label: 'Live student-managed investment fund',
      photo: { id: 'investment-fund', caption: "Masters' Union Investment Fund", alt: 'Students in conversation beneath a Nifty market ticker' },
    },
  ],
} as const;

export const moments = {
  // s11 (c: "only show text when they hover on the picture, horizontal scroll with arrows")
  title: 'And Crafted the Biggest Moments',
  signature: "Masters' Union University",
  items: [
    {
      name: 'HYROX Delhi & Mumbai',
      text: "Masters' Union University as Title Sponsor. 25K+ athletes across both cities.",
      photo: { id: 'hyrox-delhi-sign', alt: "HYROX Delhi signage with the Masters' Union mark" },
    },
    {
      name: 'Demo Day',
      text: '₹60.5 crore in investment committed to student ventures in a single hour.',
      photo: { id: 'demo-day-hall', alt: 'Founders pitching to a full auditorium at Demo Day' },
    },
    {
      name: 'AI Summit',
      text: 'Bringing together Nas Daily, NVIDIA, Google Cloud and IndiaAI Mission.',
      photo: { id: 'ai-summit-demo', alt: 'A robot demonstration at the AI Summit' },
    },
  ],
} as const;

export const reach = {
  // s12 (c: metrics above or below the reels; the icons all the same size)
  title: 'Enter Our Digital Multiverse',
  platforms: [
    { id: 'instagram', name: 'Instagram', value: '200M+', unit: 'views', label: '@masters.union' },
    { id: 'youtube', name: 'YouTube', value: '112M', unit: 'lifetime views', label: null },
    { id: 'linkedin', name: 'LinkedIn', value: '139K', unit: 'followers', label: null },
  ],
  // s13–14 (c: six reels, the best three first; arrows or swipe for the rest;
  // a tapped reel grows while its neighbours recede; every reel opens).
  // Share-tracking parameters removed from the links.
  reels: [
    { href: 'https://www.instagram.com/reel/Dcqmuh3BWI2/', cover: 'reel-01', alt: 'Dr Niranjan Hiranandani on building a business through data centres' },
    { href: 'https://www.instagram.com/reel/Db5s0U4POgP/', cover: 'reel-02', alt: 'Choose right people over right skills' },
    { href: 'https://www.instagram.com/reel/Db3JNfgqaF2/', cover: 'reel-03', alt: 'Palm payment in India' },
    { href: 'https://www.instagram.com/reel/DWg5_sFTrt2/', cover: 'reel-04', alt: 'Indē Wild' },
    { href: 'https://www.instagram.com/reel/DcSd8ExpJ2G/', cover: 'reel-05', alt: 'Punjabi HYROX aagye oye' },
    { href: 'https://www.instagram.com/reel/Dblj2sUJD_D/', cover: 'reel-06', alt: 'builders.mu with a Shinchan toy' },
  ],
} as const;

export const company = {
  // s15 (c: the orbit stays as it is; the last line drops only if it crowds)
  title: 'Brands In Our Orbit', // final overrides (6 Oct)
  lines: ['Brands we’ve worked with.', 'Relationships we’re proud to build on.'],
  across: 'Across Masters’ Union University’s events, programmes and partnerships.',
  names: [
    'PwC',
    'HYROX',
    'Bloomberg',
    'PokerBaazi',
    'boAt',
    'NIVIA',
    'Zerodha',
    'SuperYou',
    'Red Bull',
    'Illinois Institute of Technology',
    'Shark Tank India',
    'ITC Limited',
    'Philips',
    'Ferrari',
    'Snitch',
    'Peakst8',
    'Reebok',
    'Your Space',
    'Hero',
    'Agoda',
    'MakeMyTrip',
    'Meesho',
    'NVIDIA',
    'upGrad',
    'Myntra',
  ],
} as const;

// s18 logos, flattened to one ink by scripts/build-photos.mjs
export const companyLogos: { name: string; id: string }[] = [
  { name: 'PwC', id: 'pwc' },
  { name: 'HYROX', id: 'hyrox' },
  { name: 'Bloomberg', id: 'bloomberg' },
  { name: 'PokerBaazi', id: 'pokerbaazi' },
  { name: 'boAt', id: 'boat' },
  { name: 'NIVIA', id: 'nivia' },
  { name: 'Zerodha', id: 'zerodha' },
  { name: 'SuperYou', id: 'superyou' },
  { name: 'Red Bull', id: 'redbull' },
  { name: 'Illinois Institute of Technology', id: 'iit' },
  { name: 'Shark Tank India', id: 'sharktank' },
  { name: 'ITC Limited', id: 'itc' },
  { name: 'Philips', id: 'philips' },
  { name: 'Ferrari', id: 'ferrari' },
  { name: 'Snitch', id: 'snitch' },
  { name: 'Peakst8', id: 'peakst8' },
  { name: 'Reebok', id: 'reebok' },
  { name: 'Your Space', id: 'yourspace' },
  { name: 'Hero', id: 'hero' },
  { name: 'Agoda', id: 'agoda' },
  { name: 'MakeMyTrip', id: 'makemytrip' },
  { name: 'Meesho', id: 'meesho' },
  { name: 'NVIDIA', id: 'nvidia' },
  { name: 'upGrad', id: 'upgrad' },
  { name: 'Myntra', id: 'myntra' },
];

export type TierId = 'title' | 'powered' | 'associate' | 'cosponsor';

export const tiers: { id: TierId; name: string; ink: string }[] = [
  // s19–20, order as in the deck
  { id: 'title', name: 'Title Partner', ink: 'yellow' },
  { id: 'powered', name: 'Powered By', ink: 'purple' },
  { id: 'associate', name: 'Associate', ink: 'cyan' },
  { id: 'cosponsor', name: 'Co-Sponsor', ink: 'lime' },
];

/** `null` renders the deck's em dash: not part of that tier. `true` is the deck's tick. */
export type Entitlement = string | true | null;

export const deliverables: { name: string; values: Record<TierId, Entitlement> }[] = [
  {
    name: 'Brand Association',
    values: {
      title: 'Title integration with Milky Way',
      powered: '“Powered By” association',
      associate: 'Associate designation',
      cosponsor: 'Co-Sponsor designation',
    },
  },
  { name: 'Category Exclusivity', values: { title: true, powered: 'Available where agreed', associate: null, cosponsor: null } },
  {
    name: 'Road to Milky Way',
    values: {
      title: 'Pan-city presence across all 6 cities',
      powered: 'Pan-city presence across all 6 cities',
      associate: 'Select city / RTM touchpoints',
      cosponsor: null,
    },
  },
  {
    name: 'Main Festival Branding',
    values: {
      title: 'Highest visibility across key festival touchpoints',
      powered: 'Extensive visibility',
      associate: 'Prominent visibility across select touchpoints',
      cosponsor: 'Select branding: sponsor walls, standees & common areas',
    },
  },
  {
    name: 'Stage & Programming Visibility',
    values: {
      title: 'Primary main-stage visibility + branded AV opportunities',
      powered: 'Prominent stage / programming-zone visibility + AV opportunities',
      associate: 'Select stage / programming-zone visibility',
      cosponsor: null,
    },
  },
  {
    name: 'Emcee Mentions',
    values: { title: 'Priority mentions', powered: 'Multiple scheduled mentions', associate: 'Select mentions', cosponsor: null },
  },
  {
    name: 'Experience Zone',
    values: {
      title: 'First choice of placement + premium space',
      powered: 'Priority placement + customisation support',
      associate: 'Standard activation / booth space',
      cosponsor: 'Booth space',
    },
  },
  {
    name: 'Curated Brand Activation',
    values: {
      title: 'Up to 2 bespoke experiences',
      powered: 'Up to 1 bespoke experience',
      associate: '1 activation opportunity',
      cosponsor: 'Booth-led engagement',
    },
  },
  {
    name: 'Website Presence',
    values: {
      title: 'Premium placement across key pages',
      powered: 'Prominent placement',
      associate: 'Sponsor section + select pages',
      cosponsor: 'Sponsor section',
    },
  },
  {
    name: 'Social Media',
    values: {
      title: 'Integrated visibility across the owned digital ecosystem',
      powered: 'Extensive planned coverage',
      associate: 'Planned social coverage',
      cosponsor: 'Select stories, reels & sponsor content',
    },
  },
  {
    name: 'Email & Direct Channels',
    values: { title: 'Extensive integration', powered: 'Select integration', associate: 'Select inclusion', cosponsor: null },
  },
  {
    name: 'Artist / Headliner Integration',
    values: {
      title: 'Priority opportunities, subject to rights & availability',
      powered: 'Select opportunities, subject to rights & availability',
      associate: null,
      cosponsor: null,
    },
  },
  {
    name: 'PR & Communications',
    values: {
      title: 'Inclusion across key festival communications',
      powered: 'Select PR inclusion',
      associate: 'Sponsor acknowledgement where relevant',
      cosponsor: null,
    },
  },
  {
    name: 'Festival Collateral',
    values: {
      title: 'Premium placement across key collateral',
      powered: 'Prominent placement across key collateral',
      associate: 'Select collateral',
      cosponsor: 'Sponsor wall / select collateral',
    },
  },
  {
    name: 'Post-Event Value',
    values: {
      title: 'Detailed impact report + bespoke brand content / film',
      powered: 'Impact report + brand-film integration',
      associate: 'Performance summary + event content',
      cosponsor: 'Aftermovie inclusion',
    },
  },
  { name: 'Partner Access Passes', values: { title: '10+', powered: '8', associate: '5', cosponsor: '3' } },
];

export const tiersIntro = {
  // s16–17
  title: 'Mark Your Place in the Milky Way',
  footnote: 'The deliverables can be further curated specific to the company.',
} as const;

export const signal = {
  // s18
  title: "Let's Build Something Out Of This World.", // title case (team review, 6 Oct)
  line: 'Send us a signal.',
  team: 'Sponsorship Team',
  // Final overrides (6 Oct): a phone number for each; no postal line
  contacts: [
    { name: 'Ananya Singh', email: 'ananya.singh1@mastersunion.org', phone: '+91 83907 37132' },
    { name: 'Chirag Naryani', email: 'chirag.naryani_UGTBM2028@mastersunion.org', phone: '+91 92005 30000' },
  ],
  // Team review (6 Oct): the CTA says "Let's Connect" ("send us a signal" was said twice)
  cta: "Let's Connect",
  general: { label: 'For further queries write to us at', email: 'milkyway@mastersunion.org' },
  subject: 'Milky Way 2027 — Sponsorship',
} as const;

/** Waypoints on the flight path, in page order. Used by the nav and the trajectory. */
export const waypoints = [
  { id: 'launch', label: 'Launch' },
  { id: 'milky-way', label: 'The Fest' },
  { id: 'road', label: 'The Journey' },
  { id: 'campus', label: 'On Campus' },
  { id: 'landing', label: 'The Venue' },
  { id: 'audience', label: 'The Audience' },
  { id: 'origin', label: 'Our Story' },
  { id: 'reach', label: 'Digital Multiverse' },
  { id: 'company', label: 'Brands In Our Orbit' },
  { id: 'tiers', label: 'Sponsorship Tiers' },
  { id: 'signal', label: 'Contact' },
] as const;
