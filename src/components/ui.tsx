import React, { useEffect, useRef, useState } from "react";
import type { Offer } from "../data/offers";

/* ================= icons (custom inline SVG) ================= */
type IcProps = React.SVGProps<SVGSVGElement> & { size?: number };
const base = (p: IcProps) => ({
  width: p.size ?? 18, height: p.size ?? 18, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
});

export const IcHouse = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M3.5 11 12 4l8.5 7" /><path d="M6 10v9.5h12V10" /><path d="M10 19.5v-5h4v5" /></svg>
);
export const IcFamily = (p: IcProps) => (
  <svg {...base(p)} {...p}><circle cx="8.2" cy="7.5" r="2.6" /><circle cx="16.5" cy="8.5" r="2.1" /><path d="M3.5 19.5c0-3 2.1-5 4.7-5s4.7 2 4.7 5" /><path d="M13.8 19.5c.2-2.4 1.4-4 3.4-4 1.6 0 2.8 1 3.3 2.7" /><circle cx="11" cy="17" r="1.1" /></svg>
);
export const IcInvestor = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M4 4v16h16" /><path d="M7.5 15.5 11 11l2.8 2.6L19 8" /><path d="M19 12V8h-4" /><circle cx="19" cy="8" r="0.5" fill="currentColor" /></svg>
);
export const IcPerson = (p: IcProps) => (
  <svg {...base(p)} {...p}><circle cx="12" cy="7.6" r="3.1" /><path d="M5.5 20c.5-3.8 3-6 6.5-6s6 2.2 6.5 6" /><path d="M12 11.5v2.2" /></svg>
);
export const IcMetro = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M4 4l6 12L6 16" transform="translate(1.5 1)" /><path d="M17.5 13.5 14 19l-3.5-5.5" /><path d="M6.5 20.5h11" /></svg>
);
export const IcHeart = (p: IcProps & { filled?: boolean }) => (
  <svg {...base(p)} {...p} fill={p.filled ? "currentColor" : "none"}><path d="M12 20s-7.5-4.6-9.3-9.3C1.6 7.9 3.4 5 6.4 5c2 0 3.6 1.1 4.6 2.9L12 9.5l1-1.6C14 6.1 15.6 5 17.6 5c3 0 4.8 2.9 3.7 5.7C19.5 15.4 12 20 12 20Z" /></svg>
);
export const IcCompare = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M9 4v16" /><rect x="3" y="8" width="6" height="12" rx="1.2" /><rect x="15" y="4" width="6" height="12" rx="1.2" /></svg>
);
export const IcCalc = (p: IcProps) => (
  <svg {...base(p)} {...p}><rect x="5" y="3.5" width="14" height="17" rx="2" /><path d="M8.5 7.5h7" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5v.01" strokeWidth="2.4" /></svg>
);
export const IcPhone = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M5.5 4h3l1.5 4-2 1.5c.8 2 2.5 3.7 4.5 4.5L14 12l4 1.5v3a2 2 0 0 1-2.2 2C9.7 18 6 14.3 5.5 8.2A2 2 0 0 1 5.5 4Z" /></svg>
);
export const IcChat = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h-.5A2.5 2.5 0 0 1 4 13.5v-8Z" /><path d="M8 8h8M8 11.5h5" /></svg>
);
export const IcSpark = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.5l-1.8-5.9L4.5 10.8 10.2 9 12 3.5Z" /><path d="M18.5 16.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" strokeWidth="1.4" /></svg>
);
export const IcArrowR = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M4.5 12h15" /><path d="m13.5 6 6 6-6 6" /></svg>
);
export const IcArrowL = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M19.5 12h-15" /><path d="m10.5 6-6 6 6 6" /></svg>
);
export const IcCheck = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const IcX = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="m6 6 12 12M18 6 6 18" /></svg>
);
export const IcSearch = (p: IcProps) => (
  <svg {...base(p)} {...p}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4.5 4.5" /></svg>
);
export const IcPin = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M12 21s-6.5-5.6-6.5-10.4A6.5 6.5 0 0 1 12 4a6.5 6.5 0 0 1 6.5 6.6C18.5 15.4 12 21 12 21Z" /><circle cx="12" cy="10.5" r="2.3" /></svg>
);
export const IcClock = (p: IcProps) => (
  <svg {...base(p)} {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.2l3.4 2" /></svg>
);
export const IcPercent = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="m18.5 5.5-13 13" /><circle cx="7.3" cy="7.3" r="2.6" /><circle cx="16.7" cy="16.7" r="2.6" /></svg>
);
export const IcKey = (p: IcProps) => (
  <svg {...base(p)} {...p}><circle cx="8" cy="8.5" r="4.2" /><path d="m11 11.5 8.5 8.5M17 17.5l2-2M14.5 15l1.6-1.6" /></svg>
);
export const IcFeed = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M5 12a7 7 0 0 1 14 0" /><path d="M8.2 12a3.8 3.8 0 0 1 7.6 0" /><circle cx="12" cy="12.4" r="1.1" fill="currentColor" /><path d="M12 13.5V20" /></svg>
);
export const IcShield = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M12 3.5 5 6v5.6c0 4.4 2.9 7.4 7 9 4.1-1.6 7-4.6 7-9V6l-7-2.5Z" /><path d="m9 11.8 2.2 2.2 4-4.3" /></svg>
);
export const IcSend = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="m4.5 11 15-6.5-4.5 15-3.5-6.5-7-2Z" /><path d="m11.5 13 8-8.5" /></svg>
);
export const IcGear = (p: IcProps) => (
  <svg {...base(p)} {...p}><circle cx="12" cy="12" r="3.2" /><path d="M12 3.5v2.4M12 18.1v2.4M3.5 12h2.4M18.1 12h2.4M6 6l1.7 1.7M16.3 16.3 18 18M18 6l-1.7 1.7M7.7 16.3 6 18" /></svg>
);
export const IcEdit = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="m14.5 5.5 4 4L8 20l-4.5.5L4 16 14.5 5.5Z" /><path d="m12.5 7.5 4 4" /></svg>
);
export const IcTrash = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M4.5 6.5h15M9.5 6V4.5h5V6M6.5 6.5 7.5 20h9l1-13.5" /><path d="M10.2 10v6M13.8 10v6" /></svg>
);
export const IcEye = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M2.8 12S6.5 5.8 12 5.8 21.2 12 21.2 12 17.5 18.2 12 18.2 2.8 12 2.8 12Z" /><circle cx="12" cy="12" r="2.6" /></svg>
);
export const IcPlus = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const IcSort = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M7 4.5v15M7 19.5 4 16.5M7 19.5l3-3" /><path d="M17 19.5v-15M17 4.5 14 7.5M17 4.5l3 3" /></svg>
);
export const IcRefresh = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3L19.5 8.5" /><path d="M19.5 4v4.5H15" /></svg>
);
export const IcDoc = (p: IcProps) => (
  <svg {...base(p)} {...p}><path d="M6 3.5h8L19 8.5v12H6v-17Z" /><path d="M13.5 3.5v5.5H19" /><path d="M9 13h6M9 16.5h6" /></svg>
);
export const IcLogo = (p: IcProps) => (
  <svg width={p.size ?? 30} height={p.size ?? 30} viewBox="0 0 32 32" fill="none" {...p}>
    <rect width="32" height="32" rx="8" fill="currentColor" />
    <path d="M7 16 16 8l9 8" stroke="#FFBE3D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 15v9h12v-9" stroke="#F1F4EE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 24v-5h4v5" stroke="#FFBE3D" strokeWidth="2.2" strokeLinejoin="round" />
  </svg>
);

