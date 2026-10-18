import React from "react";

/**
 * Ultra-Luxury Architectural "MY" Monogram Logo for Mitesh Yadav.
 * Features symmetrical architectural pillars, 45° chamfered roof cuts,
 * and an integrated central Y chevron with seamless single-path geometry.
 */
export default function MonogramLogo({
  className = "brand-logo-svg",
  width = 42,
  height = 29,
  fill = "currentColor",
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 88 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mitesh Yadav MY Monogram Logo"
    >
      <defs>
        <linearGradient id="my-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d0d0d" />
          <stop offset="55%" stopColor="#1e1e1e" />
          <stop offset="100%" stopColor="#363636" />
        </linearGradient>
      </defs>
      <path
        fill={fill === "currentColor" ? "url(#my-logo-gradient)" : fill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 6 60 L 6 14 L 20 0 L 34 0 L 44 20 L 54 0 L 68 0 L 82 14 L 82 60 L 68 60 L 68 22 L 51 36 L 51 60 L 37 60 L 37 36 L 20 22 L 20 60 Z"
      />
    </svg>
  );
}
