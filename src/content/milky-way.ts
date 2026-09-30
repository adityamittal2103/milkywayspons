/**
 * Every fact on the site lives here, taken from the live Google Slides deck
 * "V1: Master Sponsorship deck" (22 slides, re-read 30 Sep 2026). `s` = the
 * deck slide each fact comes from. The Road to Milky Way city names were
 * supplied by the Milky Way team; the deck's own map slide (s12) leaves them
 * unnamed.
 *
 * Editing rule: wording may be shortened for layout, never strengthened.
 * Numbers, units, qualifiers and names stay exactly as the deck states them.
 */

export const festival = {
  name: 'Milky Way',
  presenter: "Masters' Union University",
  tagline: 'The universe is yours', // s1
  dates: '20th–21st February 2027', // s1
  venue: 'Yashobhoomi Convention Center', // s1
  city: 'Delhi, India', // s1
  lockupLine: 'MU Fest 2027', // brand kit lockup
} as const;

export const prologue = {
  // s2
  opening: 'A few months ago, in a campus not so far away…',
  line: 'A group of students huddled to create a festival so epic, it almost seemed insane.',
  launch: 'Launching from',
  coordinates: '28.5049° N, 77.0892° E',
} as const;

export const origin = {
  // s3
  title: 'Every great story has an origin.',
  titleTail: "Ours began at Masters' Union University.",
  body: [
    "India's first practitioner-led institution where students Learn by Doing,",
    'Taught by CXOs and CMOs from top brands like Boat, Mama Earth, Swiggy and more.',
    'A curriculum shaped by the minds of finest educators from Harvard and Oxford.',
  ],
  kicker: 'A higher education experience built by builders, for builders.',
  photo: { id: 'graduation', alt: "Masters' Union graduates in gowns throwing their caps into the air" }, // s4
  stats: [
    { value: '2,000+', label: 'current students' },
    { value: '500+', label: 'mentors' },
    { value: '700+', label: 'alumni' },
    { value: '250+', label: 'CXOs on campus' },
  ],
} as const;

export const visitors = {
  // s5
  title: 'Soon, the best minds started making their way to campus.',
  people: [
    {
      name: 'Rohit Sharma',
      note: 'A conversation on leadership, pressure and performing at the highest level.',
      photo: 'rohit-sharma',
    },
    { name: 'Samay Raina', note: 'On comedy, creativity and the playbook behind building a following.', photo: 'samay-raina' },
    { name: 'Tanmay Bhat', note: 'A content masterclass on turning an audience into a community.', photo: 'tanmay-bhat' },
  ],
  // s6: guest sessions on campus. The deck does not name these guests, so neither does the site.
  sessions: Array.from({ length: 15 }, (_, i) => `guest-${String(i + 1).padStart(2, '0')}`),
} as const;

export const experiences = {
  // s7
  title: 'From AI summits to HYROX India, we know how to build big experiences',
  items: [
    {
      name: 'The Next Gene',
      photo: { id: 'next-gene', alt: 'A fireside chat on stage at The Next Gene summit' },
      logo: null,
      figure: '1,200',
      text: 'biotech founders, investors and builders came together at The Next Gene, our landmark BioSciences summit.',
    },
    {
      name: 'Demo Day',
      photo: { id: 'demo-day', alt: "A packed auditorium at Masters' Union Demo Day" },
      logo: null,
      figure: '₹60.5 crore',
      text: 'Our students raised ₹60.5 crore in investment, in a single hour.',
    },
    {
      name: 'HYROX',
      photo: { id: 'hyrox-delhi', alt: "HYROX Delhi signage with the Masters' Union mark" },
      logo: 'hyrox',
      figure: '25K+',
      text: "HYROX came to Delhi and Mumbai, with Masters' Union as its Title Sponsor. 25K+ athletes showed up across both cities.",
    },
    {
      name: 'Next Tech AI Summit',
      photo: { id: 'next-tech-stage', alt: 'Speakers in conversation on the Next Tech AI Summit stage' },
      logo: null,
      figure: null,
      text: 'Nas Daily. NVIDIA. Google Cloud. IndiaAI Mission, all came together at the Next Tech AI Summit.',
    },
    {
      name: 'Bloomberg',
      photo: { id: 'bloomberg-terminal', alt: 'Bloomberg Terminal screens on campus' },
      logo: 'bloomberg',
      figure: null,
      text: "The Union becomes one of the few campuses in India with live Bloomberg Terminal access, putting Wall Street data on every student's desk.",
    },
  ],
  // s7–8: the collage of those experiences
  gallery: [
    { id: 'hyrox-athletes', alt: 'Two HYROX athletes with finisher medals' },
    { id: 'hyrox-race', alt: 'Athletes racing past HYROX Delhi signage' },
    { id: 'ai-summit-demo', alt: 'A robot demonstration at the Next Tech AI Summit' },
    { id: 'hyrox-crowd', alt: 'A crowd cheering an athlete at HYROX' },
    { id: 'hyrox-start', alt: 'Athletes at the HYROX start line with a chequered flag' },
    { id: 'hyrox-runner', alt: 'A HYROX athlete mid-race' },
  ],
} as const;

