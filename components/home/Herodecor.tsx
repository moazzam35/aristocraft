import type { SVGProps } from "react";

type DecoProps = SVGProps<SVGSVGElement>;

export function ArchwayOutline(props: DecoProps) {
  return (
    <svg viewBox="0 0 200 340" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M20 340V180C20 100 40 20 100 20S180 100 180 180v160" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M10 340h180" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function SofaContour(props: DecoProps) {
  return (
    <svg viewBox="0 0 600 280" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M40 260V140c0-30 10-50 40-50h440c30 0 40 20 40 50v120" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M40 260H20M560 260h20" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M100 90V40M500 90V40" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M80 40h440" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="80" y="90" width="440" height="50" rx="8" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function LampOutlineLarge(props: DecoProps) {
  return (
    <svg viewBox="0 0 128 420" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M64 400V280M24 280h80l-8-60H32l-8 60z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M40 220L64 100l24 120" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="64" cy="80" r="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M30 400h68" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function CornerBracket(props: DecoProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 60V4h56" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M4 60L24 40" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="4" cy="60" r="3" fill="currentColor" />
    </svg>
  );
}

export function SweepArc(props: DecoProps) {
  return (
    <svg viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 80C360 280 1080 280 1440 80" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M0 120C360 320 1080 320 1440 120" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
    </svg>
  );
}

export function DiningChair(props: DecoProps) {
  return (
    <svg viewBox="0 0 160 260" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M30 30h100v90H30z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="30" y1="55" x2="130" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="30" y1="80" x2="130" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M22 120h116l-8 30H30l-8-30z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="36" y1="150" x2="28" y2="250" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="124" y1="150" x2="132" y2="250" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="44" y1="210" x2="116" y2="210" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

export function SideTable(props: DecoProps) {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="100" cy="40" rx="80" ry="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="30" y1="48" x2="40" y2="190" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="170" y1="48" x2="160" y2="190" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="55" y1="110" x2="145" y2="110" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <ellipse cx="100" cy="196" rx="36" ry="6" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <rect x="62" y="30" width="76" height="18" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.25" fill="none" />
    </svg>
  );
}

export function Cabinet(props: DecoProps) {
  return (
    <svg viewBox="0 0 200 340" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="20" y="20" width="160" height="300" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="100" y1="20" x2="100" y2="320" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="20" y1="170" x2="180" y2="170" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="30" y="30" width="65" height="130" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="105" y="30" width="65" height="130" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="30" y="180" width="65" height="130" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="105" y="180" width="65" height="130" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="60" cy="180" r="2.5" fill="currentColor" />
      <circle cx="140" cy="180" r="2.5" fill="currentColor" />
      <line x1="100" y1="178" x2="100" y2="182" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function PendantLight(props: DecoProps) {
  return (
    <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <line x1="60" y1="0" x2="60" y2="50" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M30 50h60l-10 60H40l-10-60z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M40 110c0 20 40 20 40 0" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M45 115a15 15 0 0030 0" stroke="currentColor" strokeWidth="0.8" opacity="0.4" fill="none" />
    </svg>
  );
}

export function Armchair(props: DecoProps) {
  return (
    <svg viewBox="0 0 260 240" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M50 100V50c0-20 16-30 36-30h88c20 0 36 10 36 30v50" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" />
      <path d="M30 100h200l16 30c0 20-14 30-30 30H44c-16 0-30-10-30-30l16-30z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.18" />
      <line x1="70" y1="70" x2="190" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <line x1="60" y1="160" x2="50" y2="230" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="200" y1="160" x2="210" y2="230" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="100" y1="160" x2="96" y2="230" stroke="currentColor" strokeWidth="1.2" opacity="0.5" fill="none" />
      <line x1="160" y1="160" x2="164" y2="230" stroke="currentColor" strokeWidth="1.2" opacity="0.5" fill="none" />
    </svg>
  );
}
