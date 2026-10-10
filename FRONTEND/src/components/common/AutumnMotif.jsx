import React from 'react';

// Soft Blue Educational Crystal / Star motif
export const LavenderPetal = ({ className = "w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]", fill = "currentColor" }) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C12 2 14.5 7.5 17 9.5C19.5 11.5 22 12 22 12C22 12 19.5 12.5 17 14.5C14.5 16.5 12 22 12 22C12 22 9.5 16.5 7 14.5C4.5 12.5 2 12 2 12C2 12 4.5 11.5 7 9.5C9.5 7.5 12 2 12 2Z"
      opacity="0.95"
    />
  </svg>
);

// Backward compatibility alias
export const AutumnLeaf = LavenderPetal;

// Sparkling Cyan Crystal motif
export const Snowflake = ({ className = "w-4 h-4 text-[#60A5FA] dark:text-[#22D3EE]" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

// AI Sparkle in primary blue & cyan
export const AISparkle = ({ className = "w-4 h-4 text-[#2563EB] dark:text-[#38BDF8]" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L14.39 8.26L20.65 10.65L14.39 13.04L12 19.3L9.61 13.04L3.35 10.65L9.61 8.26L12 2Z" />
  </svg>
);

// Organic rounded backdrop shape
export const OrganicShape = ({ className = "w-32 h-32 text-[#EFF6FF] dark:text-[#0B1F3A]" }) => (
  <svg viewBox="0 0 200 200" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,87.6,-1.4C85.2,13.5,77.8,27,69.5,39.3C61.2,51.6,52,62.7,40.1,69.6C28.2,76.5,14.1,79.2,-0.2,79.5C-14.5,79.8,-29,77.7,-41.8,71.2C-54.6,64.7,-65.7,53.8,-73.4,40.8C-81.1,27.8,-85.4,13.9,-84.9,-0.3C-84.4,-14.5,-79.1,-29,-70.6,-41.3C-62.1,-53.6,-50.4,-63.7,-37.2,-71.4C-24,-79.1,-12,-84.4,1.8,-87.5C15.6,-90.6,30.6,-83.6,44.7,-76.4Z"
      transform="translate(100 100)"
    />
  </svg>
);
