'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import heavy components with no SSR
const DualWaveCodrops = dynamic(() => import('../components/DualWave'), {
  ssr: false,
  loading: () => <div className="min-h-[200vh] bg-black" />
});

const ActTransition = dynamic(() => import('../components/Acttransition'), {
  ssr: false,
  loading: () => <div className="min-h-[200vh] bg-black" />
});

const Galaxy = dynamic(() => import('../components/Galaxy'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />
});

const DomeGallery = dynamic(() => import('../components/DomeGallery'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-black" />
});

// Import lightweight components normally
import Header from '../components/Header';
import Footer from '../components/Footer';

/* ---------------- BRAND DATA ---------------- */

const LEFT_NAMES = [
  ' ',
  'UGC',
  'CLIPPING',
  'SHORT FORM',
  'REELS',
  'SHORTS',
  'VIRAL CUTS',
  'CONTENT',
  'EDITING',
  'BOUNTIES',
  'TASKS',
  'MISSIONS',
  'DROPS',
  'CLIPS',
  'MOMENTS',
  'ATTENTION',
  'REACH',
  'TRACTION',
  'SIGNALS',
  'VIEWS',
  'ENGAGEMENT',
  'PAYOUTS',
  'EARNINGS',
  'SCALE',
  'CLICKC.APP',
  ' ',
];

const RIGHT_NAMES = [
  ' ',
  'CREATORS',
  'CLIPPERS',
  'EDITORS',
  'UGC CREATORS',
  'INFLUENCERS',
  'REEL PAGES',
  'SHORTS PAGES',
  'FACELESS PAGES',
  'FOUNDERS',
  'SOLO BUILDERS',
  'STUDENTS',
  'SIDE HUSTLERS',
  'COMMUNITIES',
  'INDEPENDENTS',
  'INDIA',
  'THE INTERNET',
  'PEOPLE',
  'REAL VOICES',
  'HUMANS',
  'YOU',
  ' ',
];

function generateWaveItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    leftText: LEFT_NAMES[i % LEFT_NAMES.length],
    rightText: RIGHT_NAMES[i % RIGHT_NAMES.length],
    image: `https://picsum.photos/seed/wave-${i}/700/900`,
  }));
}

const MANIFESTO_TEXT = `
CLICKC IS A NEW WAY TO EARN ONLINE.

PLATFORMS SAY THEY'RE CREATOR-FIRST.
THEY AREN'T.
THEY REWARD THEMSELVES.
NOT THE PEOPLE WHO CREATE THE VALUE.

PEOPLE DON'T BUY FROM BRANDS.
THEY BUY FROM PEOPLE.

EVERY COMPANY KNOWS THIS.
THEY NEED REAL VOICES.
THEY NEED UGC.
THEY NEED CLIPS THEY CAN'T FAKE.

BUT THE MONEY STILL FLOWS TO PLATFORMS.
WE SEND IT TO CREATORS AND CLIPPERS.

NO DEGREE.
NO 9–5.
NO PERMISSION.

CREATE UGC.
CLIP CONTENT.
TURN ATTENTION INTO INCOME.

THIS IS CLICKC.
`;

/* ---------------- PAGE ---------------- */

export default function Home() {
  // Memoize wave items to prevent unnecessary recalculations
  const waveItems = useMemo(() => generateWaveItems(22), []);

  return (
    <div className="relative bg-black text-white overflow-x-hidden">

      {/* ================= FIXED HEADER ================= */}
      <Header />

      {/* ================= HERO: GALAXY + DOME ================= */}
      <section className="relative h-screen w-full overflow-hidden">

        {/* Galaxy background */}
        <div className="absolute inset-0 z-0">
          <Galaxy
            transparent={false}
            density={0.25}
            glowIntensity={0.25}
            saturation={0.08}
            twinkleIntensity={0.25}
            rotationSpeed={0.02}
            hueShift={35}
            mouseInteraction
            mouseRepulsion
            repulsionStrength={1.5}
          />
        </div>

        {/* DomeGallery foreground */}
        <div className="relative z-10 h-full w-full">
          <DomeGallery
            autoRotate
            imageBorderRadius='20%'
            autoRotateSpeed={0.08}
            autoRotateHoverSpeed={0.15}
            grayscale={false}
            fitBasis="height"
            maxVerticalRotationDeg={4}
            dragSensitivity={25}
          />
        </div>

        {/* ===== CENTER HERO TEXT ===== */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center font-mono tracking-widest">
            <div className="text-xs text-white/60 mb-3">
              UGC · CLIPPING · SHORT FORM
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white">
              CLICKC
            </h1>
            <div className="mt-4 text-xs text-white/50">
              TURN ATTENTION INTO INCOME
            </div>
          </div>
        </div>

      </section>

      {/* ================= DUAL WAVE ================= */}
      <section className="relative min-h-[200vh] z-10">
        <DualWaveCodrops
          items={waveItems}
          waveNumber={12}
          waveSpeed={1}
        />
      </section>

      {/* ================= MANIFESTO ================= */}
      <section className="relative min-h-[200vh] z-10">
        <ActTransition
          text={MANIFESTO_TEXT}
          pinDuration="300%"
        />
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}