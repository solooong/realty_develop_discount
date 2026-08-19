import { useEffect, useMemo, useState } from "react";
import { useStore, type LeadType } from "../lib/store";
import { calcScenario, fmtMoney, installmentTotal, programBenefit, roiStats, roomsLabel } from "../lib/finance";
import { BANKS, PAYMENT_LABELS } from "../data/offers";
import {
  FacadeArt, IcArrowL, IcCalc, IcCheck, IcChat, IcHeart, IcKey, IcMetro, IcPercent, IcPhone, IcPin, IcShield,
  IcClock, Modal, RangeInput, Reveal, offerEmblems, IcCompare, IcSpark,
} from "../components/ui";
import OfferCard from "../components/OfferCard";

export default function OfferDetail({ offerId }: { offerId: string }) {
  const store = useStore();
  const { offers, navigate, favorites, toggleFavorite, compare, toggleCompare, toast, addLead, track } = store;
  const offer = offers.find((o) => o.id === offerId);

  const [variant, setVariant] = useState(0);
  const [downPct, setDownPct] = useState<number>(offer ? Math.max(offer.minDownPaymentPercent, 20) : 20);
  const [term, setTerm] = useState<number>(offer?.termMonths ?? 24);
  const [bankIdx, setBankIdx] = useState(1);
  const [withMarkup, setWithMarkup] = useState(true);
  const [conv, setConv] = useState<null | { type: LeadType; title: string; needDate?: boolean }>(null);
  const [form, setForm] = useState({ name: "", phone: "", date: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => { track("detailViews"); }, [offerId]); // eslint-disable-line

  const calc = useMemo(() => {
    if (!offer) return null;
    const o = withMarkup ? offer : { ...offer, priceMarkupPercent: 0, objectMarkupFixed: 0 };
    const r = calcScenario(o, downPct, term, BANKS[bankIdx].rate);
    track("calcs");
    return r;
  }, [offer, downPct, term, bankIdx, withMarkup]); // eslint-disable-line

  if (!offer || !calc) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <p className="font-display text-lg font-bold text-ink">Объект не найден</p>
          <button onClick={() => navigate({ name: "results" })} className="mt-4 rounded-md bg-pine-800 px-5 py-2.5 text-sm font-bold text-paper">К результатам</button>
        </div>
      </div>
    );
  }

  const fav = favorites.includes(offer.id);
  const inCompare = compare.includes(offer.id);
  const benefit = programBenefit(offer);
  const { roi, paybackYears } = roiStats(offer);
  const total = installmentTotal(offer);
  const similar = offers.filter((o) => o.isActive && o.id !== offer.id && (o.district === offer.district || o.rooms === offer.rooms)).slice(0, 3);

  const submitLead = () => {
    if (!form.name.trim() || form.phone.replace(/\D/g, "").length < 10) { toast("Заполните имя и телефон", "warn"); return; }
    addLead({ offerId: offer.id, type: conv!.type, name: form.name, phone: form.phone, comment: conv?.needDate ? `Дата: ${form.date || "не указана"} · ${offer.project}` : offer.project });
    setSent(true);
  };

  return (
    <div className="bg-blueprint min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* хлебные крошки + действия */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[12.5px] font-semibold text-ink-faint">
            <button onClick={() => navigate({ name: "home" })} className="transition-colors hover:text-pine-700">Подбор</button> /
            <button onClick={() => navigate({ name: "results" })} className="transition-colors hover:text-pine-700">Результаты</button> /
            <span className="text-pine-700">{offer.project}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { toggleFavorite(offer.id); toast(fav ? "Убрано из избранного" : "В избранном"); }}
              className={`flex items-center gap-1.5 rounded-md border px-3.5 py-2 text-[12.5px] font-bold transition-all active:scale-95 ${fav ? "border-clay-600 bg-clay-100 text-clay-600" : "border-line bg-card text-ink-soft hover:border-clay-600 hover:text-clay-600"}`}>
              <IcHeart size={14} filled={fav} /> {fav ? "В избранном" : "В избранное"}
            </button>
            <button onClick={() => toggleCompare(offer.id)}
              className={`flex items-center gap-1.5 rounded-md border px-3.5 py-2 text-[12.5px] font-bold transition-all active:scale-95 ${inCompare ? "border-pine-700 bg-pine-800 text-paper" : "border-line bg-card text-ink-soft hover:border-pine-700 hover:text-pine-700"}`}>
              <IcCompare size={14} /> {inCompare ? "В сравнении" : "Сравнить"}
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          {/* ============ левая колонка ============ */}
          <div className="min-w-0 space-y-6">
            {/* галерея */}
            <Reveal>
              <div className="overflow-hidden rounded-xl border border-line shadow-lift">
                <div className="relative h-72 sm:h-80">
                  <FacadeArt offer={offer} variant={variant} className="h-full w-full" key={variant} />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                    {offerEmblems(offer).map((e) => <span key={e.label} className={`rounded px-2.5 py-1 text-[11.5px] font-bold ${e.cls}`}>{e.label}</span>)}
                  </div>
                  <span className="absolute right-4 top-4 rounded bg-pine-950/70 px-2.5 py-1 text-[11.5px] font-semibold text-mint">Сдача: {offer.readyQuarter}</span>
                </div>
                <div className="flex gap-2 border-t border-line bg-card p-3">
                  {[0, 1, 2, 3].map((v) => (
                    <button key={v} onClick={() => setVariant(v)} className={`h-14 w-20 overflow-hidden rounded-md border-2 transition-all ${variant === v ? "border-pine-700 shadow-lift" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <FacadeArt offer={offer} variant={v} className="h-full w-full" />
                    </button>
                  ))}
                  <div className="ml-auto self-center pr-2 text-right">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Генплан · рендеры</div>
                    <div className="text-[11px] text-ink-faint">4 из 18 изображений</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* заголовок + описание */}
            <Reveal>
              <div className="rounded-xl border border-line bg-card p-6 shadow-lift">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-faint">{offer.developer} · {offer.propertyType}</div>
                    <h1 className="mt-1 font-display text-[clamp(22px,3vw,30px)] font-bold tracking-tight text-pine-950">{offer.project}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-soft">
                      <span className="flex items-center gap-1.5"><IcPin size={14} className="text-pine-600" /> {offer.district}, {offer.address}</span>
                      <span className="flex items-center gap-1.5"><IcMetro size={14} className="text-pine-600" /> м. {offer.metro}</span>
                      <span>{roomsLabel(offer.rooms)} · {offer.areaMin}–{offer.areaMax} м²</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-pine-100 px-3.5 py-2 text-center">
                    <div className="text-[10.5px] font-bold uppercase tracking-wide text-pine-700">Динамика района</div>
                    <div className="font-display text-[18px] font-bold text-pine-800 tabular">+{offer.priceGrowthYear}% / год</div>
                  </div>
                </div>

                <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">{offer.description}</p>

                {/* таблица параметров рассрочки */}
                <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
                  {[
                    { ic: <IcPercent size={16} />, l: "Ставка", v: offer.interestRatePercent === 0 ? "0%" : `${offer.interestRatePercent}%` },
                    { ic: <IcClock size={16} />, l: "Срок", v: `${offer.termMonths} мес` },
                    { ic: <IcCalc size={16} />, l: "Платёж", v: PAYMENT_LABELS[offer.paymentType].split(" ")[0] },
                    { ic: <IcKey size={16} />, l: "ПВ от", v: `${offer.minDownPaymentPercent}%` },
                  ].map((x) => (
                    <div key={x.l} className="bg-card p-3.5">
                      <div className="flex items-center gap-1.5 text-pine-600">{x.ic}<span className="text-[10.5px] font-bold uppercase tracking-wide text-ink-faint">{x.l}</span></div>
                      <div className="mt-1 font-display text-[16px] font-bold text-ink">{x.v}</div>
                    </div>
                  ))}
                </div>

                {(offer.priceMarkupPercent > 0 || offer.objectMarkupFixed > 0) && (
                  <div className="mt-3 rounded-md border border-amber-300 bg-amber-100/60 px-4 py-2.5 text-[12.5px] text-amber-700">
                    <b>Удорожание при рассрочке:</b> {offer.priceMarkupPercent > 0 && `+${offer.priceMarkupPercent}% к цене`}{offer.priceMarkupPercent > 0 && offer.objectMarkupFixed > 0 && " и "}{offer.objectMarkupFixed > 0 && `+${fmtMoney(offer.objectMarkupFixed)} фиксом`}. Полная стоимость уже учтена в калькуляторе →
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {offer.infrastructure.map((i) => (
                    <span key={i} className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-semibold text-ink-soft">
                      <IcCheck size={12} className="text-pine-600" /> {i}
                    </span>
                  ))}
                  <span className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-semibold text-ink-soft">
                    <IcShield size={12} className="text-pine-600" /> 214-ФЗ · эскроу
                  </span>
                </div>
              </div>
            </Reveal>

            {/* миникарта */}
            <Reveal>
              <div className="overflow-hidden rounded-xl border border-line bg-card shadow-lift">
                <MiniMap offer={offer} />
                <div className="flex items-center justify-between border-t border-line px-5 py-3">
                  <span className="text-[12.5px] text-ink-soft">До м. {offer.metro} — {8 + (offer.id.length * 3) % 9} мин пешком · координаты {offer.lat.toFixed(3)}, {offer.lng.toFixed(3)}</span>
                  <span className="rounded bg-mint px-2.5 py-1 text-[11px] font-bold text-pine-700">Яндекс.Карты в релизе</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ============ правая колонка: калькулятор ============ */}
          <div className="space-y-5 lg:sticky lg:top-24 h-fit">
            <Reveal delay={120}>
              <div className="overflow-hidden rounded-xl border border-line bg-card shadow-pop">
                <div className="flex items-center justify-between bg-pine-900 px-5 py-3.5">
                  <span className="font-display text-[13px] font-bold text-paper">Калькулятор сценария</span>
                  <span className="text-[11px] font-semibold text-pine-300">POST /api/v1/calculate · демо</span>
                </div>

                <div className="space-y-4 p-5">
                  {/* цены */}
                  <div className="space-y-1 text-[13px]">
                    <div className="flex justify-between text-ink-faint"><span>С ремонтом</span><s className="tabular">{fmtMoney(offer.priceWithRepair)}</s></div>
                    <div className="flex justify-between text-ink-faint"><span>Базовая цена</span><span className="tabular">{fmtMoney(offer.basePrice)}</span></div>
                    <div className="flex items-baseline justify-between border-t border-line-soft pt-1.5">
                      <span className="font-bold text-pine-700">По программе «{offer.programName.replace(/[«»]/g, "")}»</span>
                      <span className="font-display text-[22px] font-bold text-ink tabular">{fmtMoney(offer.programPrice)}</span>
                    </div>
                    {benefit > 0 && (
                      <div className="flex justify-between text-[12.5px] font-bold text-pine-600"><span>Скидка застройщика</span><span className="tabular">− {fmtMoney(benefit)}</span></div>
                    )}
                  </div>

                  {/* слайдеры */}
                  <div className="rounded-lg bg-paper p-3.5">
                    <div className="flex justify-between text-[11.5px] font-bold"><span className="uppercase tracking-wide text-ink-faint">Первый взнос</span><span className="text-pine-700 tabular">{downPct}% · {fmtMoney((total * downPct) / 100, true)}</span></div>
                    <RangeInput value={downPct} min={offer.minDownPaymentPercent} max={60} step={5} onChange={setDownPct} />
                    <div className="mt-1 flex justify-between text-[11.5px] font-bold"><span className="uppercase tracking-wide text-ink-faint">Срок рассрочки</span><span className="text-pine-700 tabular">{term} мес</span></div>
                    <RangeInput value={term} min={6} max={Math.max(offer.termMonths, 48)} step={3} onChange={setTerm} />
                  </div>

                  {(offer.priceMarkupPercent > 0 || offer.objectMarkupFixed > 0) && (
                    <label className="flex cursor-pointer items-center justify-between rounded-md border border-line px-3 py-2">
                      <span className="text-[12px] font-semibold text-ink-soft">Учитывать удорожание {offer.priceMarkupPercent > 0 ? `+${offer.priceMarkupPercent}%` : ""}{offer.objectMarkupFixed > 0 ? ` +${fmtMoney(offer.objectMarkupFixed, true)}` : ""}</span>
                      <input type="checkbox" className="chk" checked={withMarkup} onChange={() => setWithMarkup(!withMarkup)} />
                    </label>
                  )}

                  {/* результат */}
                  <div className="rounded-lg border-2 border-pine-700 bg-mint p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-pine-700">{offer.paymentType === "quarterly" ? "Платёж в квартал" : "Ежемесячный платёж"}</div>
                    <div className="font-display text-[30px] font-bold leading-tight text-pine-950 tabular">
                      {fmtMoney(offer.paymentType === "quarterly" ? calc.monthly * 3 : calc.monthly)}
                      <span className="text-[15px] font-semibold text-ink-soft"> / {offer.paymentType === "quarterly" ? "квартал" : "мес"}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px] text-pine-900">
                      <span>Итого к выплате</span><span className="text-right font-bold tabular">{fmtMoney(calc.total, true)}</span>
                      <span>Переплата</span><span className="text-right font-bold tabular">{fmtMoney(calc.overpayment, true)}</span>
                      <span>ПВ ({downPct}%)</span><span className="text-right font-bold tabular">{fmtMoney(calc.down, true)}</span>
                    </div>
                  </div>

                  {/* сравнение с ипотекой */}
                  <div className="rounded-lg border border-line p-3.5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">Против рыночной ипотеки</span>
                      <select value={bankIdx} onChange={(e) => setBankIdx(Number(e.target.value))} className="rounded border border-line bg-card px-2 py-1 text-[11.5px] font-bold outline-none">
                        {BANKS.map((b, i) => <option key={b.name} value={i}>{b.name} · {b.rate}%</option>)}
                      </select>
                    </div>
                    {/* бары */}
                    {[
                      { l: "Рассрочка", v: calc.total, cls: "bg-pine-600" },
                      { l: `${BANKS[bankIdx].name}, 25 лет`, v: calc.mortgageTotal, cls: "bg-clay-600/80" },
                    ].map((r) => (
                      <div key={r.l} className="mb-2 last:mb-0">
                        <div className="flex justify-between text-[11.5px]"><span className="font-semibold text-ink-soft">{r.l}</span><span className="font-bold tabular">{fmtMoney(r.v, true)}</span></div>
                        <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-line-soft">
                          <div className={`h-full rounded-full ${r.cls} transition-all duration-500`} style={{ width: `${Math.max(8, (r.v / Math.max(calc.total, calc.mortgageTotal)) * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                    <div className={`mt-3 flex items-center gap-2.5 rounded-md px-3 py-2.5 ${calc.benefit > 0 ? "bg-amber-100 text-amber-700" : "bg-clay-100 text-clay-600"}`}>
                      <IcSpark size={18} className="flex-none" />
                      <span className="text-[13px] font-bold leading-snug">
                        {calc.benefit > 0 ? <>Ваша выгода: {fmtMoney(calc.benefit, true)} против ипотеки</> : <>Ипотека выгоднее на {fmtMoney(Math.abs(calc.benefit), true)} — попробуйте больший срок</>}
                      </span>
                    </div>
                  </div>

                  {/* конверсии */}
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setConv({ type: "visit", title: "Запись на просмотр", needDate: true }); setSent(false); setForm({ name: "", phone: "", date: "" }); }}
                      className="col-span-2 flex items-center justify-center gap-2 rounded-md bg-pine-800 py-3 text-[13.5px] font-bold text-paper transition-all hover:bg-pine-700 active:scale-[0.98]">
                      <IcPin size={16} /> Записаться на просмотр
                    </button>
                    <button onClick={() => { setConv({ type: "lead", title: "Бронирование", needDate: false }); setSent(false); setForm({ name: "", phone: "", date: "" }); }}
                      className="flex items-center justify-center gap-2 rounded-md bg-amber-400 py-2.5 text-[13px] font-bold text-pine-950 transition-all hover:bg-amber-300 active:scale-[0.98]">
                      Забронировать
                    </button>
                    <button onClick={() => { addLead({ offerId: offer.id, type: "call", name: "Клик по телефону", phone: "—" }); toast("Телефон партнёра: +7 495 120-38-38"); }}
                      className="flex items-center justify-center gap-2 rounded-md border border-line py-2.5 text-[13px] font-bold text-ink-soft transition-all hover:border-pine-600 hover:text-pine-700 active:scale-[0.98]">
                      <IcPhone size={15} /> Позвонить
                    </button>
                    <button onClick={() => { addLead({ offerId: offer.id, type: "whatsapp", name: "МАКС/WhatsApp", phone: "—" }); toast("Чат МАКС откроется в релизе"); }}
                      className="flex items-center justify-center gap-2 rounded-md border border-line py-2.5 text-[13px] font-bold text-ink-soft transition-all hover:border-pine-600 hover:text-pine-700 active:scale-[0.98]">
                      <IcChat size={15} /> Написать в МАКС
                    </button>
                    <button onClick={() => { setConv({ type: "subscription", title: "Подписка на изменения цены", needDate: false }); setSent(false); setForm({ name: "", phone: "", date: "" }); }}
                      className="flex items-center justify-center gap-2 rounded-md border border-line py-2.5 text-[13px] font-bold text-ink-soft transition-all hover:border-pine-600 hover:text-pine-700 active:scale-[0.98]">
                      Следить за ценой
                    </button>
                  </div>
                  <p className="text-center text-[11px] text-ink-faint">Конверсия без регистрации · заявка уходит застройщику напрямую</p>
                </div>
              </div>
            </Reveal>

            {/* инвест-блок */}
            <Reveal delay={200}>
              <div className="rounded-xl border border-line bg-card p-5 shadow-lift">
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-pine-100 text-pine-700"><IcPercent size={16} /></span>
                  <span className="font-display text-[13px] font-bold text-ink">Инвестору</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-md bg-paper p-2.5">
                    <div className="font-display text-[17px] font-bold text-pine-800 tabular">{roi.toFixed(1)}%</div>
                    <div className="text-[10.5px] text-ink-faint">ROI аренды</div>
                  </div>
                  <div className="rounded-md bg-paper p-2.5">
                    <div className="font-display text-[17px] font-bold text-pine-800 tabular">{paybackYears.toFixed(1)} л.</div>
                    <div className="text-[10.5px] text-ink-faint">окупаемость</div>
                  </div>
                  <div className="rounded-md bg-paper p-2.5">
                    <div className="font-display text-[17px] font-bold text-pine-800 tabular">{fmtMoney(offer.rentEstimate / 1000)}к</div>
                    <div className="text-[10.5px] text-ink-faint">аренда ₽/мес</div>
                  </div>
                </div>
                {offer.hasKeyEarlyRelease && (
                  <p className="mt-3 rounded-md bg-mint px-3 py-2 text-[12px] font-semibold text-pine-800">Ключи до оплаты: аренда может гасить остаток рассрочки уже через {Math.ceil(offer.termMonths * 0.4)} мес.</p>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        {/* похожие */}
        {similar.length > 0 && (
          <section className="mt-14">
            <Reveal>
              <div className="mb-5 flex items-end justify-between">
                <h2 className="font-display text-[20px] font-bold tracking-tight text-pine-950">Похожие программы рядом</h2>
                <button onClick={() => navigate({ name: "results" })} className="text-[13px] font-bold text-pine-700 underline-offset-4 hover:underline">Все результаты →</button>
              </div>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((o, i) => <OfferCard key={o.id} offer={o} index={i} />)}
            </div>
          </section>
        )}
      </div>

      {/* модалка конверсии */}
      <Modal open={!!conv} onClose={() => setConv(null)}>
        {conv && (
          <div className="p-6">
            {!sent ? (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-[18px] font-bold text-ink">{conv.title}</h3>
                    <p className="mt-1 text-[13px] text-ink-soft">{offer.project} · {offer.developer} · {roomsLabel(offer.rooms)}, {offer.areaMin}–{offer.areaMax} м²</p>
                  </div>
                  <button onClick={() => setConv(null)} className="text-ink-faint transition-colors hover:text-ink">✕</button>
                </div>
                <div className="mt-5 space-y-3">
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ваше имя"
                    className="w-full rounded-md border border-line bg-paper px-3.5 py-2.5 text-[13.5px] outline-none focus:border-pine-600" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+7 (___) ___-__-__" inputMode="tel"
                    className="w-full rounded-md border border-line bg-paper px-3.5 py-2.5 text-[13.5px] outline-none focus:border-pine-600" />
                  {conv.needDate && (
                    <div className="flex gap-2">
                      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="flex-1 rounded-md border border-line bg-paper px-3.5 py-2.5 text-[13.5px] outline-none focus:border-pine-600" />
                      <select className="rounded-md border border-line bg-paper px-3 py-2.5 text-[13.5px] font-semibold outline-none">
                        <option>10:00</option><option>12:00</option><option>15:00</option><option>18:00</option>
                      </select>
                    </div>
                  )}
                  <button onClick={submitLead} className="w-full rounded-md bg-pine-800 py-3 text-[14px] font-bold text-paper transition-all hover:bg-pine-700 active:scale-[0.99]">
                    {conv.type === "subscription" ? "Подписаться" : conv.type === "lead" ? "Забронировать на 3 дня" : "Отправить заявку"}
                  </button>
                  <p className="text-center text-[11px] leading-snug text-ink-faint">Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Регистрация не требуется.</p>
                </div>
              </>
            ) : (
              <div className="py-6 text-center anim-scale-in">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-pine-100 text-pine-700"><IcCheck size={30} /></div>
                <h3 className="mt-4 font-display text-[18px] font-bold text-ink">Заявка отправлена</h3>
                <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-ink-soft">
                  Менеджер {offer.developer} свяжется с вами в течение 15 минут. Запись в CRM: тип «{conv.type}», объект {offer.project}.
                </p>
                <button onClick={() => setConv(null)} className="mt-5 rounded-md bg-pine-800 px-6 py-2.5 text-[13px] font-bold text-paper transition-all hover:bg-pine-700">Готово</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

/* стилизованная миникарта */
function MiniMap({ offer }: { offer: { lat: number; lng: number; metro: string; district: string; id: string } }) {
  const seed = offer.id.charCodeAt(1) || 5;
  return (
    <svg viewBox="0 0 600 220" className="h-44 w-full sm:h-52" aria-hidden>
      <rect width="600" height="220" fill="#E8EFE6" />
      {[...Array(8)].map((_, i) => <rect key={`b${i}`} x={20 + i * 72 + (i % 3) * 8} y={i % 2 ? 24 : 130} width={46} height={i % 2 ? 66 : 60} rx="3" fill="#CBD8C6" />)}
      <path d={`M0 ${96 + (seed % 20)} C 150 ${80 + seed}, 320 ${130 - seed}, 600 ${100 + (seed % 14)}`} stroke="#A9C3E8" strokeWidth="14" fill="none" opacity="0.7" />
      <path d="M60 220 L 210 0" stroke="#F1F4EE" strokeWidth="10" opacity="0.9" />
      <path d="M340 220 L 470 0" stroke="#F1F4EE" strokeWidth="8" opacity="0.9" />
      <path d="M0 60 L 600 40" stroke="#F1F4EE" strokeWidth="6" opacity="0.7" />
      {/* метро */}
      <g transform="translate(452 148)">
        <circle r="15" fill="#0E3B2E" />
        <text y="5.5" textAnchor="middle" fontSize="15" fontWeight="800" fill="#FFBE3D" fontFamily="Golos Text">М</text>
        <text y="34" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#13251C" fontFamily="Golos Text">{offer.metro}</text>
      </g>
      {/* ЖК */}
      <g transform="translate(280 96)">
        <circle r="26" fill="#F2A81D" opacity="0.25">
          <animate attributeName="r" values="18;30;18" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle r="11" fill="#0E3B2E" stroke="#F1F4EE" strokeWidth="3" />
        <text y="-20" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0E3B2E" fontFamily="Unbounded">ЖК</text>
      </g>
      <g opacity="0.55">
        {[[90, 170], [180, 60], [520, 70], [540, 190], [120, 110]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="7" fill="#7FC3A3" /><circle r="3" fill="#23906A" />
          </g>
        ))}
      </g>
    </svg>
  );
}
