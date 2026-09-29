import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Geist_Mono } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz', 'wdth'],
  variable: '--font-bricolage',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to the production origin so social previews resolve.
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: "Milky Way — Sponsorship 2027 · Masters' Union University",
  description:
    "Milky Way, Masters' Union University's intercollegiate cultural festival. 20th–21st February 2027, Yashobhoomi Convention Center, Delhi. A 7-city Road to Milky Way, 1L+ student registrations, four sponsorship tiers.",
  openGraph: {
    title: 'Milky Way — The universe is yours',
    description: '20th–21st February 2027 · Yashobhoomi Convention Center · Delhi. Sponsorship 2027.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#161417',
  colorScheme: 'dark',
};

const CONTRACT = `
THESIS: The sponsorship is a journey, so the page is a flight plan: one route from Masters' Union's coordinates through seven numbered RTM nodes to the Yashobhoomi landing, ending at the sponsor's signal. Refuses hero-plus-cards-plus-pricing-grid and the purple-gradient starfield.
OWN-WORLD: The kit's cut-ink cosmos. Linocut illustrations as mask inks on full-bleed brand spot fields (indigo, plum, yellow, purple, cyan, lime) around Phantom Black; official wordmark paths; condensed Bricolage 800; a cased route line like a printed map. No gradients, glows, glass or radii.
STORY: Know what Milky Way is, when and where; believe MU builds at this scale; read reach and all four tiers in one table; email the team.
FIRST VIEWPORT: Official stacked wordmark ~60vh, centred, letters under pointer gravity; MU presents above; tagline, dates, venue lower-left; 1L+ / 45K+ / 50+ readout lower-right; "Send a signal" top-right; cropped purple ringed planet.
FORM: Launch trajectory, position 1 of 7; seed 1ccec88b.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
`;

// Marks the document as script-enabled before first paint so reveal guards apply.
const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${bricolage.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>
        <div hidden data-contract dangerouslySetInnerHTML={{ __html: `<!--${CONTRACT}-->` }} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
