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

// The narrative the team set on 6 Oct 2026: who we are and what the festival is,
// then the Road to Milky Way building toward Delhi, Yashobhoomi (the main
// festival), the campus days, then the audience, our story, reach, the company
// we keep, the tiers and the signal. Within that, the deck's slide order holds.
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
        <Landing />
        <Campus />
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
