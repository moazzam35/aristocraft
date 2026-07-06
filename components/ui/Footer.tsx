"use client";

import { memo, useState, useCallback, type ReactNode } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const CONTACT_ITEMS: { icon: ReactNode; value: string; href?: string }[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.5}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    value: "London, UK",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    value: "hello@aristocraft.com",
    href: "mailto:hello@aristocraft.com",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.5}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    value: "+44 20 7946 0958",
    href: "tel:+442079460958",
  },
];

function IconArrowRight({ size }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" height={size ?? 16} width={size ?? 16} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconInstagram({ size }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" height={size ?? 16} width={size ?? 16} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconFacebook({ size }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" height={size ?? 16} width={size ?? 16} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconPinterest({ size }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" height={size ?? 16} width={size ?? 16} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12.5a5.5 5.5 0 1 1 5.5 5.5c-1.2 0-2.3-.4-3.2-1" />
      <path d="M10 22c2-7 0-11 3-13" />
    </svg>
  );
}

/* ─── Chaise Longue Illustration ─────────────────────────── */

function ChaiseLongueIllustration() {
  return (
    <svg
      viewBox="0 0 200 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[180px]"
      role="img"
      aria-label="Chaise longue silhouette"
    >
      {/* Shadow on floor */}
      <ellipse cx="100" cy="86" rx="80" ry="4" fill="#0D0B09" opacity="0.35" />

      {/* Rear leg */}
      <rect x="14" y="62" width="5" height="20" rx="2.5" fill="#6B5D4F" />
      {/* Front leg */}
      <rect x="155" y="65" width="5" height="17" rx="2.5" fill="#6B5D4F" />
      {/* Small front leg */}
      <rect x="126" y="67" width="4" height="15" rx="2" fill="#6B5D4F" />

      {/* Chaise body — long reclined seat */}
      <path
        d="M12 62 Q12 54 20 52 L158 52 Q165 52 165 60 L165 65 Q165 70 158 70 L20 70 Q12 70 12 62 Z"
        fill="#3D3027"
      />
      {/* Seat surface highlight */}
      <path
        d="M20 52 L158 52 Q164 52 164 58 L164 60 Q130 56 20 56 Q14 56 14 60 L14 62 Q14 54 20 52 Z"
        fill="#4A3B2E"
      />

      {/* Backrest — angled upright at rear */}
      <path
        d="M12 62 Q11 50 16 36 Q18 30 24 30 L32 30 Q36 30 36 34 L36 52 Q36 52 20 52 Q12 52 12 62 Z"
        fill="#3D3027"
      />
      {/* Backrest face */}
      <path
        d="M16 36 Q18 30 24 30 L32 30 Q36 30 36 34 L36 52 L20 52 Q13 52 13 56 Q12 50 16 36 Z"
        fill="#4A3B2E"
      />

      {/* Rolled armrest at head */}
      <ellipse cx="24" cy="30" rx="9" ry="6" fill="#5A4535" />
      <ellipse cx="24" cy="29" rx="7" ry="4.5" fill="#6B5545" />

      {/* Cushion seam lines on seat */}
      <line x1="70" y1="52" x2="70" y2="70" stroke="#2E231B" strokeWidth="0.8" opacity="0.6" />
      <line x1="110" y1="52" x2="110" y2="70" stroke="#2E231B" strokeWidth="0.8" opacity="0.6" />

      {/* Leg detail — tapered feet */}
      <rect x="13.5" y="78" width="6" height="4" rx="2" fill="#4A3B2E" />
      <rect x="154.5" y="79" width="6" height="3" rx="1.5" fill="#4A3B2E" />

      {/* Throw pillow */}
      <rect x="38" y="45" width="20" height="14" rx="4" fill="#C4AA85" opacity="0.7" />
      <rect x="40" y="47" width="16" height="10" rx="3" fill="#D4BC98" opacity="0.6" />
    </svg>
  );
}

/* ─── Main Footer Component ──────────────────────────────── */

