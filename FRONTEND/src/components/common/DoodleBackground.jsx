import React, { useEffect, useRef, useState, useMemo } from 'react';

// Hand-drawn line-art educational doodles directly inspired by the reference image
const DOODLE_SVGS = [
  // 1. Open Book with spine and text lines
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 14C11 12 19 13 24 16C29 13 37 12 44 14V36C37 34 29 35 24 38C19 35 11 34 4 36V14Z" />
      <path d="M24 16V38" />
      <path d="M9 20C14 19 18 19.5 21 21" />
      <path d="M9 25C14 24 18 24.5 21 26" />
      <path d="M9 30C14 29 18 29.5 21 31" />
      <path d="M27 21C30 19.5 34 19 39 20" />
      <path d="M27 26C30 24.5 34 24 39 25" />
      <path d="M27 31C30 29.5 34 29 39 30" />
    </svg>
  ),
  // 2. Closed Notebook with Label and Bookmark
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="10" y="6" width="28" height="36" rx="3" />
      <line x1="16" y1="6" x2="16" y2="42" />
      <rect x="22" y="12" width="10" height="7" rx="1" strokeDasharray="1 1" />
      <path d="M25 6V16L28 14L31 16V6" />
      <line x1="20" y1="26" x2="34" y2="26" />
      <line x1="20" y1="31" x2="31" y2="31" />
    </svg>
  ),
  // 3. Hexagonal Pencil
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M34 6L42 14L16 40L6 42L8 32L34 6Z" />
      <line x1="28" y1="12" x2="36" y2="20" />
      <line x1="11" y1="35" x2="13" y2="37" />
      <path d="M6 42L11 37" />
      <line x1="31" y1="9" x2="11" y2="29" />
    </svg>
  ),
  // 4. Ballpoint Pen with Pocket Clip
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M38 5L43 10L17 36L10 38L12 31L38 5Z" />
      <path d="M33 10L30 13L35 18L38 15" />
      <path d="M30 13L32 23L35 21" />
      <line x1="10" y1="38" x2="7" y2="41" />
    </svg>
  ),
  // 5. Straight Edge Ruler with Ticks
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="8" y="16" width="32" height="16" rx="2" transform="rotate(-25 24 24)" />
      <line x1="14" y1="19" x2="16" y2="23" transform="rotate(-25 24 24)" />
      <line x1="19" y1="18" x2="21" y2="24" transform="rotate(-25 24 24)" />
      <line x1="24" y1="18" x2="26" y2="22" transform="rotate(-25 24 24)" />
      <line x1="29" y1="18" x2="31" y2="24" transform="rotate(-25 24 24)" />
      <line x1="34" y1="18" x2="36" y2="22" transform="rotate(-25 24 24)" />
    </svg>
  ),
  // 6. Set Square Triangle Ruler
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 8V40H40L8 8Z" />
      <path d="M15 21V34H28L15 21Z" />
      <line x1="8" y1="14" x2="12" y2="14" />
      <line x1="8" y1="20" x2="11" y2="20" />
      <line x1="8" y1="26" x2="12" y2="26" />
      <line x1="8" y1="32" x2="11" y2="32" />
      <line x1="20" y1="40" x2="20" y2="37" />
      <line x1="26" y1="40" x2="26" y2="36" />
      <line x1="32" y1="40" x2="32" y2="37" />
    </svg>
  ),
  // 7. Semicircle Protractor
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 32H42C42 22 34 14 24 14C14 14 6 22 6 32Z" />
      <circle cx="24" cy="32" r="2" />
      <line x1="24" y1="14" x2="24" y2="18" />
      <line x1="13" y1="19" x2="16" y2="22" />
      <line x1="35" y1="19" x2="32" y2="22" />
      <line x1="8" y1="28" x2="12" y2="28" />
      <line x1="40" y1="28" x2="36" y2="28" />
    </svg>
  ),
  // 8. Graduation Mortarboard with Tassel
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M24 8L44 18L24 28L4 18L24 8Z" />
      <path d="M12 22.5V33C12 33 16 38 24 38C32 38 36 33 36 33V22.5" />
      <path d="M40 20V34L42 36L44 34V20" />
      <circle cx="24" cy="18" r="1.5" fill="currentColor" />
    </svg>
  ),
  // 9. Desktop Globe on Curved Stand
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="24" cy="20" r="13" />
      <ellipse cx="24" cy="20" rx="6" ry="13" />
      <line x1="11" y1="20" x2="37" y2="20" />
      <path d="M24 4C33 4 39 11 39 20C39 29 33 36 24 36" />
      <path d="M24 36V42" />
      <path d="M17 42H31" />
    </svg>
  ),
  // 10. Idea Light Bulb
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 20C16 15.6 19.6 12 24 12C28.4 12 32 15.6 32 20C32 23.5 29.5 26.5 28 29V33H20V29C18.5 26.5 16 23.5 16 20Z" />
      <line x1="21" y1="37" x2="27" y2="37" />
      <line x1="22" y1="41" x2="26" y2="41" />
      <path d="M22 23L24 18L26 23" />
      <line x1="24" y1="6" x2="24" y2="9" />
      <line x1="12" y1="12" x2="14" y2="14" />
      <line x1="36" y1="12" x2="34" y2="14" />
    </svg>
  ),
  // 11. Science Atom Model
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="24" cy="24" r="3.5" fill="currentColor" />
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(30 24 24)" />
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(-30 24 24)" />
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(90 24 24)" />
    </svg>
  ),
  // 12. Chemistry Erlenmeyer Flask
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 6H27" />
      <path d="M22 6V16L10 38C9 40 10 42 12 42H36C38 42 39 40 38 38L26 16V6" />
      <line x1="15" y1="34" x2="33" y2="34" strokeDasharray="2 2" />
      <circle cx="19" cy="30" r="1.5" fill="currentColor" />
      <circle cx="28" cy="27" r="1" fill="currentColor" />
    </svg>
  ),
  // 13. Laboratory Microscope
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="23" y="6" width="6" height="15" rx="1" transform="rotate(-20 26 13)" />
      <path d="M30 6L33 5" />
      <path d="M21 21L19 24" />
      <circle cx="18" cy="26" r="3" />
      <path d="M20 28C24 30 26 34 24 38H12" />
      <line x1="12" y1="28" x2="22" y2="28" />
      <rect x="8" y="38" width="22" height="5" rx="1" />
      <line x1="13" y1="38" x2="13" y2="33" />
    </svg>
  ),
  // 14. Classroom Blackboard on Easel
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="8" y="8" width="32" height="22" rx="2" />
      <line x1="6" y1="30" x2="42" y2="30" />
      <path d="M12 30V42L16 42" />
      <path d="M36 30V42L32 42" />
      <line x1="14" y1="16" x2="22" y2="16" />
      <line x1="14" y1="21" x2="28" y2="21" />
      <rect x="28" y="27" width="5" height="2" rx="0.5" />
    </svg>
  ),
  // 15. Champion Trophy Cup
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 8H34V20C34 25.5 29.5 30 24 30C18.5 30 14 25.5 14 20V8Z" />
      <path d="M14 12H8C8 17 11 20 14 20" />
      <path d="M34 12H40C40 17 37 20 34 20" />
      <path d="M24 30V36" />
      <rect x="16" y="36" width="16" height="6" rx="1" />
      <path d="M24 13L25.5 16L29 16.5L26.5 19L27 22.5L24 21L21 22.5L21.5 19L19 16.5L22.5 16L24 13Z" />
    </svg>
  ),
  // 16. Twin-Bell Alarm Clock
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="24" cy="26" r="14" />
      <path d="M10 13C8 10 9 6 13 8C16 9.5 16 11 15 13" />
      <path d="M38 13C40 10 39 6 35 8C32 9.5 32 11 33 13" />
      <line x1="24" y1="26" x2="24" y2="18" />
      <line x1="24" y1="26" x2="31" y2="26" />
      <line x1="14" y1="38" x2="11" y2="42" />
      <line x1="34" y1="38" x2="37" y2="42" />
      <path d="M22 12V10H26V12" />
    </svg>
  ),
  // 17. School Backpack / Rucksack
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 16C12 11 16 7 24 7C32 7 36 11 36 16V40C36 41 35 42 34 42H14C13 42 12 41 12 40V16Z" />
      <rect x="16" y="24" width="16" height="13" rx="2" />
      <path d="M20 7V4C20 4 22 3 24 3C26 3 28 4 28 4V7" />
      <line x1="16" y1="16" x2="32" y2="16" />
      <line x1="21" y1="28" x2="27" y2="28" />
      <path d="M12 24H9C8 24 8 26 8 28V36H12" />
      <path d="M36 24H39C40 24 40 26 40 28V36H36" />
    </svg>
  ),
  // 18. Geometrical Compass Divider
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="24" cy="9" r="3" />
      <line x1="24" y1="4" x2="24" y2="6" />
      <path d="M22 12L12 42" />
      <path d="M26 12L36 42" />
      <path d="M16 28C19 26 29 26 32 28" />
      <circle cx="24" cy="27" r="1" fill="currentColor" />
    </svg>
  ),
  // 19. Sand Hourglass
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="8" x2="36" y2="8" />
      <line x1="12" y1="40" x2="36" y2="40" />
      <path d="M15 8C15 20 22 24 24 24C26 24 33 20 33 8" />
      <path d="M15 40C15 28 22 24 24 24C26 24 33 28 33 40" />
      <path d="M21 37H27L24 33L21 37Z" fill="currentColor" opacity="0.3" />
      <line x1="24" y1="23" x2="24" y2="28" strokeDasharray="1 1" />
    </svg>
  ),
  // 20. Scissors
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="14" cy="35" r="5" />
      <circle cx="34" cy="35" r="5" />
      <path d="M18 32L34 8" />
      <path d="M30 32L14 8" />
      <circle cx="24" cy="21" r="1.5" fill="currentColor" />
    </svg>
  ),
  // 21. Study Desk Lamp
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 12L28 6L33 16L21 22L16 12Z" />
      <line x1="21" y1="22" x2="16" y2="34" />
      <line x1="16" y1="34" x2="24" y2="40" />
      <ellipse cx="26" cy="41" rx="8" ry="3" />
      <circle cx="21" cy="22" r="2" />
      <circle cx="16" cy="34" r="2" />
    </svg>
  ),
  // 22. Exam Clipboard
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="10" y="10" width="28" height="32" rx="3" />
      <path d="M19 10V7C19 6 20 5 21 5H27C28 5 29 6 29 7V10" />
      <rect x="17" y="8" width="14" height="5" rx="1.5" />
      <line x1="16" y1="19" x2="32" y2="19" />
      <line x1="16" y1="25" x2="32" y2="25" />
      <line x1="16" y1="31" x2="26" y2="31" />
    </svg>
  ),
  // 23. Reading Glasses
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="15" cy="25" r="8" />
      <circle cx="33" cy="25" r="8" />
      <path d="M23 23C24 21 24 21 25 23" />
      <path d="M7 23L4 16" />
      <path d="M41 23L44 16" />
    </svg>
  ),
  // 24. Artist Paint Palette with Brush
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M24 6C14 6 6 14 6 24C6 32 12 38 18 38C20 38 21 37 21 35C21 34 20 33 20 31C20 28 23 26 26 26H28C35 26 42 21 42 16C42 10.5 34 6 24 6Z" />
      <circle cx="14" cy="16" r="2" fill="currentColor" />
      <circle cx="21" cy="12" r="2" fill="currentColor" />
      <circle cx="29" cy="12" r="2" fill="currentColor" />
      <circle cx="35" cy="18" r="2" fill="currentColor" />
      <circle cx="15" cy="27" r="3" />
    </svg>
  ),
  // 25. Soccer Sports Ball
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="24" cy="24" r="16" />
      <polygon points="24,18 29,22 27,28 21,28 19,22" />
      <line x1="24" y1="18" x2="24" y2="8" />
      <line x1="29" y1="22" x2="38" y2="18" />
      <line x1="27" y1="28" x2="34" y2="36" />
      <line x1="21" y1="28" x2="14" y2="36" />
      <line x1="19" y1="22" x2="10" y2="18" />
    </svg>
  ),
  // 26. Classroom Handbell
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M24 16C17 16 16 26 14 32C13 34 11 35 11 36H37C37 35 35 34 34 32C32 26 31 16 24 16Z" />
      <path d="M24 16V6" />
      <circle cx="24" cy="5" r="2" />
      <path d="M22 36C22 38 23 40 24 40C25 40 26 38 26 36" />
    </svg>
  ),
  // 27. Math & Science Symbols (Sigma, Pi, Root)
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 14H22" />
      <path d="M12 14V26C12 28 11 29 9 29" />
      <path d="M18 14V28C18 28 18 29 20 29" />
      <path d="M38 12H27L33 20L27 28H38" />
      <path d="M24 38L27 42L33 32H42" />
    </svg>
  ),
  // 28. Pocket Calculator
  (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="11" y="6" width="26" height="36" rx="3" />
      <rect x="15" y="11" width="18" height="7" rx="1.5" />
      <circle cx="17" cy="24" r="1.5" fill="currentColor" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" />
      <circle cx="31" cy="24" r="1.5" fill="currentColor" />
      <circle cx="17" cy="30" r="1.5" fill="currentColor" />
      <circle cx="24" cy="30" r="1.5" fill="currentColor" />
      <circle cx="31" cy="30" r="1.5" fill="currentColor" />
      <circle cx="17" cy="36" r="1.5" fill="currentColor" />
      <circle cx="24" cy="36" r="1.5" fill="currentColor" />
      <rect x="29" y="34.5" width="4" height="3" rx="0.5" fill="currentColor" />
    </svg>
  )
];

