import { useMemo, useState } from "react";
import { useStore, filterOffers, PROGRAM_OPTIONS, CONDITION_OPTIONS, INFRA_OPTIONS } from "../lib/store";
import { fmtMoney, fmtNum, programBenefit, plural } from "../lib/finance";
import { DISTRICTS, GROUP_LABELS, PAYMENT_LABELS, type Offer, type PaymentType, type TargetGroup } from "../data/offers";
import {
  CountUp, FacadeArt, IcArrowL, IcArrowR, IcCheck, IcFamily, IcInvestor, IcMetro, IcPerson, IcPin, IcShield,
  IcSpark, Kicker, RangeInput, Reveal, offerEmblems, IcClock, IcPercent, IcKey,
} from "../components/ui";
import OfferCard from "../components/OfferCard";

const STEPS = ["Кто вы", "Бюджет", "Уточнения"];

const PERSONAS: { key: TargetGroup; icon: (p: { size?: number }) => JSX.Element; desc: string; tags: string[] }[] = [
  { key: "family", icon: (p) => <IcFamily {...p} />, desc: "Подберём с учётом детей, семейной ипотеки и инфраструктуры", tags: ["Семейная 6%", "Дети до 7", "Маткапитал"] },
  { key: "investor", icon: (p) => <IcInvestor {...p} />, desc: "Рассчитаем доходность, окупаемость и ликвидность", tags: ["ROI", "Ключи до оплаты", "Студии у метро"] },
  { key: "individual", icon: (p) => <IcPerson {...p} />, desc: "Гибкий подбор с калькулятором и сравнением сценариев", tags: ["0% рассрочка", "Trade-In", "Гибкий график"] },
];

