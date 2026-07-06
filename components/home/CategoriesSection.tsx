'use client'

import { memo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const STATIC_CATEGORIES = [
  { id: "sofa", name: "Sofas", tagline: "Tailored seating", image: "/images/sofa-hero.jpg", accent: "#C9A882" },
  { id: "bed", name: "Beds", tagline: "Restful sanctuaries", image: "/images/bed-hero.jpg", accent: "#B8A99A" },
  { id: "dining", name: "Dining Tables", tagline: "Gathered moments", image: "/images/dining-table-hero.jpg", accent: "#A89070" },
  { id: "chair", name: "Chairs", tagline: "Form meets function", image: "/images/chair-hero.jpg", accent: "#C4B5A5" },
  { id: "kitchen", name: "Kitchen", tagline: "Considered order", image: "/images/kitchen-hero.jpg", accent: "#B5A090" },
  { id: "lighting", name: "Lighting", tagline: "Ambient artistry", image: "/images/light-hero.jpg", accent: "#C8BC9A" },
];

function CategoryCard({ category }: { category: { id: string; name: string; tagline: string; count: string; image: string; accent: string } }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const handleExplore = useCallback(() => {
    router.push(`/shop?category=${category.id}`);
  }, [router, category.id]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl overflow-hidden cursor-pointer bg-[#fafafa] border border-[#efe9e1] flex flex-col transition-all duration-350"
      style={{
        boxShadow: hovered
          ? "0 16px 48px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)"
          : "0 2px 12px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Image */}
      <div className="relative w-full h-[200px] overflow-hidden flex-shrink-0">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-550"
          style={{
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-350"
          style={{
            background: hovered
              ? "linear-gradient(to top, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.04) 55%)"
              : "linear-gradient(to top, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 50%)",
          }}
        />
      </div>

      {/* Card body */}
      <div className="p-4 pb-[18px] bg-white border-t border-[#f0ebe4] flex flex-col gap-[14px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="m-0 text-[16px] font-semibold text-[#1a1614] tracking-tight leading-tight">
              {category.name}
            </p>
            <p className="mt-[3px] text-xs font-normal text-[#9a8c80] tracking-wide uppercase">
              {category.tagline}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#004B47] tracking-wider">
              {category.count}
            </p>
          </div>
        </div>

        <button
          onClick={handleExplore}
          className="w-full py-[10px] text-white border-none rounded-md text-[11px] font-medium tracking-widest uppercase flex items-center justify-center gap-[7px] transition-all duration-250"
          style={{
            background: hovered ? "#005f59" : "#004b47",
          }}
        >
          Explore {category.name}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function LuxuryCategoriesSection() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const countMap: Record<string, number> = {};
          data.categories.forEach((cat: { slug: string; productCount: number }) => {
            countMap[cat.slug] = cat.productCount;
          });
          setCounts(countMap);
        }
      })
      .catch(() => {});
  }, []);

  const categories = STATIC_CATEGORIES.map((cat) => ({
    ...cat,
    count: counts[cat.id] !== undefined ? `${counts[cat.id]} ${counts[cat.id] === 1 ? "piece" : "pieces"}` : "Loading…",
  }));

  return (
    <section className="bg-white py-20 md:py-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
        .luxury-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .luxury-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .luxury-grid { grid-template-columns: 1fr; }
        }
        .luxury-section-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 32px;
        }
        @media (max-width: 640px) {
          .luxury-section-inner { padding: 0 20px; }
        }
      `}</style>

      <div className="luxury-section-inner">
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
          <div>
            <p className="m-0 mb-[10px] text-[11px] font-medium tracking-[0.18em] uppercase text-[#b09880]">
              Our Collections
            </p>
            <h2 className="m-0 font-light text-[#1a1614] leading-tight tracking-tight"
                style={{ fontSize: "clamp(36px, 5vw, 52px)" }}>
              Shop by Category
            </h2>
          </div>

          <div className="flex items-center gap-[14px] pb-[6px]">
            <div className="w-10 h-px bg-[#d4c5b5]" />
            <button
              onClick={() => router.push("/shop")}
              className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#9a8c80] bg-none border-none border-b border-[#d4c5b5] cursor-pointer pb-px"
            >
              View All
            </button>
          </div>
        </div>

        <div className="luxury-grid">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(LuxuryCategoriesSection);
