'use client';

import DualWaveCodrops from '../components/DualWave';

/* ---------------- BRAND DATA ---------------- */

const LEFT_NAMES = [
  '‎ ',
  'Éclat',
  'Project Ion',
  'AeroLine',
  'Série Noir',
  'UltraRun',
  'Atelier 03',
  'Pulse One',
  'Linea 24',
  'Echo Series',
  'Zero',
  'Shift / Black',
  'Solar Drift',
  'Mode / 3',
  'Pure Form',
  'Nova X',
  'Axis',
  'Drift Lab',
  'Frame 09',
  'Signal',
  'Contour',
  'Vanta',
  'Arc',
  'Module',
  '‎ ',
];

const RIGHT_NAMES = [
  '‎ ',
  'Chanel',
  'Apple',
  'BMW',
  'Saint Laurent',
  'Nike',
  'Hermès',
  'Adidas',
  'Prada',
  'Google',
  'Polestar',
  'Balenciaga',
  'Audi',
  'Samsung',
  'Bottega Veneta',
  'Sony',
  'Meta',
  'Microsoft',
  'Intel',
  'Canon',
  'Porsche',
  'Lexus',
  'Gucci',
  'Fendi',
  '‎ ',
];

function generateWaveItems(count: number) {
  return Array.from({ length: count }, (_, i) => {
    return {
      leftText: LEFT_NAMES[i % LEFT_NAMES.length],
      rightText: RIGHT_NAMES[i % RIGHT_NAMES.length],
      image: `https://picsum.photos/seed/wave-${i}/700/900`,
    };
  });
}

/* ---------------- PAGE ---------------- */

export default function Home() {
  const waveItems = generateWaveItems(25);

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <DualWaveCodrops
        items={waveItems}
        waveNumber={12}
        waveSpeed={1}
      />
    </div>
  );
}
