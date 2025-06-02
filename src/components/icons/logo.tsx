import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="50"
      height="50"
      aria-label="MediResults Manager Logo"
      {...props}
    >
      <rect width="64" height="64" fill="transparent" />
      {/* Outer circle (optional, for a more "icon" feel) */}
      {/* <circle cx="32" cy="32" r="30" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" /> */}
      
      {/* Medical Cross */}
      <g transform="translate(2 2)"> {/* Slight padding if needed */}
        {/* Vertical bar of the cross */}
        <rect x="27" y="12" width="6" height="36" fill="hsl(var(--primary))" rx="1.5" ry="1.5" />
        {/* Horizontal bar of the cross */}
        <rect x="12" y="27" width="36" height="6" fill="hsl(var(--primary))" rx="1.5" ry="1.5" />
      </g>
      {/* You can add text next to it if needed, like in the original, but the request was for the logo itself */}
    </svg>
  );
}
