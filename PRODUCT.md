# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (React), chosen by the user. Static-exportable marketing microsite; no backend. Motion via a single animation library plus hand-built canvas/SVG where it earns its place.

## Users

Primary: brand and sponsorship decision-makers (marketing managers, brand-partnership leads, agencies) evaluating whether to sponsor Milky Way. They arrive from an outreach email or a shared link, usually on a laptop between meetings, sometimes on a phone. Their job: understand the festival, the audience and reach, the tiers and what each includes, then start a conversation with the sponsorship team.

Secondary: students and the wider Masters' Union community who will see the page shared, and who must recognise it as their festival.

## Product Purpose

The official sponsorship microsite for Milky Way, Masters' Union University's intercollegiate cultural festival (MU Fest 2027, theme DEEP SPACE). It turns the Master Sponsorship deck into a web experience a brand manager can grasp quickly and remember. Success: a sponsor understands what Milky Way is, who it reaches, what the four tiers include, and emails the team.

## Positioning

A student-built festival from India's first practitioner-led university, landing off-campus at Yashobhoomi Convention Center, Delhi (20th–21st February 2027), preceded by a 7-city Road to Milky Way. Sponsors buy into a journey (RTM cities → two-day finale), not a single weekend, backed by Masters' Union's own track record of building large experiences (HYROX, The Next Gene, Next Tech AI Summit) and its owned media footprint.

## Operating Context

- Source of truth for every fact: "V1: Master Sponsorship deck" (Google Slides), live slides 1–29. Slides 30–43 are marked "Backup slides below. Pls ignore." and are not used for claims.
- Source of truth for visuals: the Milky Way 2027 brand kit (Google Drive), mirrored locally in `brand-kit/`.
- Conversion happens by email; the deck names the contacts.

## Capabilities and Constraints

- Four sponsorship tiers exist, named in the deck: Title Partner, Powered By, Associate, Co-Sponsor. Deliverables per tier are given in the deck's comparison table (slides 26–27). No prices are in the deck; none may be shown.
- The deck names 7 Road to Milky Way (RTM) cities but does not list them. City names must not be invented.
- The deck's slide 13 carries a working title ("Asia's Biggest College Fest") inside a design note; slide 10 states the ambition as "Born from a fire to build Asia's largest college festival". Use the ambition phrasing only, never an unqualified superlative claim.
- Celebrity appearances (Rohit Sharma, Samay Raina, Tanmay Bhat) are stated as past campus sessions. No headliners for Milky Way 2027 are announced in the deck.
- Brand fonts named in the kit (Roadland for the cultural fest, Brandon Grotesque as support) are commercial and not supplied as files. Web delivery uses OFL faces until licensed files are provided.

## Brand Commitments

- Official wordmark and lockups only (vectors extracted from the kit's `.ai` master). Tagline: "The Universe is yours". Lockup line: "MU Fest 2027". Presenter line: "Masters' Union University presents".
- Wordmark rationale (kit): humanistic distortion style typography. Young, bold, rebellious, experimental, expressive, unapologetic, imperfect, expansive & infinite.
- Attribute sheet (kit): Core: Explore · Create · Discover · Participate · Belong. Personality: Poppy · Curious · Playful · Fearless · Expressive. Energy: Electric · Dynamic · Young · Experimental · Unapologetic. Symbolism: Space = possibility; floating worlds = different festival experiences; characters = students; paths and portals = discovery; stars = talent, moments, possibilities; large planetary forms = scale.
- Palette 1 (primary): Indigo #2F2FA9, Luscious Flame Green #78CC17, Royal Plum #8230C2, Phantom Black #161417, Electric Cyan #1BBDE3, Vermilion Red-Orange #DA491D. Palette 2 (accent): Bright Yellow #FFD000, Electric Purple #D845FC, Lime Green #ACE635.
- Illustration language: flat, single-ink cut/linocut illustrations (planet playgrounds, comets, black holes, portals, shooting stars, moons) and a chunky cut-shape glyph set.

## Evidence on Hand

All from the deck's live slides; quoted in `src/content/milky-way.ts` with slide references.

- Event: 20th–21st February 2027, Yashobhoomi Convention Center, Delhi. 1L+ student registrations, 45K+ footfall across RTMs and main days, 50+ multi-format events, two pronites, 250+ partner colleges & institutions, 7+ cities reached.
- Masters' Union: 2,000+ current students, 500+ mentors, 700+ alumni, 250+ CXOs on campus.
- Track record: The Next Gene (1,200 biotech founders, investors and builders), Demo Day (₹60.5 crore raised in a single hour), HYROX Delhi and Mumbai with MU as Title Sponsor (25K+ athletes), Next Tech AI Summit (Nas Daily, NVIDIA, Google Cloud, IndiaAI Mission), Bloomberg Terminal access.
- Owned media: 1.34M impressions; Instagram 375K followers; 6M average views & reach; YouTube 630K subscribers, 112M views; LinkedIn 139K followers; MU Instagram network 568K follows; Life @ MU averaging 1M views and reach; Builders.MU 120M views and reach across combined platforms and X 2.4K followers (both per the team's website edits doc, which supersedes the deck's 53K and 2.2K); Elevator Pitch by MU 106K followers; U18 Club 11.6K followers; 40+ student startups; Dropshipping Mela ₹1.2 Cr+ cumulative revenue.
- Past company (slide 25): PwC, HYROX, Bloomberg, PokerBaazi, boAt, NIVIA, Zerodha, SuperYou, Red Bull, Illinois Institute of Technology, Shark Tank India, ITC Limited, Philips, Ferrari, Snitch, Peakst8, Reebok, Your Space, Hero, Agoda, MakeMyTrip, Meesho, NVIDIA, upGrad, Myntra. Shown as the deck's own logo files, flattened to a single ink (`scripts/build-photos.mjs`).
- Contacts: Ananya Singh (ananya.singh1@mastersunion.org), Chirag Naryani (chirag.naryani_UGTBM2028@mastersunion.org), milkyway@mastersunion.org. Masters' Union University, Gurugram, Haryana.
- Photographs: all photos from the deck's live slides are on the site (`public/deck/`, provenance per file in `src/content/photos.json`). Rights to clear before wide distribution: the celebrity portraits (the deck itself notes "confirm final image rights before use"), the Yashobhoomi exterior and interior, and the festival collage on slides 15–16, whose origin the deck does not state.
- Absent, never to be fabricated: prices, testimonials, RTM city names, headliner names, venue capacity or square footage, partner logos, audience demographics beyond the stated counts.

## Product Principles

1. The deck is law for facts; the site may re-order and re-phrase for hierarchy, never inflate.
2. Sponsor clarity survives every artistic choice: tiers and deliverables must be scannable in one pass and readable without hover or motion.
3. The brand kit is law for identity; web expression extends it, never replaces it.
4. The journey (RTM cities → finale) is the sponsorship product; the site should make that trajectory legible.

## Accessibility & Inclusion

WCAG 2.2 AA. All sponsor-critical content in semantic HTML (tier comparison as a real table), reduced-motion support, keyboard access, no canvas-only or hover-only information.
