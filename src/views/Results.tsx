import { useMemo, useState } from "react";
import { useStore, filterOffers, PROGRAM_OPTIONS, CONDITION_OPTIONS, INFRA_OPTIONS } from "../lib/store";
import { fmtMoney, fmtNum, programBenefit, roiStats, plural } from "../lib/finance";
import { DISTRICTS, GROUP_LABELS, PAYMENT_LABELS, type PaymentType, type TargetGroup } from "../data/offers";
import { IcArrowR, IcCompare, IcSearch, IcSort, IcX, RangeInput, offerEmblems } from "../components/ui";
import OfferCard from "../components/OfferCard";

type SortKey = "benefit" | "priceAsc" | "priceDesc" | "roi";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "benefit", label: "По выгоде" },
  { key: "priceAsc", label: "Дешевле" },
  { key: "priceDesc", label: "Дороже" },
  { key: "roi", label: "По ROI" },
];

const toggleIn = <T,>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export default function Results() {
  const store = useStore();
  const { offers, filters, setFilters, resetFilters, navigate, compare, toggleCompare, clearCompare, favorites, filterBlocks } = store;
  const [sort, setSort] = useState<SortKey>("benefit");
  const [favOnly, setFavOnly] = useState(false);
  const [query, setQuery] = useState("");

  const blocksOrdered = useMemo(
    () => [...filterBlocks].filter((b) => b.groups.includes(filters.group) && b.visible !== false).sort((a, b) => a.order - b.order),
    [filterBlocks, filters.group]
  );

  const result = useMemo(() => {
    let list = filterOffers(offers, filters);
    if (favOnly) list = list.filter((o) => favorites.includes(o.id));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((o) => `${o.project} ${o.developer} ${o.district} ${o.metro}`.toLowerCase().includes(q));
    }
    switch (sort) {
      case "benefit": list = [...list].sort((a, b) => programBenefit(b) - programBenefit(a)); break;
      case "priceAsc": list = [...list].sort((a, b) => a.programPrice - b.programPrice); break;
      case "priceDesc": list = [...list].sort((a, b) => b.programPrice - a.programPrice); break;
      case "roi": list = [...list].sort((a, b) => roiStats(b).roi - roiStats(a).roi); break;
    }
    return list;
  }, [offers, filters, sort, favOnly, query, favorites]);

  const activeCount =
    (filters.district !== "all" ? 1 : 0) + filters.rooms.length + filters.programs.length + filters.payments.length +
    filters.conditions.length + filters.infra.length + (filters.maxDown < 50 ? 1 : 0) + (filters.minTerm > 6 ? 1 : 0) +
    (filters.group === "investor" ? ((filters.rentMin > 0 ? 1 : 0) + (filters.maxPayback < 20 ? 1 : 0)) : 0);

  const compareOffers = offers.filter((o) => compare.includes(o.id));

  return (
    <div className="bg-blueprint min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* шапка выдачи */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-ink-faint">
              <button onClick={() => navigate({ name: "home" })} className="transition-colors hover:text-pine-700">Подбор</button>
              <IcArrowR size={12} /> <span className="text-pine-700">Результаты</span>
            </div>
            <h1 className="mt-1 font-display text-[clamp(20px,2.6vw,28px)] font-bold tracking-tight text-pine-950">
              {result.length > 0
                ? <>Найдено {result.length} {plural(result.length, "программа", "программы", "программ")}</>
                : "Совпадений нет"}
            </h1>
            <p className="mt-0.5 text-[13px] text-ink-soft">
              Профиль «{GROUP_LABELS[filters.group]}» · бюджет до {fmtMoney(filters.budget, true)} · фильтры применяются к базовой цене объекта
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <IcSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ЖК, застройщик, метро…"
                className="w-52 rounded-md border border-line bg-card py-2.5 pl-9 pr-3 text-[13px] outline-none transition-all placeholder:text-ink-faint focus:border-pine-600 focus:shadow-lift" />
            </div>
            <label className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-[12.5px] font-bold transition-all active:scale-95 ${favOnly ? "border-clay-600 bg-clay-100 text-clay-600" : "border-line bg-card text-ink-soft hover:border-clay-600"}`}>
              <input type="checkbox" className="hidden" checked={favOnly} onChange={() => setFavOnly(!favOnly)} />
              ♥ Избранное ({favorites.length})
            </label>
            <div className="flex items-center gap-1 rounded-md border border-line bg-card p-1">
              <IcSort size={14} className="ml-2 text-ink-faint" />
              {SORTS.map((s) => (
                <button key={s.key} onClick={() => setSort(s.key)}
                  className={`rounded px-2.5 py-1.5 text-[12px] font-bold transition-all ${sort === s.key ? "bg-pine-800 text-paper" : "text-ink-soft hover:text-pine-700"}`}>{s.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* ============ сайдбар ============ */}
          <aside className="lg:sticky lg:top-24 h-fit rounded-xl border border-line bg-card p-5 shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-[13px] font-bold uppercase tracking-wide text-ink">Фильтры</h2>
              {activeCount > 0 && (
                <button onClick={() => resetFilters()} className="flex items-center gap-1 text-[11.5px] font-bold text-clay-600 transition-opacity hover:opacity-70">
                  <IcX size={12} /> Сбросить ({activeCount})
                </button>
              )}
            </div>

            {/* профиль ЦГ */}
            <div className="mb-4">
              <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">Целевая группа</div>
              <div className="flex gap-1.5">
                {(Object.keys(GROUP_LABELS) as TargetGroup[]).map((g) => (
                  <button key={g} onClick={() => setFilters({ group: g, programs: [], conditions: [], payments: [], infra: [] })}
                    className={`flex-1 rounded-md px-1 py-2 text-[11px] font-bold leading-tight transition-all active:scale-95 ${filters.group === g ? "bg-pine-800 text-paper" : "border border-line text-ink-soft hover:border-pine-400"}`}>
                    {g === "family" ? "Семья" : g === "investor" ? "Инвестор" : "Индивидуал"}
                  </button>
                ))}
              </div>
            </div>

            {/* бюджет */}
            <div className="mb-4 rounded-lg bg-paper p-3">
              <div className="flex justify-between text-[11.5px] font-bold"><span className="text-ink-faint uppercase tracking-wide">Бюджет до</span><span className="text-pine-700 tabular">{fmtMoney(filters.budget, true)}</span></div>
              <RangeInput value={filters.budget} min={4_000_000} max={60_000_000} step={500_000} onChange={(v) => setFilters({ budget: v })} />
            </div>

            <div className="max-h-[52vh] space-y-4 overflow-y-auto thin-scroll pr-1">
              {blocksOrdered.map((b) => (
                <div key={b.id}>
                  {b.id === "geo" && (
                    <fieldset>
                      <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</legend>
                      <select value={filters.district} onChange={(e) => setFilters({ district: e.target.value as string })}
                        className="w-full rounded-md border border-line bg-card px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-pine-600">
                        <option value="all">Вся Москва</option>
                        {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </fieldset>
                  )}
                  {b.id === "rooms" && (
                    <fieldset>
                      <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</legend>
                      <div className="flex gap-1.5">
                        {[{ v: 0, l: "Ст" }, { v: 1, l: "1" }, { v: 2, l: "2" }, { v: 3, l: "3+" }].map((r) => (
                          <button key={r.v} onClick={() => setFilters({ rooms: toggleIn(filters.rooms, r.v) })}
                            className={`h-9 flex-1 rounded-md text-[12.5px] font-bold transition-all active:scale-95 ${filters.rooms.includes(r.v) ? "bg-pine-800 text-amber-300" : "border border-line text-ink-soft hover:border-pine-400"}`}>{r.l}</button>
                        ))}
                      </div>
                    </fieldset>
                  )}
                  {b.id === "programs" && (
                    <fieldset>
                      <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</legend>
                      {PROGRAM_OPTIONS.filter((p) =>
                        filters.group === "family" ? ["family", "it", "kids7", "pregnant", "matkap"].includes(p.key) :
                        filters.group === "investor" ? ["interest-free", "it"].includes(p.key) :
                        ["interest-free", "it", "matkap"].includes(p.key)
                      ).map((p) => (
                        <label key={p.key} className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 transition-colors hover:bg-mint">
                          <input type="checkbox" className="chk" checked={filters.programs.includes(p.key)} onChange={() => setFilters({ programs: toggleIn(filters.programs, p.key) })} />
                          <span className="text-[12.5px] font-semibold text-ink">{p.label}</span>
                        </label>
                      ))}
                    </fieldset>
                  )}
                  {b.id === "payment" && (
                    <fieldset>
                      <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</legend>
                      {(Object.keys(PAYMENT_LABELS) as PaymentType[]).map((t) => (
                        <label key={t} className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 transition-colors hover:bg-mint">
                          <input type="checkbox" className="chk" checked={filters.payments.includes(t)} onChange={() => setFilters({ payments: toggleIn(filters.payments, t) })} />
                          <span className="text-[12.5px] font-semibold text-ink">{PAYMENT_LABELS[t]}</span>
                        </label>
                      ))}
                    </fieldset>
                  )}
                  {b.id === "conditions" && (
                    <fieldset>
                      <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</legend>
                      {CONDITION_OPTIONS.filter((c) =>
                        filters.group === "family" ? ["keys", "switch", "it"].includes(c.key) :
                        filters.group === "investor" ? ["keys", "long", "it", "switch"].includes(c.key) : true
                      ).map((c) => (
                        <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 transition-colors hover:bg-mint">
                          <input type="checkbox" className="chk" checked={filters.conditions.includes(c.key)} onChange={() => setFilters({ conditions: toggleIn(filters.conditions, c.key) })} />
                          <span className="text-[12.5px] font-semibold text-ink">{c.label}</span>
                        </label>
                      ))}
                    </fieldset>
                  )}
                  {b.id === "term" && (
                    <div>
                      <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</div>
                      <div className="mb-2 rounded-md bg-paper p-2.5">
                        <div className="flex justify-between text-[11px] font-bold"><span className="text-ink-faint">Мин. ПВ до</span><span className="text-pine-700 tabular">{filters.maxDown}%</span></div>
                        <RangeInput value={filters.maxDown} min={0} max={50} step={5} onChange={(v) => setFilters({ maxDown: v })} />
                      </div>
                      <div className="rounded-md bg-paper p-2.5">
                        <div className="flex justify-between text-[11px] font-bold"><span className="text-ink-faint">Срок от</span><span className="text-pine-700 tabular">{filters.minTerm} мес</span></div>
                        <RangeInput value={filters.minTerm} min={6} max={48} step={6} onChange={(v) => setFilters({ minTerm: v })} />
                      </div>
                    </div>
                  )}
                  {b.id === "infra" && (
                    <fieldset>
                      <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</legend>
                      {INFRA_OPTIONS.map((i) => (
                        <label key={i.key} className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 transition-colors hover:bg-mint">
                          <input type="checkbox" className="chk" checked={filters.infra.includes(i.key)} onChange={() => setFilters({ infra: toggleIn(filters.infra, i.key) })} />
                          <span className="text-[12.5px] font-semibold text-ink">{i.label}</span>
                        </label>
                      ))}
                    </fieldset>
                  )}
                  {b.id === "invest" && (
                    <div>
                      <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink-faint">{b.label}</div>
                      <div className="mb-2 rounded-md bg-paper p-2.5">
                        <div className="flex justify-between text-[11px] font-bold"><span className="text-ink-faint">Окупаемость до</span><span className="text-pine-700 tabular">{filters.maxPayback} лет</span></div>
                        <RangeInput value={filters.maxPayback} min={5} max={20} onChange={(v) => setFilters({ maxPayback: v })} />
                      </div>
                      <div className="rounded-md bg-paper p-2.5">
                        <div className="flex justify-between text-[11px] font-bold"><span className="text-ink-faint">Аренда от</span><span className="text-pine-700 tabular">{filters.rentMin ? fmtNum(filters.rentMin / 1000) + " тыс ₽" : "любой"}</span></div>
                        <RangeInput value={filters.rentMin} min={0} max={150_000} step={10_000} onChange={(v) => setFilters({ rentMin: v })} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-100/60 p-3 text-[11.5px] leading-snug text-amber-700">
              <b>Как в ТЗ:</b> фильтры работают по базовой цене объекта (price_min), а не по витринной цене с ремонтом.
            </div>
          </aside>

          {/* ============ сетка ============ */}
          <div className="min-w-0">
            {result.length === 0 ? (
              <div className="grid place-items-center rounded-xl border-2 border-dashed border-line bg-card/60 px-6 py-20 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-pine-100 text-pine-700"><IcSearch size={28} /></div>
                  <h3 className="font-display text-[18px] font-bold text-ink">Под такие условия ничего не нашлось</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">Попробуйте расширить географию, увеличить бюджет на 10–15% или снять часть фильтров — так делает 7 из 10 пользователей на этом шаге.</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <button onClick={() => setFilters({ district: "all" })} className="rounded-md border border-pine-300 px-4 py-2.5 text-[13px] font-bold text-pine-800 transition-all hover:bg-pine-800 hover:text-paper active:scale-95">Расширить гео</button>
                    <button onClick={() => setFilters({ budget: Math.round(filters.budget * 1.15 / 100_000) * 100_000 })} className="rounded-md border border-pine-300 px-4 py-2.5 text-[13px] font-bold text-pine-800 transition-all hover:bg-pine-800 hover:text-paper active:scale-95">Бюджет +15%</button>
                    <button onClick={() => resetFilters()} className="rounded-md bg-amber-400 px-4 py-2.5 text-[13px] font-bold text-pine-950 transition-all hover:bg-amber-300 active:scale-95">Снять фильтры</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {result.map((o, i) => <OfferCard key={o.id} offer={o} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* трей сравнения */}
      {compareOffers.length > 0 && (
        <div className="anim-tray fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-full border border-pine-700 bg-pine-900 py-2 pl-3 pr-2 shadow-pop">
          <div className="flex items-center gap-1.5">
            {compareOffers.map((o) => (
              <button key={o.id} onClick={() => toggleCompare(o.id)} title={`Убрать: ${o.project}`}
                className="group relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border-2 border-pine-700 transition-transform hover:scale-105">
                <span className="absolute inset-0 grid place-items-center bg-pine-950/80 text-[9px] font-bold text-paper opacity-0 transition-opacity group-hover:opacity-100"><IcX size={12} /></span>
                <span className="font-display text-[10px] font-bold text-amber-300">{o.project.split(" ").pop()?.slice(0, 3)}</span>
              </button>
            ))}
          </div>
          <span className="text-[12.5px] font-semibold text-pine-200">{compareOffers.length} в сравнении</span>
          <button onClick={() => { store.track("comparisons"); navigate({ name: "compare" }); }}
            className="flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-[12.5px] font-bold text-pine-950 transition-all hover:bg-amber-300 active:scale-95">
            <IcCompare size={14} /> Сравнить
          </button>
          <button onClick={clearCompare} className="grid h-8 w-8 place-items-center rounded-full text-pine-300 transition-colors hover:text-paper"><IcX size={14} /></button>
        </div>
      )}
    </div>
  );
}