export default function Wizard() {
  const store = useStore();
  const { filters, setFilters, offers, homeCfg, geoDistrict, filterBlocks, navigate, stats } = store;
  const [step, setStep] = useState(0);
  const [geoAsked, setGeoAsked] = useState(!homeCfg.geoPrompt);

  const activeOffers = useMemo(() => offers.filter((o) => o.isActive), [offers]);
  const avgBenefit = useMemo(() => activeOffers.reduce((s, o) => s + programBenefit(o), 0) / Math.max(1, activeOffers.length), [activeOffers]);
  const found = useMemo(() => filterOffers(offers, filters), [offers, filters]);
  const topOffers = useMemo(() => [...activeOffers].sort((a, b) => programBenefit(b) - programBenefit(a)).slice(0, 3), [activeOffers]);

  const blockVisible = (id: string) => {
    const b = filterBlocks.find((x) => x.id === id);
    return b?.visible !== false && b?.groups.includes(filters.group) !== false;
  };
  const blocksOrdered = useMemo(
    () => [...filterBlocks].filter((b) => b.groups.includes(filters.group) && b.visible !== false).sort((a, b) => a.order - b.order),
    [filterBlocks, filters.group]
  );

  const toggleIn = <T,>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const maxPrice = Math.round((filters.budget * 0.85) / 100_000) * 100_000;

  const programOptionsFor = useMemo(() => {
    const base = filters.group === "investor"
      ? ["interest-free", "it"]
      : ["family", "it", "kids7", "matkap"];
    if (filters.group === "family") return PROGRAM_OPTIONS.filter((p) => ["family", "it", "kids7", "pregnant", "matkap"].includes(p.key));
    if (filters.group === "investor") return PROGRAM_OPTIONS.filter((p) => base.includes(p.key));
    return PROGRAM_OPTIONS.filter((p) => ["interest-free", "it", "matkap"].includes(p.key));
  }, [filters.group]);

  const conditionOptionsFor = useMemo(() => {
    if (filters.group === "family") return CONDITION_OPTIONS.filter((c) => ["keys", "switch", "it"].includes(c.key));
    if (filters.group === "investor") return CONDITION_OPTIONS.filter((c) => ["keys", "long", "it", "switch"].includes(c.key));
    return CONDITION_OPTIONS;
  }, [filters.group]);

  const countFor = (test: (o: Offer) => boolean) => found.filter(test).length;

  const goResults = () => {
    store.track("listViews");
    navigate({ name: "results" });
  };

  return (
    <div className="bg-blueprint">
      {/* ================= ВЕРХНИЙ БЛОК: бренд + мастер ================= */}
      <section className="relative overflow-hidden">
        {/* контурный декор */}
        <svg className="pointer-events-none absolute -right-24 -top-24 h-[480px] w-[480px] text-pine-800/10" viewBox="0 0 200 200" fill="none" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx="100" cy="100" r={30 + i * 18} stroke="currentColor" strokeWidth="0.7" />)}
          <path d="M20 160 60 120l30 25 40-55 50 70" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-14">
          {/* левая колонка */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-pine-200 bg-mint px-3.5 py-1.5 text-[12px] font-semibold text-pine-800">
                <span className="relative flex h-2 w-2"><span className="absolute h-2 w-2 animate-ping rounded-full bg-pine-500 opacity-60" /><span className="h-2 w-2 rounded-full bg-pine-600" /></span>
                Геотаргетинг: {geoDistrict} район · {activeOffers.length} программ от застройщиков онлайн
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="font-display text-[clamp(26px,4.2vw,46px)] font-bold leading-[1.08] tracking-tight text-pine-950 text-balance">
                {homeCfg.title}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">
                {homeCfg.subtitle}
              </p>
            </Reveal>

            {/* живые счётчики */}
            <Reveal delay={240}>
              <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-line rounded-lg border border-line bg-card shadow-lift">
                {[
                  { v: activeOffers.length * 147, f: (n: number) => fmtNum(n), l: "объектов в фидах", note: "XML · Яндекс.Недвижимость" },
                  { v: Math.round(avgBenefit), f: (n: number) => fmtMoney(n, true), l: "средняя выгода", note: "против базовой цены" },
                  { v: stats.conversions, f: (n: number) => fmtNum(n), l: "заявок за месяц", note: "без регистрации" },
                ].map((s) => (
                  <div key={s.l} className="px-4 py-4">
                    <div className="font-display text-[clamp(17px,1.8vw,24px)] font-bold text-pine-800"><CountUp to={s.v} format={s.f} /></div>
                    <div className="mt-0.5 text-[12px] font-semibold text-ink">{s.l}</div>
                    <div className="text-[10.5px] text-ink-faint">{s.note}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-ink-soft">
                <span className="flex items-center gap-1.5"><IcShield size={15} className="text-pine-600" /> Сделки по 214-ФЗ, эскроу-счета</span>
                <span className="flex items-center gap-1.5"><IcClock size={15} className="text-pine-600" /> Одобрение за 1 день, без банка</span>
                <span className="flex items-center gap-1.5"><IcPercent size={15} className="text-pine-600" /> Ставки 0–7% вместо 21%</span>
              </div>
            </Reveal>
          </div>

          {/* правая колонка: мастер */}
          <Reveal delay={200}>
            <div className="rounded-xl border border-line bg-card shadow-pop">
              {/* прогресс */}
              <div className="flex items-center gap-2 border-b border-line-soft px-5 py-4">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center gap-2">
                    <button
                      onClick={() => i < step && setStep(i)}
                      className={`grid h-7 w-7 flex-none place-items-center rounded-full font-display text-[12px] font-bold transition-all duration-300 ${
                        i < step ? "bg-pine-600 text-paper cursor-pointer hover:bg-pine-700" : i === step ? "bg-pine-800 text-amber-300 scale-110" : "border-2 border-line text-ink-faint"
                      }`}
                    >
                      {i < step ? <IcCheck size={13} /> : i + 1}
                    </button>
                    <div className="min-w-0">
                      <div className={`truncate text-[11px] font-bold uppercase tracking-wide ${i === step ? "text-pine-800" : "text-ink-faint"}`}>{s}</div>
                      {i === 0 && step === 0 && <div className="text-[10px] text-ink-faint">шаг 1 из 3</div>}
                    </div>
                    {i < 2 && <div className={`h-[2px] flex-1 rounded transition-colors duration-500 ${i < step ? "bg-pine-600" : "bg-line"}`} />}
                  </div>
                ))}
              </div>

              <div className="p-5 sm:p-6">
                {/* геопромт */}
                {!geoAsked && (
                  <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-pine-200 bg-mint px-4 py-3 anim-fade-up">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-pine-900">
                      <IcPin size={16} className="text-pine-700" /> Показать квартиры рядом с вами?
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setFilters({ district: geoDistrict === "Пресненский" ? "Пресненский" : "all" }); setGeoAsked(true); }}
                        className="rounded-md bg-pine-800 px-3 py-1.5 text-[12px] font-bold text-paper transition-transform active:scale-95">Да</button>
                      <button onClick={() => setGeoAsked(true)} className="rounded-md border border-pine-300 px-3 py-1.5 text-[12px] font-semibold text-pine-800 transition-transform active:scale-95">Выбрать район</button>
                    </div>
                  </div>
                )}

                {/* ШАГ 1: целевая группа */}
                {step === 0 && (
                  <div className="anim-fade-up space-y-3">
                    <h2 className="font-display text-[19px] font-bold text-ink">Выберите, кто вы</h2>
                    <p className="text-[13px] text-ink-soft">Наборы фильтров и расчётов подстроятся под вашу цель.</p>
                    {PERSONAS.map((p) => {
                      const active = filters.group === p.key;
                      return (
                        <button
                          key={p.key}
                          onClick={() => { setFilters({ group: p.key, programs: [], conditions: [], payments: [], infra: [], rooms: [] }); setStep(1); }}
                          className={`group w-full rounded-lg border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.99] ${
                            active ? "border-pine-700 bg-mint" : "border-line bg-card hover:border-pine-300"
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <span className={`grid h-11 w-11 flex-none place-items-center rounded-lg transition-colors ${active ? "bg-pine-800 text-amber-300" : "bg-pine-100 text-pine-800 group-hover:bg-pine-800 group-hover:text-amber-300"}`}>
                              {p.icon({ size: 22 })}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-display text-[15px] font-semibold text-ink">{GROUP_LABELS[p.key]}</span>
                                <IcArrowR size={16} className={`transition-transform duration-200 ${active ? "text-pine-700" : "text-ink-faint"} group-hover:translate-x-1 group-hover:text-pine-700`} />
                              </div>
                              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-soft">{p.desc}</p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {p.tags.map((t) => <span key={t} className="rounded bg-paper px-2 py-0.5 text-[10.5px] font-semibold text-pine-700 border border-line-soft">{t}</span>)}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ШАГ 2: бюджет */}
                {step === 1 && (
                  <div className="anim-fade-up">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setStep(0)} className="flex items-center gap-1 text-[12.5px] font-semibold text-ink-soft transition-colors hover:text-pine-700"><IcArrowL size={14} /> Назад</button>
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">{GROUP_LABELS[filters.group]}</span>
                    </div>
                    <h2 className="mt-3 font-display text-[19px] font-bold text-ink">Ваш совокупный бюджет</h2>
                    <p className="mt-1 text-[13px] text-ink-soft">Включает первоначальный взнос и стоимость квартиры.</p>

                    <div className="mt-6 rounded-lg border border-line bg-paper p-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[12px] font-semibold uppercase tracking-wide text-ink-faint">Бюджет</span>
                        <span className="font-display text-[28px] font-bold text-pine-800 tabular">{fmtMoney(filters.budget)}</span>
                      </div>
                      <div className="mt-2">
                        <RangeInput value={filters.budget} min={4_000_000} max={60_000_000} step={500_000} onChange={(v) => setFilters({ budget: v })} />
                        <div className="flex justify-between text-[10.5px] text-ink-faint"><span>4 млн</span><span>60 млн ₽</span></div>
                      </div>
                      <div className="mt-3 flex items-center justify-between rounded-md bg-mint px-3 py-2 text-[12.5px]">
                        <span className="text-pine-900">Доступны квартиры до</span>
                        <span className="font-bold text-pine-800 tabular">≈ {fmtMoney(maxPrice, true)}</span>
                      </div>
                      <p className="mt-2 text-[11px] leading-snug text-ink-faint">Система учитывает средний ПВ 15–20%: при бюджете {fmtMoney(filters.budget, true)} в выдачу попадают объекты до {fmtMoney(maxPrice, true)}.</p>
                    </div>

                    <button onClick={() => setStep(2)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-pine-800 py-3.5 text-[14px] font-bold text-paper transition-all hover:bg-pine-700 active:scale-[0.99]">
                      Дальше: уточнения <IcArrowR size={16} />
                    </button>
                  </div>
                )}

                {/* ШАГ 3: фильтры */}
                {step === 2 && (
                  <div className="anim-fade-up">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[12.5px] font-semibold text-ink-soft transition-colors hover:text-pine-700"><IcArrowL size={14} /> Бюджет</button>
                      <button onClick={() => store.resetFilters()} className="text-[12px] font-semibold text-ink-faint underline-offset-2 hover:text-clay-600 hover:underline">Сбросить всё</button>
                    </div>
                    <h2 className="mt-3 font-display text-[17px] font-bold text-ink">
                      Фильтры для профиля «{GROUP_LABELS[filters.group]}»
                    </h2>

                    <div className="mt-4 max-h-[380px] space-y-4 overflow-y-auto thin-scroll pr-1">
                      {blocksOrdered.map((b) => (
                        <div key={b.id}>
                          {b.id === "geo" && (
                            <fieldset>
                              <legend className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</legend>
                              <div className="flex flex-wrap gap-1.5">
                                <button onClick={() => setFilters({ district: "all" })} className={`rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-all active:scale-95 ${filters.district === "all" ? "bg-pine-800 text-paper" : "border border-line bg-card text-ink-soft hover:border-pine-400"}`}>Вся Москва</button>
                                {DISTRICTS.slice(0, 8).map((d) => (
                                  <button key={d} onClick={() => setFilters({ district: filters.district === d ? "all" : d })} className={`rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-all active:scale-95 ${filters.district === d ? "bg-pine-800 text-paper" : "border border-line bg-card text-ink-soft hover:border-pine-400"}`}>{d}</button>
                                ))}
                              </div>
                            </fieldset>
                          )}
                          {b.id === "rooms" && (
                            <fieldset>
                              <legend className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</legend>
                              <div className="flex gap-1.5">
                                {[{ v: 0, l: "Студия" }, { v: 1, l: "1" }, { v: 2, l: "2" }, { v: 3, l: "3+" }].map((r) => (
                                  <button key={r.v} onClick={() => setFilters({ rooms: toggleIn(filters.rooms, r.v) })}
                                    className={`h-10 flex-1 rounded-md text-[13px] font-bold transition-all active:scale-95 ${filters.rooms.includes(r.v) ? "bg-pine-800 text-amber-300" : "border border-line bg-card text-ink-soft hover:border-pine-400"}`}>{r.l}</button>
                                ))}
                              </div>
                            </fieldset>
                          )}
                          {b.id === "programs" && (
                            <fieldset>
                              <legend className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">{b.label} <span className="normal-case text-ink-faint font-medium">· {found.length} совпадений</span></legend>
                              <div className="space-y-1">
                                {programOptionsFor.map((p) => (
                                  <label key={p.key} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-mint">
                                    <input type="checkbox" className="chk" checked={filters.programs.includes(p.key)} onChange={() => setFilters({ programs: toggleIn(filters.programs, p.key) })} />
                                    <span className="flex-1 text-[13px] font-semibold text-ink">{p.label}</span>
                                    <span className="text-[11px] text-ink-faint">{p.hint}</span>
                                    <span className="w-7 text-right text-[11.5px] font-bold text-pine-600 tabular">{countFor(p.test)}</span>
                                  </label>
                                ))}
                              </div>
                            </fieldset>
                          )}
                          {b.id === "conditions" && (
                            <fieldset>
                              <legend className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</legend>
                              <div className="space-y-1">
                                {conditionOptionsFor.map((c) => (
                                  <label key={c.key} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-mint">
                                    <input type="checkbox" className="chk" checked={filters.conditions.includes(c.key)} onChange={() => setFilters({ conditions: toggleIn(filters.conditions, c.key) })} />
                                    <span className="flex-1 text-[13px] font-semibold text-ink">{c.label}</span>
                                    <span className="w-7 text-right text-[11.5px] font-bold text-pine-600 tabular">{countFor(c.test)}</span>
                                  </label>
                                ))}
                              </div>
                            </fieldset>
                          )}
                          {b.id === "payment" && (
                            <fieldset>
                              <legend className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</legend>
                              <div className="flex flex-wrap gap-1.5">
                                {(Object.keys(PAYMENT_LABELS) as PaymentType[]).map((t) => (
                                  <button key={t} onClick={() => setFilters({ payments: toggleIn(filters.payments, t) })}
                                    className={`rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-all active:scale-95 ${filters.payments.includes(t) ? "bg-pine-800 text-paper" : "border border-line bg-card text-ink-soft hover:border-pine-400"}`}>{PAYMENT_LABELS[t]}</button>
                                ))}
                              </div>
                            </fieldset>
                          )}
                          {b.id === "term" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="rounded-md border border-line bg-paper p-3">
                                <div className="flex justify-between text-[11.5px] font-bold"><span className="text-ink-faint uppercase tracking-wide">Мин. ПВ</span><span className="text-pine-700 tabular">до {filters.maxDown}%</span></div>
                                <RangeInput value={filters.maxDown} min={0} max={50} step={5} onChange={(v) => setFilters({ maxDown: v })} />
                              </div>
                              <div className="rounded-md border border-line bg-paper p-3">
                                <div className="flex justify-between text-[11.5px] font-bold"><span className="text-ink-faint uppercase tracking-wide">Срок от</span><span className="text-pine-700 tabular">{filters.minTerm} мес</span></div>
                                <RangeInput value={filters.minTerm} min={6} max={48} step={6} onChange={(v) => setFilters({ minTerm: v })} />
                              </div>
                            </div>
                          )}
                          {b.id === "infra" && (
                            <fieldset>
                              <legend className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</legend>
                              <div className="space-y-1">
                                {INFRA_OPTIONS.map((i) => (
                                  <label key={i.key} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-mint">
                                    <input type="checkbox" className="chk" checked={filters.infra.includes(i.key)} onChange={() => setFilters({ infra: toggleIn(filters.infra, i.key) })} />
                                    <span className="text-[13px] font-semibold text-ink">{i.label}</span>
                                  </label>
                                ))}
                              </div>
                            </fieldset>
                          )}
                          {b.id === "invest" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="rounded-md border border-line bg-paper p-3">
                                <div className="flex justify-between text-[11.5px] font-bold"><span className="text-ink-faint uppercase tracking-wide">Окупаемость</span><span className="text-pine-700 tabular">до {filters.maxPayback} лет</span></div>
                                <RangeInput value={filters.maxPayback} min={5} max={20} onChange={(v) => setFilters({ maxPayback: v })} />
                              </div>
                              <div className="rounded-md border border-line bg-paper p-3">
                                <div className="flex justify-between text-[11.5px] font-bold"><span className="text-ink-faint uppercase tracking-wide">Аренда от</span><span className="text-pine-700 tabular">{filters.rentMin ? fmtNum(filters.rentMin / 1000) + " тыс" : "любая"}</span></div>
                                <RangeInput value={filters.rentMin} min={0} max={150_000} step={10_000} onChange={(v) => setFilters({ rentMin: v })} />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button onClick={goResults} className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-amber-400 py-3.5 text-[14.5px] font-bold text-pine-950 shadow-lift transition-all hover:bg-amber-300 active:scale-[0.99]">
                      Показать {found.length} {plural(found.length, "вариант", "варианта", "вариантов")} <IcArrowR size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        {/* бегущая строка программ */}
        <div className="border-y border-pine-800 bg-pine-900 py-2.5 overflow-hidden">
          <div className="marquee-track gap-8 px-4">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center gap-8">
                {["Рассрочка 0% до 48 мес", "Семейная ипотека 6%", "IT-ипотека для аккредитованных", "Ключи до полной оплаты", "ПВ от 10%", "Trade-In в зачёт", "Маткапитал на первый взнос", "Отложенный платёж 60/40", "Средняя выгода 2,1 млн ₽"].map((t) => (
                  <span key={t} className="flex items-center gap-8 whitespace-nowrap font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-pine-200">
                    {t} <span className="text-amber-400">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ПРОГРАММЫ НЕДЕЛИ ================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Витрина недели</Kicker>
              <h2 className="font-display text-[clamp(22px,3vw,32px)] font-bold tracking-tight text-pine-950">Максимальная выгода прямо сейчас</h2>
            </div>
            <button onClick={goResults} className="flex items-center gap-2 rounded-md border border-pine-300 px-4 py-2.5 text-[13px] font-bold text-pine-800 transition-all hover:bg-pine-800 hover:text-paper active:scale-95">
              Все {activeOffers.length} программ <IcArrowR size={15} />
            </button>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topOffers.map((o, i) => (
            <Reveal key={o.id} delay={i * 110}>
              <OfferCard offer={o} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= ПОЧЕМУ РАССРОЧКА: живой расчёт ================= */}
      <section className="border-y border-line bg-pine-900 text-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-[2px] w-8 bg-amber-400" />
                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">Честная математика</span>
              </div>
              <h2 className="font-display text-[clamp(22px,3vw,32px)] font-bold leading-tight tracking-tight">
                Почему рассрочка 0% бьёт<br />ипотеку под 21%
              </h2>
              <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-pine-200">
                Застройщик субсидирует ставку из своей маржи — вы не платите банку ни процента. Разница видна на любом объекте из базы: откройте карточку, калькулятор посчитает за секунду.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { ic: <IcPercent size={20} />, t: "0–7%", d: "ставка рассрочки вместо 21% банковской" },
                  { ic: <IcClock size={20} />, t: "1 день", d: "одобрение без справок и банков" },
                  { ic: <IcKey size={20} />, t: "50/50", d: "объектов с ключами до оплаты" },
                ].map((x) => (
                  <div key={x.t} className="rounded-lg border border-pine-700 bg-pine-800/60 p-4 transition-transform duration-200 hover:-translate-y-1">
                    <div className="text-amber-300">{x.ic}</div>
                    <div className="mt-2 font-display text-[20px] font-bold">{x.t}</div>
                    <div className="mt-1 text-[12px] leading-snug text-pine-200">{x.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <CompareStrip />
          </Reveal>
        </div>
      </section>

      {/* ================= FAQ + подписка ================= */}
      <FaqBlock onAsk={() => window.dispatchEvent(new CustomEvent("open-ai"))} />
    </div>
  );
}

/* полоса сравнения выплат (анимированные бары) */
function CompareStrip() {
  const rows = [
    { l: "Рассрочка 0% · 24 мес", v: 13_200_000, w: 62, cls: "bg-amber-400" },
    { l: "Рассрочка 7% · 18 мес", v: 14_650_000, w: 70, cls: "bg-pine-400" },
    { l: "Рыночная ипотека 21% · 25 лет", v: 33_900_000, w: 100, cls: "bg-pine-700" },
  ];
  return (
    <div className="rounded-xl border border-pine-700 bg-pine-950/50 p-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="font-display text-[13px] font-semibold text-paper">Квартира за 13,2 млн ₽ · ПВ 20%</span>
        <span className="rounded bg-pine-800 px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide text-pine-300">итог к выплате</span>
      </div>
      <div className="space-y-4">
        {rows.map((r, i) => (
          <div key={r.l}>
            <div className="mb-1.5 flex items-baseline justify-between text-[12.5px]">
              <span className="text-pine-200">{r.l}</span>
              <span className="font-display font-bold text-paper tabular">{fmtMoney(r.v, true)}</span>
            </div>
            <div className="h-3.5 overflow-hidden rounded-full bg-pine-800">
              <div className={`anim-bar h-full rounded-full ${r.cls}`} style={{ width: `${r.w}%`, animationDelay: `${0.2 + i * 0.18}s` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3 rounded-lg bg-amber-400/10 px-4 py-3 ring-1 ring-amber-400/40">
        <IcSpark size={20} className="flex-none text-amber-300" />
        <p className="text-[13px] font-semibold leading-snug text-amber-300">Экономия до 20,7 млн ₽ на процентах — цена ещё одной студии</p>
      </div>
    </div>
  );
}

function FaqBlock({ onAsk }: { onAsk: () => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const items = [
    { q: "Чем рассрочка отличается от ипотеки?", a: "Рассрочку даёт сам застройщик: без банка, страховок и одобрений, ставка 0–7%. Ипотека — банковский кредит под рыночные 21% на 25–30 лет. Рассрочка короче, но дешевле на величину банковских процентов — в среднем 2–8 млн ₽ на квартирах комфорт-класса." },
    { q: "Что будет, если не успею выплатить в срок?", a: "В большинстве программ есть опция «переход на ипотеку» (can_switch_to_mortgage): остаток переводится в банковский кредит по льготной или рыночной ставке. Договор ДДУ по 214-ФЗ защищает ваши платежи в любом случае." },
    { q: "Как формируется цена «по программе»?", a: "Из базовой цены вычитается скидка застройщика по субсидированной программе. Иногда добавляется удорожание 2–5% за сам факт рассрочки — калькулятор всегда показывает полную стоимость и выгоду относительно рыночной ипотеки." },
    { q: "Можно ли сдать квартиру до полной оплаты?", a: "Да, если у программы есть условие «Ключи до оплаты»: после 50–70% выплат вы получаете ключи и можете жить или сдавать квартиру. Арендный поток частично гасит остаток рассрочки." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div>
            <Kicker>Разбор</Kicker>
            <h2 className="font-display text-[clamp(22px,3vw,32px)] font-bold tracking-tight text-pine-950">Вопросы, которые задают<br />перед сделкой</h2>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink-soft">
              Не нашли ответ — спросите у Домового: AI-агент отвечает на вопросы о программах, считает платежи и передаёт диалог менеджеру застройщика.
            </p>
            <button onClick={onAsk} className="mt-6 flex items-center gap-2.5 rounded-md bg-pine-800 px-5 py-3 text-[13.5px] font-bold text-paper transition-all hover:bg-pine-700 active:scale-95">
              <IcSpark size={18} className="text-amber-300" /> Спросить AI-агента
            </button>
          </div>
        </Reveal>
        <div className="space-y-3">
          {items.map((it, i) => (
            <Reveal key={it.q} delay={i * 90}>
              <div className={`overflow-hidden rounded-lg border transition-all duration-300 ${openIdx === i ? "border-pine-600 bg-card shadow-lift" : "border-line bg-card hover:border-pine-300"}`}>
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="font-display text-[14px] font-semibold text-ink">{it.q}</span>
                  <span className={`grid h-7 w-7 flex-none place-items-center rounded-full border transition-all duration-300 ${openIdx === i ? "rotate-45 border-pine-700 bg-pine-700 text-paper" : "border-line text-ink-faint"}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${openIdx === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-[13.5px] leading-relaxed text-ink-soft">{it.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
