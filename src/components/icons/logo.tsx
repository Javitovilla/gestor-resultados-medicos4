import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="150"
      height="37.5"
      aria-label="MediResults Manager Logo"
      {...props}
    >
      <rect width="200" height="50" fill="transparent" />
      <path d="M10 10 H30 L20 30 Z M25 35 A5 5 0 1 1 25 45 A5 5 0 1 1 25 35" fill="hsl(var(--primary))" />
      <text
        x="40"
        y="35"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="28"
        fill="hsl(var(--foreground))"
        className="font-headline"
      >
        MediResults
      </text>
       <path d="M10 10 L20 10 L15 20 Z" fill="hsl(var(--accent))" transform="translate(5,5) scale(0.5)" />
    </svg>
  );
}
