import React from "react";

/**
 * Custom geometric "MY" monogram logo for Mitesh Yadav.
 * Features bold architectural stems, 45° angular cuts, and a connected geometric ligature.
 */
export default function MonogramLogo({
  className = "brand-logo-svg",
  width = 48,
  height = 28,
  fill = "#111111",
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 96 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mitesh Yadav MY Monogram Logo"
    >
      <path
        fill={fill}
        fillRule="nonzero"
        d="M0,9 L9,0 L13,0 L13,56 L0,56 Z M12.5,0 L26,0 L41.5,38 L28.5,38 Z M41.5,38 L28.5,38 L43.5,0 L57,0 Z M43.5,0 L57,0 L57,56 L43.5,56 Z M56.5,22 L71.5,8 L71.5,20.5 L56.5,34.5 Z M82,0 L95.5,9 L75,30.5 L62.5,30.5 Z M64.5,23.5 L78,23.5 L78,47 L69,56 L64.5,56 Z"
      />
    </svg>
  );
}
