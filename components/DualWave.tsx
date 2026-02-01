'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.fps(60);
gsap.config({ force3D: true });

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
const IMAGE_OFFSET = 300; // 👈 distance ABOVE focused text (red spot)

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

  /* ========================== IMAGE PRELOAD ========================== */

  useEffect(() => {
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
    ).then(() => setImagesLoaded(true));
  }, [items]);

  /* ============================= GSAP ================================ */

  useEffect(() => {
    if (!wrapperRef.current || !imagesLoaded) return;

    const wrapper = wrapperRef.current;

    /* ---------- COLLECT TEXT NODES ---------- */

    leftTextsRef.current = gsap.utils.toArray(
      '.wave-column-left .animated-text'
    );
    rightTextsRef.current = gsap.utils.toArray(
      '.wave-column-right .animated-text'
    );

    leftSettersRef.current = leftTextsRef.current.map((el) =>
      gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' })
    );
    rightSettersRef.current = rightTextsRef.current.map((el) =>
      gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' })
    );

    /* ---------- RANGE CALC ---------- */

    const calculateRanges = () => {
      const leftCol = wrapper.querySelector(
        '.wave-column-left'
      ) as HTMLElement;
      const rightCol = wrapper.querySelector(
        '.wave-column-right'
      ) as HTMLElement;

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
    };

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

    /* ---------- IMAGE ABOVE FOCUSED ITEM ---------- */

    const updateImage = (index: number) => {
      if (!imageRef.current) return;

      const focusedEl = leftTextsRef.current[index];
      if (!focusedEl) return;

      // update image src
      const img = focusedEl.dataset.image;
      if (img && img !== currentImageRef.current) {
        currentImageRef.current = img;
        imageRef.current.src = img;
      }

      const rect = focusedEl.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const focusedCenterY =
        rect.top + rect.height / 2 - wrapperRect.top;

      //  IMAGE GOES ABOVE FOCUSED ITEM
      const targetY =
        focusedCenterY -
        IMAGE_OFFSET -
        imageRef.current.offsetHeight / 2;

      gsap.to(imageRef.current, {
        y: targetY,
        duration: 0.9,
        ease: 'power3.out',
      });
    };

    /* ---------- SCROLL ---------- */

    const trigger = ScrollTrigger.create({
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

    window.addEventListener('resize', calculateRanges);

    return () => {
      trigger.kill();
      window.removeEventListener('resize', calculateRanges);
    };
  }, [items, waveNumber, waveSpeed, imagesLoaded]);

  /* ============================= JSX ================================ */

  return (
    <>
      <div
        ref={wrapperRef}
        className="relative flex justify-center gap-[25vw] py-[40vh]"
      >
        {/* LEFT COLUMN */}
        <div className="wave-column-left flex flex-col gap-5 flex-1 items-start">
          {items.map((item, i) => (
            <div
              key={i}
              data-image={item.image}
              className="animated-text uppercase text-[clamp(2rem,3vw,3rem)] leading-[0.7] will-change-transform"
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
              key={i}
              className="animated-text uppercase text-[clamp(2rem,3vw,3rem)] leading-[0.7] will-change-transform"
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