export const impact = {
  // s9
  title: 'And also create impact from the ground up',
  items: [
    {
      figure: '40+',
      lead: 'startups built by students while studying',
      detail: 'Hive, Zenmo, Eat Atlas, Lexi’s, Blue Brew',
      note: 'Student ventures already operating as consumer brands and content engines',
      photo: { id: 'launchpad-kitchen', alt: 'A student venture team in a commercial kitchen' },
    },
    {
      figure: '₹1.2 Cr+',
      lead: 'cumulative revenue from student ventures, drawn in by Dropshipping Melas',
      detail: null,
      note: 'Real transactions, real P&L, real learning',
      photo: { id: 'dropshipping', alt: 'Visitors at a student stall at a Dropshipping Mela' },
    },
    {
      figure: '5 Cr',
      lead: "a live fund managed by students through the Masters' Union Investment Funds",
      detail: null,
      note: 'The chance to work with top fund managers and industry veterans',
      photo: { id: 'investment-fund', alt: 'Students in conversation beneath a Nifty market ticker' },
    },
  ],
} as const;

export const milkyWay = {
  // s10
  title: "Now, we're taking it to another universe.",
  titleName: 'Milky Way.',
  paragraphs: [
    "Born from a fire to build Asia's largest college festival, Milky Way was never going to start small. It is built by students who want to create something that has not been built before. Something ambitious, unpredictable and entirely their own.",
    'Over two days, Milky Way brings together students, creators, founders, performers, athletes and future professionals under one roof. A place to discover brands, products, ideas and careers. To experience them first-hand. To meet people who are building what comes next, and to leave with something you did not expect to find.',
  ],
  ask: 'We want you at the heart of it.',
  stats: [
    { value: '1L+', label: 'Student registrations' },
    { value: '45K+', label: 'Footfall across RTMs and main days' },
    { value: '50+', label: 'Multi-format events' },
  ],
} as const;

