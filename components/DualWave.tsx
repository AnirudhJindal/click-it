'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins only once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.fps(60);
  gsap.config({ force3D: true });
}

/* =============================== TYPES =============================== */

type Item = {
  leftText: string;
  rightText: string;
  image: string;
};

type Props = {
  items: Item[];
  waveNumber?: number;
  waveSpeed?: number;
};

/* ============================= CONSTANTS ============================= */

const UNFOCUSED_ALPHA = 0.3;
const IMAGE_OFFSET = 300;

/* ==================================================================== */

export default function DualWaveCodrops({
  items,
  waveNumber = 12,
  waveSpeed = 1,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const leftTextsRef = useRef<HTMLElement[]>([]);
  const rightTextsRef = useRef<HTMLElement[]>([]);
  const leftSettersRef = useRef<Array<(v: number) => void>>([]);
  const rightSettersRef = useRef<Array<(v: number) => void>>([]);

  const leftRangeRef = useRef({ minX: 0, maxX: 0 });
  const rightRangeRef = useRef({ minX: 0, maxX: 0 });

  const currentImageRef = useRef<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  /* ========================== IMAGE PRELOAD ========================== */

  useEffect(() => {
    let mounted = true;

    Promise.all(
      items.map(
        (item) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = item.image;
          })
      )
    ).then(() => {
      if (mounted) setImagesLoaded(true);
    });

    return () => {
      mounted = false;
    };
  }, [items]);

  /* ============================= RANGE CALC ============================= */

  const calculateRanges = useCallback(() => {
    if (!wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const leftCol = wrapper.querySelector('.wave-column-left') as HTMLElement;
    const rightCol = wrapper.querySelector('.wave-column-right') as HTMLElement;

    if (!leftCol || !rightCol) return;

    const maxLeftWidth = Math.max(
      ...leftTextsRef.current.map((t) => t.offsetWidth)
    );
    const maxRightWidth = Math.max(
      ...rightTextsRef.current.map((t) => t.offsetWidth)
    );

    leftRangeRef.current = {
      minX: 0,
      maxX: leftCol.offsetWidth - maxLeftWidth,
    };

    rightRangeRef.current = {
      minX: 0,
      maxX: rightCol.offsetWidth - maxRightWidth,
    };
  }, []);

  /* ============================= GSAP SETUP ============================= */

  useEffect(() => {
    if (!wrapperRef.current || !imagesLoaded) return;

    const wrapper = wrapperRef.current;

    /* ---------- COLLECT TEXT NODES ---------- */

    leftTextsRef.current = gsap.utils.toArray('.wave-column-left .animated-text');
    rightTextsRef.current = gsap.utils.toArray('.wave-column-right .animated-text');

    leftSettersRef.current = leftTextsRef.current.map((el) =>
      gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' })
    );
    rightSettersRef.current = rightTextsRef.current.map((el) =>
      gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' })
    );

    /* ---------- INITIAL CALCULATION ---------- */

    calculateRanges();

    /* ---------- INITIAL POSITIONS ---------- */

    const setInitial = (
      texts: HTMLElement[],
      range: { minX: number; maxX: number },
      dir: number
    ) => {
      const size = range.maxX - range.minX;

      texts.forEach((el, i) => {
        const phase = waveNumber * i - Math.PI / 2;
        const x = ((Math.sin(phase) + 1) / 2) * size;
        gsap.set(el, { x: x * dir });
      });
    };

    setInitial(leftTextsRef.current, leftRangeRef.current, 1);
    setInitial(rightTextsRef.current, rightRangeRef.current, -1);

    /* ---------- HELPERS ---------- */

    const waveX = (
      index: number,
      progress: number,
      minX: number,
      range: number
    ) => {
      const phase =
        waveNumber * index +
        waveSpeed * progress * Math.PI * 2 -
        Math.PI / 2;

      return minX + ((Math.sin(phase) + 1) / 2) * range;
    };

    const closestToCenter = () => {
      const viewportCenter = window.innerHeight / 2;
      let min = Infinity;
      let idx = 0;

      leftTextsRef.current.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - viewportCenter);
        if (d < min) {
          min = d;
          idx = i;
        }
      });

      return idx;
    };

    /* ---------- IMAGE UPDATE ---------- */

    const updateImage = (index: number) => {
      if (!imageRef.current) return;

      const focusedEl = leftTextsRef.current[index];
      if (!focusedEl) return;

      const img = focusedEl.dataset.image;
      if (img && img !== currentImageRef.current) {
        currentImageRef.current = img;
        imageRef.current.src = img;
      }

      const rect = focusedEl.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const focusedCenterY = rect.top + rect.height / 2 - wrapperRect.top;
      const targetY = focusedCenterY - IMAGE_OFFSET - imageRef.current.offsetHeight / 2;

      gsap.to(imageRef.current, {
        y: targetY,
        duration: 0.9,
        ease: 'power3.out',
      });
    };

    /* ---------- SCROLL TRIGGER ---------- */

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        const focused = closestToCenter();

        leftTextsRef.current.forEach((el, i) => {
          leftSettersRef.current[i](
            waveX(
              i,
              p,
              leftRangeRef.current.minX,
              leftRangeRef.current.maxX - leftRangeRef.current.minX
            )
          );
          el.classList.toggle('focused', i === focused);
        });

        rightTextsRef.current.forEach((el, i) => {
          rightSettersRef.current[i](
            -waveX(
              i,
              p,
              rightRangeRef.current.minX,
              rightRangeRef.current.maxX - rightRangeRef.current.minX
            )
          );
          el.classList.toggle('focused', i === focused);
        });

        updateImage(focused);
      },
    });

    /* ---------- RESIZE HANDLER ---------- */

    window.addEventListener('resize', calculateRanges);

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      window.removeEventListener('resize', calculateRanges);
    };
  }, [items, waveNumber, waveSpeed, imagesLoaded, calculateRanges]);

  /* ============================= JSX ================================ */

  return (
    <>
      <div
        ref={wrapperRef}
        className="relative bg-black flex justify-center gap-[25vw] py-[40vh]"
      >
        {/* LEFT COLUMN */}
        <div className="wave-column-left flex flex-col gap-5 flex-1 items-start">
          {items.map((item, i) => (
            <div
              key={`left-${i}`}
              data-image={item.image}
              className="animated-text uppercase text-[clamp(2rem,3vw,3rem)] leading-[0.7] will-change-transform font-light"
              style={{ color: `rgba(255,255,255,${UNFOCUSED_ALPHA})` }}
            >
              {item.leftText}
            </div>
          ))}
        </div>

        {/* IMAGE (ABOVE FOCUSED ITEM) */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <img
            ref={imageRef}
            className="max-h-[30vh] rounded-lg object-cover"
            alt=""
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="wave-column-right flex flex-col gap-5 flex-1 items-end">
          {items.map((item, i) => (
            <div
              key={`right-${i}`}
              className="animated-text uppercase text-[clamp(2rem,3vw,3rem)] leading-[0.7] will-change-transform font-light"
              style={{ color: `rgba(255,255,255,${UNFOCUSED_ALPHA})` }}
            >
              {item.rightText}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animated-text {
          transition: color 1s ease;
        }
        .animated-text.focused {
          color: white !important;
          z-index: 2;
        }
      `}</style>
    </>
  );
}