import { FocusLight } from '@/components/FocusLight';
import { Nav } from '@/components/Nav';
import { Trajectory } from '@/components/Trajectory';
import { Audience } from '@/components/sections/Audience';
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

// In the order of the deck's slides (MAIN DECK W CHANGES, s1–s18).
export default function Page() {
  return (
    <>
      <Nav />
      <main id="main" style={{ position: 'relative' }}>
        <Trajectory />
        <Hero />
        <Sky />
        <MilkyWay />
        <Audience />
        <Landing />
        <Road />
        <Origin />
        <Reach />
        <Company />
        <Tiers />
        <Signal />
      </main>
      <Footer />
      <FocusLight />
    </>
  );
}
