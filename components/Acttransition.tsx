'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ============================= TYPES ============================= */

type Props = {
  text: string;
  pinDuration?: string;
};

/* ================================================================= */

export default function ActTransition({ 
  text, 
  pinDuration = '300%'
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!titleRef.current || !containerRef.current) return;

    const title = titleRef.current;
    const container = containerRef.current;
    
    // Split text into words and chars
    const words = text.split(' ').filter(word => word.trim());
    title.innerHTML = words
      .map(word => {
        const chars = word.split('').map(char => `<span class="char">${char}</span>`).join('');
        return `<span class="word">${chars}</span>`;
      })
      .join(' ');

    const wordElements = gsap.utils.toArray<HTMLElement>('.word', title);
    
    // Set perspective on parent
    wordElements.forEach(word => {
      if (word.parentNode) {
        gsap.set(word.parentNode, { perspective: 1000 });
      }
    });

    // Animate words zooming in from random 3D positions
    gsap.fromTo(
      wordElements,
      {
        willChange: 'opacity, transform',
        z: () => gsap.utils.random(400, 700),
        opacity: 0,
        xPercent: () => gsap.utils.random(-60, 60),
        yPercent: () => gsap.utils.random(-8, 8),
        rotationX: () => gsap.utils.random(-60, 60),
      },
      {
        ease: 'power2.out',
        opacity: 1,
        rotationX: 0,
        rotationY: 0,
        xPercent: 0,
        yPercent: 0,
        z: 0,
        scrollTrigger: {
          trigger: title,
          start: 'center center',
          end: `+=${pinDuration}`,
          scrub: 1.5,
          pin: container,
          onEnter: (self) => {
            scrollTriggerRef.current = self as unknown as ScrollTrigger;
          },
        },
        stagger: {
          each: 0.004,
          from: 'random',
        },
      }
    );

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === title) {
          trigger.kill();
        }
      });
    };
  }, [text, pinDuration]);

  return (
    <div ref={containerRef} className="act-transition-wrapper">
      <h2 ref={titleRef} className="act-transition-title">
        {text}
      </h2>

      <style jsx>{`
        .act-transition-wrapper {
          width: 100vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: black;
          padding: 4rem 8rem;
          will-change: transform;
          transform: translateZ(0);
        }

        @media (max-width: 768px) {
          .act-transition-wrapper {
            padding: 2rem 1.5rem;
          }
        }

        .act-transition-title {
          font-size: clamp(0.875rem, 1.5vw, 1.25rem);
          font-weight: 300;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          text-align: center;
          margin: 0;
          max-width: 90ch;
          letter-spacing: 0.05em;
          backface-visibility: hidden;
          perspective: 1000px;
        }

        .act-transition-title :global(.word) {
          display: inline-block;
          white-space: nowrap;
          margin: 0 0.15em;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        .act-transition-title :global(.char) {
          display: inline-block;
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}