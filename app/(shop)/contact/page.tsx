"use client";

import { useState, useRef } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#1C1917] font-sans">
      {/* ─── NAV ─────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-7 border-b border-[#E5E0D8]">
        <span className="tracking-[0.25em] text-xs uppercase font-medium text-[#1C1917]">
          Aristocraft
        </span>
        <div className="hidden md:flex gap-10 text-xs tracking-widest uppercase text-[#7C6F64]">
          <a href="#" className="hover:text-[#1C1917] transition-colors">Collections</a>
          <a href="#" className="hover:text-[#1C1917] transition-colors">Rooms</a>
          <a href="#" className="hover:text-[#1C1917] transition-colors">About</a>
          <a href="#" className="text-[#1C1917] border-b border-[#1C1917] pb-0.5">Contact</a>
        </div>
      </nav>

      {/* ─── PAGE HEADING ─────────────────────────────────── */}
      <section className="px-8 md:px-16 pt-16 pb-12">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#A8997D] mb-4">
          Get in touch
        </p>
        <h1 className="text-4xl md:text-5xl font-light text-[#1C1917] leading-tight tracking-tight max-w-lg">
          Let's craft your<br />
          <em className="not-italic font-extralight text-[#8B7355]">perfect space.</em>
        </h1>
      </section>

      {/* ─── TWO-COLUMN: ILLUSTRATION + FORM ─────────────── */}
      <section className="px-8 md:px-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* LEFT: Furniture Illustration */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="rounded-3xl bg-[#EDE9E2] p-10 flex items-center justify-center min-h-[480px]">
              <FurnitureIllustration />
            </div>
            <div className="space-y-5 pl-1">
              <ContactDetail
                label="Showroom"
                value="Bhawalnagar, Punjab, Pakistan"
              />
              <ContactDetail
                label="Enquiries"
                value="moazzampasha356@gmail.com"
              />
              <ContactDetail
                label="Phone"
                value="03012345678"
              />
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-10 md:p-12 shadow-sm border border-[#E8E2D8]">
              {submitted ? (
                <SuccessState name={formState.name} />
              ) : (
                <>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#A8997D] mb-2">
                    Send a message
                  </p>
                  <h2 className="text-2xl font-light text-[#1C1917] mb-1">
                    We'd love to hear from you
                  </h2>
                  <p className="text-sm text-[#7C6F64] mb-10 leading-relaxed">
                    Whether you're furnishing a residence or exploring a bespoke
                    commission, our team responds within one business day.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        label="Full Name"
                        name="name"
                        type="text"
                        placeholder="Alexandre Dupont"
                        value={formState.name}
                        onChange={handleChange}
                        focused={focused}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        required
                      />
                      <FormField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="a.dupont@email.com"
                        value={formState.email}
                        onChange={handleChange}
                        focused={focused}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        required
                      />
                    </div>

                    <FormField
                      label="Subject"
                      name="subject"
                      type="text"
                      placeholder="Bespoke dining room commission"
                      value={formState.subject}
                      onChange={handleChange}
                      focused={focused}
                      onFocus={() => setFocused("subject")}
                      onBlur={() => setFocused(null)}
                    />

                    <div className="space-y-1.5">
                      <label
                        htmlFor="message"
                        className="block text-[10px] tracking-[0.18em] uppercase text-[#7C6F64] font-medium"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell us about your space, vision, or any questions you have…"
                        value={formState.message}
                        onChange={handleChange}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        className={`w-full resize-none px-5 py-4 rounded-xl text-sm text-[#1C1917] placeholder-[#C4BAA8] bg-[#FAFAF8] border transition-all duration-200 outline-none leading-relaxed ${
                          focused === "message"
                            ? "border-[#8B7355] shadow-[0_0_0_3px_rgba(139,115,85,0.12)]"
                            : "border-[#DDD7CD] hover:border-[#C4BAA8]"
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="group w-full flex items-center justify-center gap-3 bg-[#1C1917] hover:bg-[#2E2924] text-white text-xs tracking-[0.22em] uppercase py-5 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#1C1917]/20 active:scale-[0.99]"
                    >
                      <span>Send Message</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="transform group-hover:translate-x-0.5 transition-transform duration-200"
                      >
                        <path
                          d="M1 7h12M7.5 1.5L13 7l-5.5 5.5"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <p className="text-center text-[11px] text-[#B0A494] leading-relaxed">
                      By submitting, you agree to our{" "}
                      <a href="#" className="underline underline-offset-2 hover:text-[#7C6F64] transition-colors">
                        privacy policy
                      </a>
                      . We never share your information.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAP SECTION ──────────────────────────────────── */}
      <section className="px-8 md:px-16 pb-24">
        <div className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-10 py-8 border-b border-[#EDE8DF]">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#A8997D] mb-1">
                Visit us
              </p>
              <h3 className="text-xl font-light text-[#1C1917]">Aristocraft Showroom</h3>
              <p className="text-sm text-[#7C6F64] mt-1">
                Bhawalnagar, Punjab, Pakistan
              </p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#7C6F64] border border-[#DDD7CD] hover:border-[#8B7355] hover:text-[#1C1917] px-5 py-3 rounded-lg transition-all duration-200 whitespace-nowrap"
            >
              Open in Maps
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 8.5l7-7M3 1.5h5.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <div className="relative w-full h-[380px] md:h-[440px] bg-[#F0ECE4]">
            <iframe
              title="Aristocraft Showroom Location"
              src="https://www.google.com/maps?q=Bhawalnagar,Punjab,Pakistan&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(40%) contrast(1.05) brightness(0.97)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer className="px-8 md:px-16 py-8 border-t border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="tracking-[0.25em] text-xs uppercase text-[#7C6F64]">
          Aristocraft
        </span>
        <p className="text-[11px] text-[#B0A494]">
          © 2025 Aristocraft. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

/* ─── SUB-COMPONENTS ──────────────────────────────────────── */

function FormField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  focused: string | null;
  onFocus: () => void;
  onBlur: () => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-[10px] tracking-[0.18em] uppercase text-[#7C6F64] font-medium"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        className={`w-full px-5 py-3.5 rounded-xl text-sm text-[#1C1917] placeholder-[#C4BAA8] bg-[#FAFAF8] border transition-all duration-200 outline-none ${
          focused === name
            ? "border-[#8B7355] shadow-[0_0_0_3px_rgba(139,115,85,0.12)]"
            : "border-[#DDD7CD] hover:border-[#C4BAA8]"
        }`}
      />
    </div>
  );
}

function ContactDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] tracking-[0.25em] uppercase text-[#A8997D]">{label}</span>
      <span className="text-sm text-[#3D3530] font-light">{value}</span>
    </div>
  );
}

function SuccessState({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F0EBE0] flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M5 14l7 7L23 7"
            stroke="#8B7355"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-light text-[#1C1917] mb-3">
        Message received
      </h3>
      <p className="text-sm text-[#7C6F64] leading-relaxed max-w-xs">
        Thank you{name ? `, ${name.split(" ")[0]}` : ""}. One of our
        atelier specialists will be in touch within one business day.
      </p>
    </div>
  );
}

/* ─── FURNITURE ILLUSTRATION (SVG) ───────────────────────── */

function FurnitureIllustration() {
  return (
    <svg
      viewBox="0 0 340 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[280px]"
      role="img"
      aria-label="Elegant lounge chair with floor lamp illustration"
    >
      {/* Floor */}
      <ellipse cx="170" cy="388" rx="120" ry="10" fill="#D9D1C3" opacity="0.5" />

      {/* ── LOUNGE CHAIR ── */}
      {/* Back legs */}
      <rect x="92" y="318" width="8" height="52" rx="4" fill="#5C4E3D" />
      <rect x="180" y="318" width="8" height="52" rx="4" fill="#5C4E3D" />
      {/* Front legs */}
      <rect x="118" y="330" width="7" height="42" rx="3.5" fill="#5C4E3D" />
      <rect x="155" y="330" width="7" height="42" rx="3.5" fill="#5C4E3D" />

      {/* Seat cushion base */}
      <rect x="82" y="278" width="122" height="50" rx="10" fill="#C8B89A" />
      {/* Seat cushion top */}
      <rect x="86" y="272" width="114" height="38" rx="8" fill="#D4C4A8" />
      {/* Seat cushion highlight */}
      <rect x="90" y="275" width="106" height="10" rx="5" fill="#DDD0BA" opacity="0.6" />

      {/* Chair back */}
      <rect x="82" y="188" width="122" height="100" rx="14" fill="#C8B89A" />
      <rect x="86" y="192" width="114" height="90" rx="10" fill="#D4C4A8" />
      {/* Back cushion seam */}
      <line x1="143" y1="200" x2="143" y2="272" stroke="#BCA98A" strokeWidth="1.2" strokeDasharray="4 3" />
      {/* Armrests */}
      <rect x="78" y="234" width="20" height="50" rx="8" fill="#B8A88A" />
      <rect x="188" y="234" width="20" height="50" rx="8" fill="#B8A88A" />
      {/* Armrest tops */}
      <rect x="76" y="228" width="24" height="12" rx="6" fill="#C8B89A" />
      <rect x="186" y="228" width="24" height="12" rx="6" fill="#C8B89A" />

      {/* ── SIDE TABLE ── */}
      {/* Table leg */}
      <rect x="237" y="310" width="6" height="64" rx="3" fill="#5C4E3D" />
      {/* Table top */}
      <ellipse cx="240" cy="308" rx="30" ry="8" fill="#D4C4A8" />
      <ellipse cx="240" cy="305" rx="28" ry="7" fill="#DECFB6" />

      {/* Book on table */}
      <rect x="220" y="294" width="22" height="12" rx="2" fill="#8B7355" transform="rotate(-8 220 294)" />
      <rect x="222" y="295" width="20" height="10" rx="1.5" fill="#A8906E" transform="rotate(-8 222 295)" />

      {/* ── FLOOR LAMP ── */}
      {/* Lamp base */}
      <ellipse cx="252" cy="382" rx="18" ry="5" fill="#7C6B5A" />
      <rect x="249" y="340" width="6" height="44" rx="3" fill="#8B7A68" />

      {/* Lamp arm */}
      <path d="M252 342 Q265 320 268 290" stroke="#8B7A68" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Lamp shade */}
      <path d="M253 270 L280 288 L274 312 L242 312 L236 288 Z" fill="#E8DFD0" />
      <path d="M253 270 L280 288" stroke="#D4C4A8" strokeWidth="1" />
      <path d="M253 270 L242 312" stroke="#D4C4A8" strokeWidth="0.5" opacity="0.4" />

      {/* Lamp glow on floor */}
      <ellipse cx="258" cy="368" rx="22" ry="6" fill="#F5EDD8" opacity="0.4" />

      {/* Lamp bulb glow */}
      <ellipse cx="258" cy="296" rx="8" ry="4" fill="#F5EDD8" opacity="0.5" />

      {/* ── CUSHION PILLOW ── */}
      <ellipse cx="143" cy="270" rx="22" ry="12" fill="#B8A88A" />
      <ellipse cx="143" cy="268" rx="20" ry="10" fill="#C8B69A" />

      {/* ── SMALL PLANT ── */}
      {/* Pot */}
      <path d="M56 368 L64 340 L80 340 L88 368 Z" fill="#A8917A" />
      <rect x="54" y="366" width="36" height="6" rx="3" fill="#8B7A68" />
      {/* Soil */}
      <ellipse cx="72" cy="340" rx="14" ry="4" fill="#7A6655" />
      {/* Leaves */}
      <path d="M72 338 Q58 318 62 302 Q72 316 72 338" fill="#8B9E7A" />
      <path d="M72 334 Q88 314 84 298 Q72 312 72 334" fill="#9CAF8A" />
      <path d="M72 330 Q65 308 70 292 Q74 308 72 330" fill="#8B9E7A" opacity="0.8" />
      <path d="M72 332 Q82 322 90 318 Q82 328 72 332" fill="#9CAF8A" opacity="0.7" />

      {/* ── RUG ── */}
      <ellipse cx="155" cy="376" rx="90" ry="12" fill="none" stroke="#C4B49A" strokeWidth="1.5" strokeDasharray="6 4" />
      <ellipse cx="155" cy="376" rx="78" ry="10" fill="none" stroke="#C4B49A" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.5" />
    </svg>
  );
}