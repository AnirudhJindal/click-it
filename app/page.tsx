'use client';

import DomeGallery from '../components/DomeGallery';

export default function Home() {
  const infiniteImages = [
    'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687221080-5cb261c645cb?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687221363-72518513620e?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687221456-3be29c26e1d4?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687221558-a6b9c170ca2a?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687221891-e6c8e4d89c93?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687220247-9f786e34d472?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687220499-d9c06d99709f?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687220566-5599dbbebf11?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687220795-796d3f6f7000?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae?q=80&w=774&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1682687221038-404cb8830901?q=80&w=774&auto=format&fit=crop',
  ];

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* Dome Gallery */}
      <DomeGallery
        images={infiniteImages}
        fit={1}
        fitBasis="height"
        minRadius={400}
        maxRadius={1200}
        segments={30}
        maxVerticalRotationDeg={0}
        dragSensitivity={15}
        dragDampening={1.5}
        enlargeTransitionMs={400}
        overlayBlurColor="#000000"
        openedImageWidth="600px"
        openedImageHeight="600px"
        imageBorderRadius="20px"
        openedImageBorderRadius="20px"
        grayscale={false}
        autoRotate={true}
        autoRotateSpeed={0.1}
      />

      {/* Center Brand Text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold md:text-7xl tracking-tight">
            Click-It
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-md mx-auto">
            We help brands grow through viral, content-first strategies.
            Simple. Scalable. Impactful.
          </p>
        </div>
      </div>
    </div>
  );
}