/* ================= Reveal on scroll ================= */
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`} style={{ ["--rd" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ================= CountUp ================= */
export function CountUp({ to, format, duration = 1200, className = "" }: { to: number; format: (n: number) => string; duration?: number; className?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(to); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        setVal(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref} className={`tabular ${className}`}>{format(val)}</span>;
}

/* ================= Modal ================= */
export function Modal({ open, onClose, children, wide = false }: { open: boolean; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-pine-950/60 backdrop-blur-[2px] anim-fade-in" onClick={onClose} />
      <div className={`relative w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[92vh] overflow-y-auto thin-scroll rounded-xl bg-card shadow-pop anim-scale-in`}>
        {children}
      </div>
    </div>
  );
}

/* ================= Toggle ================= */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={on} aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-[22px] w-[40px] flex-none rounded-full transition-colors duration-200 ${on ? "bg-pine-600" : "bg-line"}`}
    >
      <span className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-card shadow transition-all duration-200 ${on ? "left-[20px]" : "left-[2px]"}`} />
    </button>
  );
}

/* ================= Emblem chips ================= */
export function offerEmblems(o: Offer): { label: string; cls: string }[] {
  const e: { label: string; cls: string }[] = [];
  if (o.isInterestFree) e.push({ label: "0%", cls: "bg-amber-400 text-pine-950" });
  if (o.hasKeyEarlyRelease) e.push({ label: "Ключи до оплаты", cls: "bg-pine-800 text-amber-300" });
  if (o.isForFamilies) e.push({ label: "Семейная", cls: "bg-pine-100 text-pine-800" });
  if (o.isItMortgage) e.push({ label: "IT 6%", cls: "bg-pine-800 text-pine-100" });
  if (o.paymentType === "deferred") e.push({ label: "Отложенный платёж", cls: "bg-mint text-pine-700" });
  if (o.isForPregnant) e.push({ label: "Беременным", cls: "bg-clay-100 text-clay-600" });
  if (o.hasTradeIn) e.push({ label: "Trade-In", cls: "bg-card text-pine-700 border border-line" });
  return e;
}

/* ================= FacadeArt — генеративный «чертёжный» фасад ЖК ================= */
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function FacadeArt({ offer, variant = 0, className = "" }: { offer: Offer; variant?: number; className?: string }) {
  const seed = hashSeed(offer.id + variant);
  const rnd = mulberry(seed);
  const hue = (offer.hue + variant * 14) % 360;
  const sky1 = `hsl(${hue} 32% 88%)`;
  const sky2 = `hsl(${(hue + 30) % 360} 30% 76%)`;
  const bldg = (i: number) => `hsl(${hue} ${22 + i * 4}% ${34 - i * 5}%)`;
  const buildings = Array.from({ length: 4 }, (_, i) => {
    const w = 52 + rnd() * 40;
    const h = 90 + rnd() * 110;
    return { x: i * 105 + rnd() * 18 - 6, w, h, lit: Array.from({ length: Math.floor((w / 16) * (h / 22)) }, () => rnd()) };
  });
  const sunX = 60 + rnd() * 280;
  const crane = seed % 3 === 0;
  return (
    <svg viewBox="0 0 420 260" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`sky${offer.id}${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky1} /><stop offset="1" stopColor={sky2} />
        </linearGradient>
      </defs>
      <rect width="420" height="260" fill={`url(#sky${offer.id}${variant})`} />
      <circle cx={sunX} cy="52" r="26" fill="#FFBE3D" opacity="0.85" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M0 ${210 - i * 26} Q 120 ${185 - i * 30 + rnd() * 10} 230 ${205 - i * 24} T 420 ${196 - i * 28}`} fill="none" stroke={`hsl(${hue} 24% ${58 - i * 6}%)`} strokeWidth="1" opacity="0.4" />
      ))}
      {crane && (
        <g stroke="#0E3B2E" strokeWidth="2.4" opacity="0.55">
          <path d="M330 260V58" /><path d="M298 58h84" /><path d="M330 58l44 0M330 58l-32 0" /><path d="M374 58v26" />
          <rect x="368" y="84" width="12" height="10" fill="#0E3B2E" stroke="none" />
        </g>
      )}
      {buildings.map((b, i) => {
        const y = 260 - b.h;
        const cols = Math.max(2, Math.floor(b.w / 17));
        const rows = Math.max(3, Math.floor(b.h / 24));
        return (
          <g key={i}>
            <rect x={b.x} y={y} width={b.w} height={b.h} fill={bldg(i % 4)} rx="2" />
            <rect x={b.x} y={y} width={b.w} height="4" fill={`hsl(${hue} 26% ${26}%)`} />
            {Array.from({ length: cols }).map((_, c) =>
              Array.from({ length: rows }).map((_, r) => {
                const litV = b.lit[(c * rows + r) % b.lit.length];
                return (
                  <rect key={`${c}-${r}`} x={b.x + 5 + c * (b.w - 10) / cols} y={y + 9 + r * (b.h - 16) / rows}
                    width={(b.w - 10) / cols - 4.5} height={(b.h - 16) / rows - 6} rx="1"
                    fill={litV > 0.72 ? "#FFD37A" : litV > 0.35 ? `hsl(${hue} 30% 82% / 0.5)` : `hsl(${hue} 28% 22%)`}
                    opacity={litV > 0.72 ? 0.95 : 0.8} />
                );
              })
            )}
          </g>
        );
      })}
      <rect x="0" y="244" width="420" height="16" fill={`hsl(${hue} 20% 26%)`} />
      {[18, 96, 300, 380].map((x, i) => (
        <g key={i} fill={`hsl(${(hue + 90) % 360} 24% 32%)`}>
          <ellipse cx={x} cy="246" rx={13 + (i % 2) * 6} ry="9" />
        </g>
      ))}
      <g stroke="#F1F4EE" strokeWidth="1" opacity="0.25">
        {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={i * 84} y1="0" x2={i * 84} y2="260" strokeDasharray="2 6" />)}
      </g>
    </svg>
  );
}

/* ================= Section heading ================= */
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-[2px] w-8 bg-amber-500" />
      <span className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-pine-600">{children}</span>
    </div>
  );
}

export function RangeInput({ value, min, max, step = 1, onChange, format }: {
  value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <input type="range" className="range" min={min} max={max} step={step} value={value}
        style={{ ["--fill" as string]: `${pct}%` }} onChange={(e) => onChange(Number(e.target.value))} aria-label={format ? format(value) : String(value)} />
    </div>
  );
}