export const DoodleBackground = () => {
  const containerRef = useRef(null);
  const domNodesRef = useRef([]);
  const itemsRef = useRef([]);
  const mouseRef = useRef({ x: -2000, y: -2000, active: false });
  const animFrameRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1400, height: 900 });

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth || 1400,
        height: window.innerHeight || 900
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate organic, non-grid scattered coordinates across the entire viewport
  const doodleData = useMemo(() => {
    const { width, height } = dimensions;
    // Step size ~115px - 130px with strong random jitter for natural hand-drawn wallpaper distribution
    const cols = Math.max(6, Math.ceil(width / 125));
    const rows = Math.max(5, Math.ceil(height / 125));
    const cellW = width / cols;
    const cellH = height / rows;

    const list = [];
    let count = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Skip occasional cells randomly to break mechanical symmetry
        if ((r + c) % 8 === 3 && count % 5 === 0) continue;

        // Jitter offsets (up to 40% of cell width & height)
        const jitterX = (Math.random() - 0.5) * cellW * 0.8;
        const jitterY = (Math.random() - 0.5) * cellH * 0.8;

        const homeX = Math.round(c * cellW + cellW / 2 + jitterX);
        const homeY = Math.round(r * cellH + cellH / 2 + jitterY);

        // Random rotation (-35 deg to +35 deg)
        const baseRot = (Math.random() - 0.5) * 70;
        // Varied sizes (scale 0.85 to 1.35)
        const scale = 0.85 + Math.random() * 0.45;
        // Pick doodle icon
        const svgIdx = (count * 7 + (r * 5) + c) % DOODLE_SVGS.length;

        // Subtle idle floating parameters
        const idleSpeed = 0.0012 + Math.random() * 0.0016;
        const idlePhase = Math.random() * Math.PI * 2;
        const idleAmp = 3 + Math.random() * 4;

        list.push({
          id: `doodle-${r}-${c}`,
          svgIdx,
          homeX,
          homeY,
          currX: homeX,
          currY: homeY,
          vx: 0,
          vy: 0,
          baseRot,
          currRot: baseRot,
          vRot: 0,
          scale,
          idleSpeed,
          idlePhase,
          idleAmp
        });
        count++;
      }
    }
    return list;
  }, [dimensions]);

  // Synchronize physics items ref & cache DOM elements
  useEffect(() => {
    itemsRef.current = doodleData.map((d) => ({ ...d }));
    // Cache DOM elements
    domNodesRef.current = doodleData.map((d) => document.getElementById(d.id));
  }, [doodleData]);

  // Global Pointer & Touch Tracking relative to the viewport
  useEffect(() => {
    const onPointerMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true
      };
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('blur', onPointerLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
    };
  }, []);

  // High-Performance Physics Simulation Loop on requestAnimationFrame
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 16.66, 2.0); // Normalized to ~60fps
      lastTime = currentTime;

      const items = itemsRef.current;
      const domNodes = domNodesRef.current;
      const { x: mx, y: my, active: mouseActive } = mouseRef.current;

      // Physics parameters for STRONG, visible repulsion
      const REPULSION_RADIUS = 175; // Repulsion radius (~175px within 150-180px)
      const MAX_PUSH_FORCE = 110;   // Maximum physical scatter displacement in px
      const STIFFNESS = 0.16;       // Spring pull back to origin
      const DAMPING = 0.76;         // Spring friction damping

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const domEl = domNodes[i];
        if (!domEl) continue;

        // 1. Subtle idle floating animation
        const timeOffset = currentTime * item.idleSpeed + item.idlePhase;
        const idleX = Math.cos(timeOffset) * item.idleAmp;
        const idleY = Math.sin(timeOffset) * item.idleAmp;

        let targetX = item.homeX + idleX;
        let targetY = item.homeY + idleY;
        let targetRot = item.baseRot;
        let proximity = 0;

        // 2. Cursor-distance based repulsion calculation
        if (mouseActive && !prefersReducedMotion) {
          // Distance from cursor to doodle's anchor
          const dx = item.homeX - mx;
          const dy = item.homeY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < REPULSION_RADIUS) {
            // Direction vector pointing away from cursor
            const safeDist = Math.max(dist, 1);
            const nx = dx / safeDist;
            const ny = dy / safeDist;

            // Proximity: 1.0 directly under cursor, 0.0 at perimeter
            proximity = 1 - (dist / REPULSION_RADIUS);

            // Power falloff gives intense repulsion nearby and smooth decay
            const force = Math.pow(proximity, 1.25) * MAX_PUSH_FORCE;

            targetX = item.homeX + nx * force;
            targetY = item.homeY + ny * force;

            // Dynamic rotation kick while being scattered away
            const rotKick = (nx * 26) - (ny * 18);
            targetRot = item.baseRot + rotKick * proximity;
          }
        }

        if (prefersReducedMotion) {
          item.currX = item.homeX;
          item.currY = item.homeY;
          item.currRot = item.baseRot;
        } else {
          // 3. Smooth Spring Dynamics Integration
          const fx = (targetX - item.currX) * STIFFNESS;
          const fy = (targetY - item.currY) * STIFFNESS;
          const fRot = (targetRot - item.currRot) * (STIFFNESS * 1.2);

          item.vx = (item.vx + fx) * DAMPING;
          item.vy = (item.vy + fy) * DAMPING;
          item.vRot = (item.vRot + fRot) * DAMPING;

          item.currX += item.vx * dt;
          item.currY += item.vy * dt;
          item.currRot += item.vRot * dt;
        }

        // 4. Smooth GPU Transform
        domEl.style.transform = `translate3d(${item.currX}px, ${item.currY}px, 0) translate(-50%, -50%) rotate(${item.currRot.toFixed(2)}deg) scale(${item.scale})`;

        // Subtle opacity boost when repelled (0.28 at rest -> up to 0.66 when pushed)
        if (proximity > 0.05) {
          domEl.style.opacity = (0.28 + proximity * 0.38).toFixed(2);
        } else {
          domEl.style.opacity = '0.28';
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none select-none z-0 bg-[#F0F6FF] dark:bg-[#071426] transition-colors duration-300"
    >
      {/* Soft Blue & Light-Blue Educational Dot Grid Pattern (Theme Adaptive) */}
      <div className="absolute inset-0 subtle-snow-dots pointer-events-none opacity-60" />

      {/* Scattered Individual Interactive Doodle DOM Elements */}
      {doodleData.map((doodle) => {
        const SvgComponent = DOODLE_SVGS[doodle.svgIdx];
        return (
          <div
            id={doodle.id}
            key={doodle.id}
            className="absolute top-0 left-0 w-11 h-11 md:w-12 md:h-12 pointer-events-none will-change-transform text-[#3B82F6] dark:text-[#38BDF8] opacity-[0.28] dark:opacity-[0.22] transition-colors duration-300"
            style={{
              transform: `translate3d(${doodle.homeX}px, ${doodle.homeY}px, 0) translate(-50%, -50%) rotate(${doodle.baseRot}deg) scale(${doodle.scale})`
            }}
          >
            <SvgComponent className="w-full h-full" />
          </div>
        );
      })}
    </div>
  );
};
