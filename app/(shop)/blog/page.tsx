import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choosing the Perfect Sofa for Modern Living | Journal",
  description:
    "A sofa is the anchor of any living room. Here is how to choose one that balances comfort, proportion, and lasting craftsmanship.",
};

const sections = [
  {
    heading: "Start With How You Sit, Not How It Looks",
    paragraphs: [
      "Before considering fabric or silhouette, think about posture. Do you sink in after a long day, or sit upright while reading? A deep seat with soft cushions invites lounging, while a firmer, shallower seat suits formal entertaining spaces. Measuring this honestly prevents the common mistake of buying a beautiful sofa that nobody wants to sit on.",
      "Seat height matters just as much. Lower profiles feel relaxed and contemporary, while a slightly higher seat is easier to rise from and reads as more traditional. Test both if you can, since photographs rarely communicate how a frame actually supports the body.",
    ],
  },
  {
    heading: "Proportion Is the Real Luxury",
    paragraphs: [
      "A sofa that fits its room with breathing space on either side will always look more expensive than one that crowds the walls, regardless of price. As a general rule, leave at least 30 to 45 centimetres between the sofa and any opposite seating, and avoid pushing arms flush against doorways or walkways.",
      "In smaller rooms, a track-arm or slim roll-arm silhouette preserves visual space, while generous rooms can support a deep lawson or Chesterfield-style arm without feeling heavy.",
    ],
  },
  {
    heading: "Frame and Cushion Construction",
    paragraphs: [
      "Hidden structure is where true quality lives. Kiln-dried hardwood frames, joined with dowels and corner blocks rather than staples, resist sagging for decades. Ask about suspension, webbed straps are common and reliable, while eight-way hand-tied springs offer superior longevity in premium pieces.",
      "For cushions, a high-density foam core wrapped in down or fibre blend gives you the plumpness of feather with the support to hold its shape. Pure down is luxurious but requires regular plumping; a blended fill suits households that want low maintenance without sacrificing softness.",
    ],
  },
  {
    heading: "Fabric and Upholstery Choices",
    paragraphs: [
      "Performance fabrics have closed the gap with natural textiles considerably. A tightly woven linen blend or a brushed velvet with a high rub count can handle daily family life while still photographing beautifully. Leather, particularly full-grain or aniline finishes, develops a patina that many owners come to prefer over time.",
      "Whatever you choose, request a swatch and live with it in your actual lighting for a few days. Fabric that looks warm under store lighting can read cool or grey under daylight, and vice versa.",
    ],
  },
  {
    heading: "Color as a Long-Term Decision",
    paragraphs: [
      "A sofa is rarely replaced as often as cushions or throws, so neutral tones, oatmeal, stone, charcoal, deep walnut leather, tend to outlast trends and let accent pieces carry seasonal color instead. If you do want a statement hue, consider it on a smaller secondary seat rather than the primary sofa.",
    ],
  },
];

function SofaIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="400" height="300" fill="#F3EDE3" />
      <g className="text-[#A8763E]" opacity="0.18">
        <ellipse cx="200" cy="240" rx="150" ry="14" fill="currentColor" />
      </g>
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#2B2622]"
      >
        <path d="M70 140 C70 110 95 95 130 95 H270 C305 95 330 110 330 140 V190 H70 V140 Z" />
        <path d="M70 190 V210 H330 V190" />
        <path d="M155 150 V210" />
        <path d="M245 150 V210" />
        <path d="M70 140 C50 140 40 155 40 175 V215 H80 V190" />
        <path d="M330 140 C350 140 360 155 360 175 V215 H320 V190" />
        <path d="M85 215 L80 245" />
        <path d="M320 215 L325 245" />
        <path d="M150 210 L148 240" />
        <path d="M250 210 L252 240" />
        <path d="M130 95 V150" />
        <path d="M200 95 V150" />
        <path d="M270 95 V150" />
      </g>
    </svg>
  );
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2B2622]">
      <article>
        {/* Header */}
        <div className="mx-auto max-w-3xl px-6 pt-20 pb-10 sm:px-10 lg:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#A8763E]">
            Buying Guide
          </p>
          <h1 className="mt-5 font-serif text-3xl leading-[1.15] tracking-tight text-[#211D19] sm:text-4xl lg:text-5xl">
            Choosing the Perfect Sofa for Modern Living
          </h1>

          <div className="mt-6 flex items-center gap-3 text-sm text-[#8A8071]">
            <span>March 3, 2026</span>
            <span aria-hidden="true">&middot;</span>
            <span>6 min read</span>
          </div>
        </div>

        {/* Hero illustration */}
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-6">
          <div className="overflow-hidden border border-[#E4DCCC] bg-[#F3EDE3]">
            <SofaIllustration className="aspect-[16/8] w-full" />
          </div>
        </div>

        {/* Article content */}
        <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10 lg:px-6">
          <p className="text-lg leading-relaxed text-[#3D372F] sm:text-xl">
            Few pieces of furniture carry as much daily weight, literally and
            visually, as the living room sofa. It is where mornings begin and
            evenings end, where guests are welcomed and where a home quietly
            states its character. Choosing one well is less about
            trend-chasing and more about understanding how you actually live.
          </p>

          <div className="mt-12 space-y-12">
            {sections.map((section, index) => (
              <section key={index}>
                <h2 className="font-serif text-2xl leading-snug text-[#211D19] sm:text-[1.7rem]">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-base leading-[1.85] text-[#4A453D]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Conclusion */}
          <div className="mt-14 border-t border-[#E4DCCC] pt-10">
            <h2 className="font-serif text-2xl leading-snug text-[#211D19] sm:text-[1.7rem]">
              In Closing
            </h2>
            <p className="mt-4 text-base leading-[1.85] text-[#4A453D]">
              The perfect sofa is rarely the most photographed one online. It
              is the piece whose proportions respect your room, whose frame
              will outlast a decade of daily use, and whose comfort you stop
              noticing because it simply feels right. Invest in what is
              hidden as much as what is seen, and the rest tends to follow.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}