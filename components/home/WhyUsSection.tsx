"use client";

import { memo, useRef, useEffect, useState, useCallback } from "react";

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function IconAward() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6" />
      <path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.12" />
    </svg>
  );
}

function IconGem() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M11 3L8 9l4 13 4-13-3-6" />
      <path d="M2 9h20" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

const FEATURES: Feature[] = [
  {
    id: "craftsmanship",
    icon: <IconAward />,
    title: "Exceptional Craftsmanship",
    description:
      "Every joint, seam, and finish is executed by artisans with decades of experience. No shortcuts — only standards that outlast trends.",
  },
  {
    id: "materials",
    icon: <IconGem />,
    title: "Premium Materials",
    description:
      "We source solid hardwoods, full-grain leathers, and heritage-woven textiles from suppliers who share our refusal to compromise.",
  },
  {
    id: "design",
    icon: <IconClock />,
    title: "Timeless Design",
    description:
      "Our pieces are drawn to endure — not to follow a season. Clean proportions and considered details that look better as decades pass.",
  },
  {
    id: "sustainable",
    icon: <IconLeaf />,
    title: "Sustainable Production",
    description:
      "Carbon-neutral workshops, FSC-certified timber, and repair programmes that keep pieces in homes rather than landfills.",
  },
];

function FurnitureScene() {
  return (
    <svg
      viewBox="0 0 480 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Luxury living room composition with sofa, side table, and pendant lamp"
    >
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="320"
        fontWeight="700"
        letterSpacing="-10"
        fill="#D4CAB8"
        opacity="0.18"
        fontFamily="Georgia, serif"
      >
        IV
      </text>

      {/* PENDANT LAMP */}
      <line x1="240" y1="0" x2="240" y2="82" stroke="#8B7A68" strokeWidth="1.5" />
      <path d="M205 82 L275 82 L258 130 L222 130 Z" fill="#D4C4A8" />
      <path d="M210 84 L270 84 L255 128 L225 128 Z" fill="#C8B89A" />
      <rect x="204" y="79" width="72" height="6" rx="3" fill="#BCA98A" />
      <ellipse cx="240" cy="118" rx="12" ry="6" fill="#F5EDD8" opacity="0.55" />
      <ellipse cx="240" cy="148" rx="55" ry="18" fill="#F5EDD8" opacity="0.18" />

      {/* WALL LINE */}
      <line x1="30" y1="265" x2="450" y2="265" stroke="#C4BAA8" strokeWidth="0.8" />

      {/* SOFA */}
      <rect x="58" y="286" width="9" height="62" rx="4.5" fill="#5C4E3D" />
      <rect x="320" y="286" width="9" height="62" rx="4.5" fill="#5C4E3D" />
      <rect x="88" y="296" width="8" height="54" rx="4" fill="#5C4E3D" />
      <rect x="294" y="296" width="8" height="54" rx="4" fill="#5C4E3D" />
      <rect x="50" y="278" width="288" height="22" rx="6" fill="#A8917A" />
      <rect x="54" y="244" width="87" height="38" rx="6" fill="#C8B49A" />
      <rect x="145" y="244" width="97" height="38" rx="6" fill="#D4C0A6" />
      <rect x="246" y="244" width="88" height="38" rx="6" fill="#C8B49A" />
      <rect x="141" y="244" width="4" height="38" fill="#B09070" />
      <rect x="242" y="244" width="4" height="38" fill="#B09070" />
      <rect x="58" y="246" width="80" height="8" rx="4" fill="#DDD0BA" opacity="0.45" />
      <rect x="149" y="246" width="90" height="8" rx="4" fill="#E0D3BE" opacity="0.45" />
      <rect x="250" y="246" width="80" height="8" rx="4" fill="#DDD0BA" opacity="0.45" />
      <rect x="50" y="178" width="288" height="74" rx="10" fill="#C0AA8C" />
      <rect x="54" y="182" width="280" height="66" rx="8" fill="#CDBDA0" />
      <line x1="194" y1="186" x2="194" y2="244" stroke="#B09878" strokeWidth="1" opacity="0.5" />
      <rect x="58" y="185" width="130" height="10" rx="5" fill="#DDD0BA" opacity="0.35" />
      <rect x="200" y="185" width="130" height="10" rx="5" fill="#DDD0BA" opacity="0.35" />
      <rect x="44" y="210" width="22" height="68" rx="9" fill="#B09878" />
      <rect x="322" y="210" width="22" height="68" rx="9" fill="#B09878" />
      <rect x="42" y="203" width="26" height="14" rx="7" fill="#BEA888" />
      <rect x="320" y="203" width="26" height="14" rx="7" fill="#BEA888" />
      <rect x="72" y="222" width="46" height="30" rx="8" fill="#8B9E7A" opacity="0.75" />
      <rect x="75" y="225" width="40" height="24" rx="6" fill="#9CAF8A" opacity="0.65" />
      <rect x="272" y="226" width="38" height="26" rx="7" fill="#C4AA85" opacity="0.8" />
      <rect x="275" y="229" width="32" height="20" rx="5" fill="#D4BC98" opacity="0.7" />

      {/* SIDE TABLE */}
      <ellipse cx="388" cy="270" rx="38" ry="10" fill="#C8B49A" />
      <ellipse cx="388" cy="267" rx="36" ry="9" fill="#D8C8AA" />
      <rect x="384" y="275" width="8" height="58" rx="4" fill="#8B7A68" />
      <ellipse cx="388" cy="334" rx="22" ry="6" fill="#7A6655" />

      {/* ITEMS ON TABLE */}
      <path d="M378 260 Q376 248 380 242 L396 242 Q400 248 398 260 Z" fill="#8B9E7A" opacity="0.8" />
      <rect x="381" y="258" width="14" height="4" rx="2" fill="#7A8E6A" opacity="0.9" />
      <line x1="385" y1="242" x2="382" y2="228" stroke="#6B8A5A" strokeWidth="1.2" />
      <line x1="388" y1="242" x2="388" y2="222" stroke="#6B8A5A" strokeWidth="1.2" />
      <line x1="392" y1="242" x2="395" y2="226" stroke="#6B8A5A" strokeWidth="1.2" />
      <circle cx="382" cy="226" r="4" fill="#C4AA85" opacity="0.9" />
      <circle cx="388" cy="220" r="5" fill="#D4BC98" opacity="0.85" />
      <circle cx="395" cy="224" r="4" fill="#C4AA85" opacity="0.9" />

      {/* FLOOR RUG */}
      <ellipse cx="192" cy="350" rx="155" ry="18" fill="none" stroke="#C4BAA8" strokeWidth="2" strokeDasharray="8 5" />
      <ellipse cx="192" cy="350" rx="132" ry="13" fill="none" stroke="#D4CAB8" strokeWidth="0.8" strokeDasharray="5 7" opacity="0.6" />

      {/* FLOOR SHADOW */}
      <ellipse cx="192" cy="352" rx="175" ry="10" fill="#C0B4A0" opacity="0.22" />

      {/* ACCENT PLANT */}
      <ellipse cx="68" cy="340" rx="18" ry="5" fill="#8B7A68" />
      <path d="M62 340 Q58 320 64 308 Q68 322 68 340" fill="#8B9E7A" opacity="0.85" />
      <path d="M74 340 Q80 320 74 306 Q70 320 68 340" fill="#9CAF8A" opacity="0.8" />
      <path d="M68 336 Q62 318 66 304 Q70 318 68 336" fill="#7A8E6A" opacity="0.7" />
    </svg>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="group relative flex gap-5 bg-white rounded-2xl p-6 border border-[#EAE4DA] transition-all duration-300 ease-out hover:border-[#C4AA85] hover:shadow-[0_4px_24px_rgba(139,115,85,0.08)]">
      <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-[#EAE4DA] group-hover:bg-[#C4AA85] transition-colors duration-300" aria-hidden="true" />
      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-[#F5F0E8] text-[#8B7355] group-hover:bg-[#EDE4D0] group-hover:text-[#6B5535] transition-all duration-300">
        {feature.icon}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-medium tracking-wide text-[#1C1917]">
          {feature.title}
        </h3>
        <p className="text-xs leading-relaxed text-[#7C6F64] font-light">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F7F5F2] px-6 sm:px-10 md:px-16 lg:px-24 py-24 md:py-32"
      aria-labelledby="why-choose-heading"
    >
      <div
        className={`mb-16 md:mb-20 transition-all duration-700 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <p className="text-[10px] tracking-[0.32em] uppercase text-[#C4AA85] mb-4">
          Why Choose Us
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 md:gap-16">
          <h2
            id="why-choose-heading"
            className="text-4xl md:text-5xl font-extralight text-[#1C1917] leading-[1.15] tracking-tight max-w-md"
          >
            Furniture made to
            <br />
            <em className="not-italic text-[#8B7355] font-light">
              outlast the moment.
            </em>
          </h2>
          <p className="text-sm text-[#7C6F64] leading-relaxed font-light max-w-xs md:text-right">
            Four principles guide everything we make — from the first sketch
            to the day your piece is delivered and beyond.
          </p>
        </div>
        <div className="mt-10 h-px bg-[#E5DDD0]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        <div
          className={`relative transition-all duration-700 delay-150 ease-out
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="relative bg-[#EDE9E2] rounded-3xl overflow-hidden aspect-[4/3.6] flex items-end justify-center">
            <div className="absolute inset-0 opacity-[0.04] bg-grid-pattern" aria-hidden="true" />
            <div className="relative w-full h-full p-6 pt-8">
              <FurnitureScene />
            </div>
            <div className="absolute bottom-5 left-5 flex items-center gap-2">
              <div className="w-6 h-px bg-[#C4AA85]" />
              <span className="text-[9px] tracking-[0.28em] uppercase text-[#A8997D]">
                Atelier Collection
              </span>
            </div>
          </div>
          <div className="absolute -bottom-5 -right-2 md:right-4 bg-[#1C1917] text-[#E8DDD0] rounded-2xl px-5 py-4 shadow-lg">
            <p className="text-2xl font-extralight tracking-tight">15+</p>
            <p className="text-[9px] tracking-[0.22em] uppercase text-[#6B5D4F] mt-0.5">
              Years crafting
            </p>
          </div>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700 delay-300 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
          <div className="sm:col-span-2 mt-2 flex items-center justify-between border-t border-[#E5DDD0] pt-6">
            <p className="text-xs text-[#A89880] font-light">
              Every piece comes with a 25-year structural warranty.
            </p>
            <a href="#" className="group flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#8B7355] hover:text-[#1C1917] transition-colors duration-200">
              Our story
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M1 7h12M7.5 1.5L13 7l-5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(WhyChooseUs);
