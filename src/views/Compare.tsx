import { useMemo } from "react";
import { useStore } from "../lib/store";
import { calcScenario, cumulativePayments, fmtMoney, programBenefit, roiStats, roomsLabel } from "../lib/finance";
import { MARKET_MORTGAGE_RATE, PAYMENT_LABELS } from "../data/offers";
import { FacadeArt, IcArrowL, IcPlus, IcTrash, IcX, offerEmblems, Reveal, Kicker } from "../components/ui";

const COLORS = ["#0E3B2E", "#1B7455", "#F2A81D", "#B64A35"];

export default function Compare() {
  const store = useStore();
  const { offers, compare, toggleCompare, clearCompare, navigate, toast } = store;
  const selected = useMemo(() => offers.filter((o) => compare.includes(o.id)), [offers, compare]);
  const candidates = useMemo(() => offers.filter((o) => o.isActive && !compare.includes(o.id)).slice(0, 8), [offers, compare]);

  const months = 48; // горизонт графика
  const downPct = 20;

  const series = useMemo(() => {
    return selected.map((o) => {
      const pts = cumulativePayments(o, downPct, o.termMonths);
      const r = calcScenario(o, downPct, o.termMonths);
      return { offer: o, pts, result: r };
    });
  }, [selected]);

  const mortgageLine = useMemo(() => {
    const price = selected[0]?.programPrice ?? 13_000_000;
    const body = price * (1 - downPct / 100);
    const r = MARKET_MORTGAGE_RATE / 100 / 12;
    const pay = (body * r) / (1 - Math.pow(1 + r, -300));
    return Array.from({ length: months + 1 }, (_, m) => (price * downPct) / 100 + pay * m);
  }, [selected]);

  if (selected.length === 0) {
    return (
      <div className="bg-blueprint grid min-h-[70vh] place-items-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-pine-100 text-pine-700">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M9 4v16" /><rect x="3" y="8" width="6" height="12" rx="1.2" /><rect x="15" y="4" width="6" height="12" rx="1.2" /></svg>
          </div>
          <h1 className="font-display text-[22px] font-bold text-ink">В сравнении пусто</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">Добавьте 2–4 ЖК из результатов — покажем платежи, переплату и график выплат против рыночной ипотеки под {MARKET_MORTGAGE_RATE}%.</p>
          <button onClick={() => navigate({ name: "results" })} className="mt-6 rounded-md bg-pine-800 px-6 py-3 text-[14px] font-bold text-paper transition-all hover:bg-pine-700 active:scale-95">
            Перейти к результатам
          </button>
        </div>
      </div>
    );
  }

  const maxV = Math.max(...series.flatMap((s) => s.pts), ...mortgageLine) * 1.08;
  const W = 720, H = 300, PAD = 42;
  const X = (m: number) => PAD + (m / months) * (W - PAD - 16);
  const Y = (v: number) => H - 30 - (v / maxV) * (H - 70);
  const path = (pts: number[]) =>
    pts.map((v, m) => `${m === 0 ? "M" : "L"}${X((m * months) / Math.max(pts.length - 1, 1)).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");

  const rows: { label: string; render: (s: typeof series[number]) => React.ReactNode; best?: (s: typeof series) => number }[] = [
    { label: "Цена по программе", render: (s) => <b className="tabular">{fmtMoney(s.offer.programPrice, true)}</b> },
    { label: "Базовая / витринная", render: (s) => <span className="text-ink-soft tabular text-[12px]"><s>{fmtMoney(s.offer.priceWithRepair, true)}</s> · {fmtMoney(s.offer.basePrice, true)}</span> },
    { label: "Выгода по программе", render: (s) => <span className="font-bold text-pine-700 tabular">− {fmtMoney(programBenefit(s.offer), true)}</span>, best: (ss) => ss.reduce((bi, s, i) => (programBenefit(s.offer) > programBenefit(ss[bi].offer) ? i : bi), 0) },
    { label: `ПВ ${downPct}%`, render: (s) => <span className="tabular">{fmtMoney(s.result.down, true)}</span> },
    { label: "Ежемесячный платёж", render: (s) => <b className="tabular">{fmtMoney(s.result.monthly)}</b>, best: (ss) => ss.reduce((bi, s, i) => (s.result.monthly < ss[bi].result.monthly ? i : bi), 0) },
    { label: "Срок / ставка", render: (s) => <span className="tabular">{s.offer.termMonths} мес · {s.offer.interestRatePercent}%</span> },
    { label: "Тип платежа", render: (s) => PAYMENT_LABELS[s.offer.paymentType] },
    { label: "Переплата", render: (s) => <span className={`tabular font-bold ${s.result.overpayment > 0 ? "text-clay-600" : "text-pine-700"}`}>{s.result.overpayment > 0 ? fmtMoney(s.result.overpayment, true) : "0 ₽"}</span>, best: (ss) => ss.reduce((bi, s, i) => (s.result.overpayment < ss[bi].result.overpayment ? i : bi), 0) },
    { label: "Итого к выплате", render: (s) => <b className="tabular">{fmtMoney(s.result.total, true)}</b>, best: (ss) => ss.reduce((bi, s, i) => (s.result.total < ss[bi].result.total ? i : bi), 0) },
    { label: `Ипотека ${MARKET_MORTGAGE_RATE}% · 25 лет`, render: (s) => <span className="text-ink-soft tabular">{fmtMoney(s.result.mortgageTotal, true)}</span> },
    { label: "Выгода vs ипотека", render: (s) => <span className="rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-700 tabular">{fmtMoney(s.result.benefit, true)}</span>, best: (ss) => ss.reduce((bi, s, i) => (s.result.benefit > ss[bi].result.benefit ? i : bi), 0) },
    { label: "ROI аренды / окупаемость", render: (s) => { const r = roiStats(s.offer); return <span className="tabular">{r.roi.toFixed(1)}% · {r.paybackYears.toFixed(1)} лет</span>; }, best: (ss) => ss.reduce((bi, s, i) => (roiStats(s.offer).roi > roiStats(ss[bi].offer).roi ? i : bi), 0) },
    { label: "Район · метро", render: (s) => <span className="text-[12px] text-ink-soft">{s.offer.district} · м. {s.offer.metro}</span> },
    { label: "Формат · сдача", render: (s) => <span className="text-[12px] text-ink-soft">{roomsLabel(s.offer.rooms)} {s.offer.areaMin}–{s.offer.areaMax} м² · {s.offer.readyQuarter}</span> },
    { label: "Условия", render: (s) => (
      <span className="flex flex-wrap gap-1">{offerEmblems(s.offer).slice(0, 4).map((e) => <span key={e.label} className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${e.cls}`}>{e.label}</span>)}</span>
    ) },
  ];

  return (
    <div className="bg-blueprint min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <button onClick={() => navigate({ name: "results" })} className="mb-1 flex items-center gap-1 text-[12.5px] font-semibold text-ink-faint transition-colors hover:text-pine-700"><IcArrowL size={13} /> К результатам</button>
            <h1 className="font-display text-[clamp(20px,2.8vw,30px)] font-bold tracking-tight text-pine-950">Сравнение сценариев</h1>
            <p className="mt-1 text-[13px] text-ink-soft">{selected.length} из 4 объектов · ПВ {downPct}% · зелёная подсветка — лучший показатель в строке</p>
          </div>
          <button onClick={() => { clearCompare(); toast("Сравнение очищено"); }} className="flex items-center gap-1.5 rounded-md border border-line bg-card px-4 py-2.5 text-[12.5px] font-bold text-ink-soft transition-all hover:border-clay-600 hover:text-clay-600 active:scale-95">
            <IcTrash size={14} /> Очистить
          </button>
        </div>

        <Reveal>
          <div className="overflow-x-auto rounded-xl border border-line bg-card shadow-lift">
            <table className="w-full min-w-[760px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-line">
                  <th className="w-56 bg-paper p-4 text-left align-bottom">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">Параметр</span>
                  </th>
                  {series.map((s, i) => (
                    <th key={s.offer.id} className="min-w-[190px] border-l border-line p-4 text-left align-top">
                      <div className="relative mb-2 h-20 overflow-hidden rounded-md">
                        <FacadeArt offer={s.offer} variant={i} className="h-full w-full" />
                        <span className="absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 font-display text-[10px] font-bold" style={{ background: COLORS[i], color: "#F1F4EE" }}>{String.fromCharCode(65 + i)}</span>
                      </div>
                      <button onClick={() => navigate({ name: "offer", offerId: s.offer.id })} className="block font-display text-[13.5px] font-semibold leading-snug text-ink transition-colors hover:text-pine-700">{s.offer.project}</button>
                      <div className="text-[11px] font-semibold text-ink-faint">{s.offer.developer}</div>
                      <button onClick={() => toggleCompare(s.offer.id)} className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-clay-600 transition-opacity hover:opacity-70"><IcX size={11} /> убрать</button>
                    </th>
                  ))}
                  {selected.length < 4 && (
                    <th className="min-w-[150px] border-l border-dashed border-line p-4 align-top">
                      <div className="grid h-20 place-items-center rounded-md border-2 border-dashed border-line text-ink-faint"><IcPlus size={20} /></div>
                      <div className="mt-2 max-h-40 space-y-1 overflow-y-auto thin-scroll pr-1">
                        {candidates.map((o) => (
                          <button key={o.id} onClick={() => toggleCompare(o.id)} className="flex w-full items-center justify-between gap-1 rounded border border-line bg-paper px-2 py-1.5 text-left text-[11px] font-semibold text-ink-soft transition-all hover:border-pine-600 hover:text-pine-700">
                            <span className="truncate">{o.project}</span><IcPlus size={11} className="flex-none" />
                          </button>
                        ))}
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const bestIdx = row.best ? row.best(series) : -1;
                  return (
                    <tr key={row.label} className="border-b border-line-soft transition-colors last:border-0 hover:bg-mint/50">
                      <td className="p-3.5 pl-4 font-semibold text-ink-soft">{row.label}</td>
                      {series.map((s, i) => (
                        <td key={s.offer.id} className={`border-l border-line p-3.5 ${i === bestIdx ? "bg-pine-100/60" : ""}`}>
                          <div className="flex items-center gap-1.5">{row.render(s)}{i === bestIdx && <span className="h-1.5 w-1.5 flex-none rounded-full bg-pine-600" title="Лучший в строке" />}</div>
                        </td>
                      ))}
                      {selected.length < 4 && <td className="border-l border-dashed border-line" />}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* график выплат */}
        <Reveal delay={120}>
          <div className="mt-8 rounded-xl border border-line bg-card p-6 shadow-lift">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <Kicker>Визуализация</Kicker>
                <h2 className="font-display text-[18px] font-bold tracking-tight text-ink">Кумулятивные выплаты, 48 месяцев</h2>
              </div>
              <div className="flex flex-wrap gap-3 text-[11.5px] font-bold">
                {series.map((s, i) => (
                  <span key={s.offer.id} className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm" style={{ background: COLORS[i] }} /> {String.fromCharCode(65 + i)} · {s.offer.project}</span>
                ))}
                <span className="flex items-center gap-1.5 text-ink-faint"><span className="h-2.5 w-4 rounded-sm bg-clay-600/60" /> Ипотека {MARKET_MORTGAGE_RATE}%</span>
              </div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="График кумулятивных выплат">
              {[0.25, 0.5, 0.75, 1].map((p) => (
                <g key={p}>
                  <line x1={PAD} x2={W - 12} y1={Y(maxV * p)} y2={Y(maxV * p)} stroke="#DBE3D7" strokeWidth="1" strokeDasharray="3 5" />
                  <text x={PAD - 6} y={Y(maxV * p) + 4} textAnchor="end" fontSize="10" fill="#7D8D82" fontFamily="Golos Text">{Math.round((maxV * p) / 1_000_000)} млн</text>
                </g>
              ))}
              <line x1={PAD} x2={W - 12} y1={H - 30} y2={H - 30} stroke="#4C5E53" strokeWidth="1.2" />
              {[0, 12, 24, 36, 48].map((m) => (
                <text key={m} x={X(m)} y={H - 10} textAnchor="middle" fontSize="10.5" fill="#7D8D82" fontFamily="Golos Text">{m} мес</text>
              ))}
              <path d={`${path(mortgageLine)} L${X(months)},${H - 30} L${X(0)},${H - 30} Z`} fill="#B64A35" opacity="0.07" />
              <path d={path(mortgageLine)} fill="none" stroke="#B64A35" strokeWidth="2" strokeDasharray="6 5" opacity="0.65" />
              {series.map((s, i) => (
                <path key={s.offer.id} d={path(s.pts)} fill="none" stroke={COLORS[i]} strokeWidth="3" strokeLinecap="round" className="anim-draw" style={{ ["--dash" as string]: 900, animationDelay: `${i * 0.2}s` }} />
              ))}
              {series.map((s, i) => {
                const lastM = Math.min(s.pts.length - 1, months);
                return <circle key={`c${s.offer.id}`} cx={X((lastM * months) / Math.max(s.pts.length - 1, 1))} cy={Y(s.pts[lastM])} r="5" fill={COLORS[i]} stroke="#FBFCF9" strokeWidth="2" />;
              })}
            </svg>
            <p className="mt-3 text-[12px] leading-snug text-ink-faint">
              Пунктир — рыночная ипотека на первый объект выборки ({selected[0] ? fmtMoney(selected[0].programPrice, true) : ""}, ставка ЦБ {MARKET_MORTGAGE_RATE}%). Чем ниже кривая — тем меньше денег вы отдаёте за квартиру. Рассрочка обрывается после полного погашения: дальше платёж равен нулю.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