export const road = {
  // The journey's own name (the deck's "RTMs", s10 and the tier table), set as the heading
  name: 'Road to Milky Way',
  // s11–12
  title: 'A universe of experiences, across India',
  strapline:
    'Seven cities. Thousands of young minds. Weeks of engagement before the festival reaches Delhi. Your brand is part of the journey from the very beginning.',
  // "Micro copies to surround the map + constellation" (s11)
  micro: [
    "Get in front of some of the country's brightest young talent, across leading colleges.",
    'Where talent comes together to connect, compete and earn its place on the big stage.',
    'No two cities bring the same energy. From dance and music to theatre and sport, every stop opens up a new world of talent.',
  ],
  // Names from the Milky Way team. The order is the chart's (the team asked for
  // the clearest figure): a zigzag across the country ending in Delhi.
  stops: ['Mumbai', 'Pune', 'Bangalore', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Delhi'],
} as const;

export const landing = {
  // s13
  title: 'It all comes together at Yashobhoomi',
  subtitle: 'India’s largest convention and exhibition centre.',
  figure: '45,000+',
  figureLabel: 'footfall',
  figureNote: 'Across the 2 days, and at one of the biggest convention centers giving you the best reach possible',
  photos: [
    { id: 'yashobhoomi-outside', alt: 'The exterior of Yashobhoomi Convention Center' },
    { id: 'yashobhoomi-inside', alt: 'The foyer inside Yashobhoomi Convention Center' },
  ],
  facts: [
    { value: '250+', label: 'partner colleges & institutions' },
    { value: '7+', label: 'cities reached across India' },
    { value: 'Multiple', label: 'live stages & zones' },
  ],
} as const;

export const worlds = {
  // s14
  lead: 'The Main Days',
  title: 'A constellation of competitions, community and culture',
  figure: '50+',
  figureTail: 'events. One universe of experiences.',
  line: 'Battle of the Bands. Gaming. Sports. Informals. And everything in between.',
  nightsLine: 'Then come pronites, that take evening to a whole new level.',
  categories: [
    { name: 'Battle of the Bands', art: 'badge-guitar' },
    { name: 'Gaming', art: 'badge-crystal' },
    { name: 'Sports', art: 'badge-skate' },
    { name: 'Informals', art: 'badge-rollercoaster' },
  ],
  nights: { name: 'Pronites', count: '2', art: 'badge-keyboard' }, // s10: "two pronites"
  photos: [
    { id: 'fest-01', alt: 'A performer on stage in coloured smoke' },
    { id: 'fest-06', alt: 'A crowd under stage lights and green smoke at night' },
    { id: 'fest-03', alt: 'A dance troupe performing on a lit stage' },
    { id: 'fest-02', alt: 'Stalls and crowds on festival grounds at dusk' },
    { id: 'fest-05', alt: 'A sports team celebrating together' },
    { id: 'fest-07', alt: 'A large group in festive dress posing together' },
    { id: 'fest-04', alt: 'Performers in costume on an outdoor lawn' },
  ],
} as const;

export const reach = {
  // s15
  title: 'We’ll take this energy to our digital multiverse',
  platforms: [
    { id: 'instagram', name: 'Instagram', value: '200M+', unit: 'views', label: "Masters' Union Instagram" },
    { id: 'youtube', name: 'YouTube', value: '112M', unit: 'lifetime views', label: 'on YouTube' },
    { id: 'linkedin', name: 'LinkedIn', value: '139K', unit: 'followers', label: 'on LinkedIn' },
    { id: 'x', name: 'X', value: '2.2K', unit: 'followers', label: 'on X' },
  ],
  // s16
  studentTitle: 'Across student-run pages and initiatives',
  studentPages: [
    {
      name: 'life@mu',
      value: '1M',
      unit: 'views & reach',
      note: 'Our student-life page',
      photo: { id: 'feed-lifeatmu', alt: 'The life@mu Instagram profile' },
    },
    {
      name: 'builders.mu',
      value: '53K',
      unit: 'followers',
      note: 'Dedicated page for projects, prototypes and builds',
      photo: { id: 'feed-builders', alt: 'The builders.mu Instagram profile' },
    },
    {
      name: 'Elevator Pitch',
      value: '106K',
      unit: 'followers',
      note: 'Student founders pitching live to investors and peers',
      photo: { id: 'feed-elevator-pitch', alt: 'Two founders at a table on the Elevator Pitch set' },
    },
    {
      name: 'U18 Club',
      value: '11.6K',
      unit: 'followers',
      note: 'Our pipeline for the next generation of young builders',
      photo: { id: 'u18', alt: 'A mentor working with school students in a U18 Club session' },
    },
  ],
  reels: [
    // s17; share-tracking parameters removed
    { label: 'Indē Wild', href: 'https://www.instagram.com/reel/DWg5_sFTrt2/' },
    { label: 'POV: First day of my College', href: 'https://www.instagram.com/reel/DcSd8ExpJ2G/' },
    { label: 'Blinkit almost ruined our day', href: 'https://www.instagram.com/reel/Dblj2sUJD_D/' },
  ],
} as const;

export const company = {
  // s18; the same company as logos in companyLogos
  title: 'Our orbit has had some remarkable company.',
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
      title: 'Pan-city presence across all 7 cities',
      powered: 'Pan-city presence across all 7 cities',
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
  // s19–20
  lead: 'We now invite you to',
  title: 'mark your place in the Milky Way',
  footnote: 'The deliverables can be further curated specific to the company.',
} as const;

export const signal = {
  // s22
  title: "Let's put your brand on our map.",
  line: 'Every great presence starts with a signal.',
  lineTail: 'Send yours our way.',
  team: 'Sponsorship',
  contacts: [
    { name: 'Ananya Singh', email: 'ananya.singh1@mastersunion.org' },
    { name: 'Chirag Naryani', email: 'chirag.naryani_UGTBM2028@mastersunion.org' },
  ],
  general: { label: 'Or reach us at', email: 'milkyway@mastersunion.org' },
  address: "Masters' Union University, Gurugram, Haryana.",
  subject: 'Milky Way 2027 — Sponsorship',
} as const;

/** Waypoints on the flight path, in page order. Used by the nav and the trajectory. */
export const waypoints = [
  { id: 'launch', label: 'Launch' },
  { id: 'origin', label: 'Origin' },
  { id: 'milky-way', label: 'Milky Way' },
  { id: 'road', label: 'Road to Milky Way' },
  { id: 'landing', label: 'Yashobhoomi' },
  { id: 'worlds', label: 'The Main Days' },
  { id: 'reach', label: 'Digital multiverse' },
  { id: 'company', label: 'Company' },
  { id: 'tiers', label: 'Your place' },
  { id: 'signal', label: 'Signal' },
] as const;
