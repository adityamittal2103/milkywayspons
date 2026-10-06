import { FocusLight } from '@/components/FocusLight';
import { MarkerAlign } from '@/components/MarkerAlign';
import { Nav } from '@/components/Nav';
import { Trajectory } from '@/components/Trajectory';
import { Audience } from '@/components/sections/Audience';
import { Campus } from '@/components/sections/Campus';
import { Company } from '@/components/sections/Company';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Landing } from '@/components/sections/Landing';
import { MilkyWay } from '@/components/sections/MilkyWay';
import { Origin } from '@/components/sections/Origin';
import { Reach } from '@/components/sections/Reach';
import { Road } from '@/components/sections/Road';
import { Signal } from '@/components/sections/Signal';
import { Sky } from '@/components/sections/Sky';
import { Tiers } from '@/components/sections/Tiers';

// The narrative the team set on 6 Oct 2026 (final overrides): who we are and what
// the festival is, the Road to Milky Way, then the festival in calendar order:
// the campus days (18th–19th), then Yashobhoomi (20th–21st, the main festival);
// then the audience, our story, reach, the brands in our orbit, the tiers and the
// signal. Within that, the deck's slide order holds.
export default function Page() {
  return (
    <>
      <Nav />
      <main id="main" style={{ position: 'relative' }}>
        <Trajectory />
        <Hero />
        <Sky />
        <MilkyWay />
        <Road />
        <Campus />
        <Landing />
        <Audience />
        <Origin />
        <Reach />
        <Company />
        <Tiers />
        <Signal />
      </main>
      <Footer />
      <FocusLight />
      <MarkerAlign />
    </>
  );
}