const Footer = memo(function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#1A1714] text-[#E8DDD0]">

      {/* ── Main Footer Body ──────────────────────────────── */}
      <div className="px-8 md:px-16 pt-16 pb-12">

        {/* Top: Brand block + columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Wordmark */}
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#C4AA85] mb-2.5">
                Est. 2019
              </p>
              <p className="text-2xl font-extralight tracking-[0.12em] text-[#E8DDD0]">
                Aristocraft
              </p>
              <p className="mt-2 text-xs text-[#6B5D4F] leading-relaxed font-light max-w-[220px]">
                Crafted for the distinguished.
                Premium furniture, delivered nationwide.
              </p>
            </div>

            {/* Illustration */}
            <div className="opacity-60">
              <ChaiseLongueIllustration />
            </div>
          </div>

          {/* Spacer on md */}
          <div className="hidden md:block md:col-span-1" />

          {/* Navigate Column */}
          <div className="md:col-span-2">
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#9B8B7E] mb-5">
              Navigate
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-[#C8B8A2] hover:text-[#E8DDD0] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3">
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#9B8B7E] mb-5">
              Contact
            </p>
            <ul className="space-y-3">
              {CONTACT_ITEMS.map((item, i) => (
                <li key={i}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-2.5 text-sm font-light text-[#C8B8A2] hover:text-[#E8DDD0] transition-colors duration-200 group"
                    >
                      <span className="text-[#6B5D4F] group-hover:text-[#C4AA85] transition-colors duration-200 flex-shrink-0">
                        {item.icon}
                      </span>
                      {item.value}
                    </a>
                  ) : (
                    <span className="flex items-center gap-2.5 text-sm font-light text-[#C8B8A2]">
                      <span className="text-[#6B5D4F] flex-shrink-0">
                        {item.icon}
                      </span>
                      {item.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-2">
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#9B8B7E] mb-5">
              Atelier Notes
            </p>
            <p className="text-xs font-light text-[#6B5D4F] leading-relaxed mb-5">
              Quiet dispatches on craft, new pieces, and seasonal collections.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 py-3">
                <span className="text-[#C4AA85]">
                  <IconArrowRight size={12} />
                </span>
                <p className="text-xs text-[#A89880] font-light">
                  You're on the list.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  aria-label="Email address for newsletter"
                  className="w-full bg-transparent border border-[#2E2720] hover:border-[#3D3027] focus:border-[#6B5D4F] text-[#E8DDD0] placeholder-[#3D3027] text-xs px-3.5 py-3 rounded-lg outline-none transition-colors duration-200 font-light"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-between gap-2 text-[9px] tracking-[0.2em] uppercase text-[#C4AA85] border border-[#2E2720] hover:border-[#C4AA85] hover:bg-[#C4AA85]/5 px-3.5 py-3 rounded-lg transition-all duration-200 group"
                >
                  <span>Subscribe</span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-flex">
                    <IconArrowRight size={11} />
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Hairline divider */}
        <div className="mt-14 border-t border-[#211D19]" />
      </div>

      {/* ── Bottom Bar ────────────────────────────────────── */}
      <div className="px-8 md:px-16 pb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

          {/* Copyright + legal */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="text-[10px] text-[#7B6C60] font-light">
              © {new Date().getFullYear()} Aristocraft. All rights reserved.
            </p>
            <span className="hidden sm:block w-px h-3 bg-[#2E2720]" />
            <Link
              href="/privacypolicy"
              className="text-[10px] text-[#7B6C60] hover:text-[#C8B8A2] transition-colors duration-200 font-light"
            >
              Privacy Policy
            </Link>
            <span className="hidden sm:block w-px h-3 bg-[#2E2720]" />
            <Link
              href="/terms&conditions"
              className="text-[10px] text-[#7B6C60] hover:text-[#C8B8A2] transition-colors duration-200 font-light"
            >
              Terms &amp; Conditions
            </Link>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <SocialLink
              href="https://instagram.com"
              label="Follow on Instagram"
              icon={<IconInstagram size={14} />}
            />
            <SocialLink
              href="https://facebook.com"
              label="Follow on Facebook"
              icon={<IconFacebook size={14} />}
            />
            <SocialLink
              href="https://pinterest.com"
              label="Follow on Pinterest"
              icon={<IconPinterest size={14} />}
            />
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;

/* ─── Social Link ─────────────────────────────────────────── */

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-[#3D3027] hover:text-[#C4AA85] transition-colors duration-200"
    >
      {icon}
    </a>
  );
}