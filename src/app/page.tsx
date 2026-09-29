import { Nav } from '@/components/Nav';
import { Trajectory } from '@/components/Trajectory';
import { Company } from '@/components/sections/Company';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Landing } from '@/components/sections/Landing';
import { MilkyWay } from '@/components/sections/MilkyWay';
import { Origin } from '@/components/sections/Origin';
import { Prologue } from '@/components/sections/Prologue';
import { Reach } from '@/components/sections/Reach';
import { Road } from '@/components/sections/Road';
import { Signal } from '@/components/sections/Signal';
import { Tiers } from '@/components/sections/Tiers';
import { Worlds } from '@/components/sections/Worlds';

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main" style={{ position: 'relative' }}>
        <Trajectory />
        <Hero />
        <Prologue />
        <Origin />
        <MilkyWay />
        <Road />
        <Landing />
        <Worlds />
        <Reach />
        <Company />
        <Tiers />
        <Signal />
      </main>
      <Footer />
    </>
  );
}
