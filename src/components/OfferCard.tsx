import { useStore } from "../lib/store";
import { fmtMoney, programBenefit, roiStats, roomsLabel } from "../lib/finance";
import { PAYMENT_LABELS, type Offer } from "../data/offers";
import { FacadeArt, IcCompare, IcHeart, IcMetro, IcPin, offerEmblems, IcArrowR } from "./ui";

export default function OfferCard({ offer, index = 0 }: { offer: Offer; index?: number }) {
  const { navigate, favorites, toggleFavorite, compare, toggleCompare, toast } = useStore();
  const fav = favorites.includes(offer.id);
  const inCompare = compare.includes(offer.id);
  const benefit = programBenefit(offer);
  const { roi } = roiStats(offer);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-card shadow-lift transition-all duration-300 hover:-translate-y-1.5 hover:shadow-pop anim-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      {/* фасад */}
      <div className="relative h-44 overflow-hidden cursor-pointer" onClick={() => navigate({ name: "offer", offerId: offer.id })}>
        <FacadeArt offer={offer} className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 pr-14">
          {offerEmblems(offer).slice(0, 3).map((e) => (
            <span key={e.label} className={`rounded px-2 py-0.5 text-[11px] font-bold tracking-wide ${e.cls}`}>{e.label}</span>
          ))}
        </div>
        <span className="absolute right-3 top-3 rounded bg-pine-950/70 px-2 py-0.5 text-[11px] font-semibold text-mint backdrop-blur-sm">
          {offer.readyQuarter}
        </span>
        {benefit > 0 && (
          <span className="absolute bottom-3 left-3 rounded bg-amber-400 px-2.5 py-1 font-display text-[12px] font-bold text-pine-950 shadow">
            выгода {fmtMoney(benefit, true)}
          </span>
        )}
      </div>

      {/* действия поверх */}
      <div className="absolute right-3 top-[132px] flex gap-1.5">
        <button
          aria-label="В избранное"
          onClick={() => { toggleFavorite(offer.id); toast(fav ? "Убрано из избранного" : "Добавлено в избранное"); }}
          className={`grid h-8 w-8 place-items-center rounded-full border transition-all duration-200 active:scale-90 ${fav ? "border-clay-600 bg-clay-600 text-card" : "border-line bg-card/95 text-ink-soft hover:text-clay-600 hover:border-clay-600"}`}
        >
          <IcHeart size={15} filled={fav} />
        </button>
        <button
          aria-label="В сравнение"
          onClick={() => toggleCompare(offer.id)}
          className={`grid h-8 w-8 place-items-center rounded-full border transition-all duration-200 active:scale-90 ${inCompare ? "border-pine-700 bg-pine-700 text-card" : "border-line bg-card/95 text-ink-soft hover:text-pine-700 hover:border-pine-700"}`}
        >
          <IcCompare size={15} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{offer.developer}</span>
          <span className="text-[11px] font-bold text-pine-600 tabular">ROI {roi.toFixed(1)}%</span>
        </div>
        <h3 className="font-display text-[15px] font-semibold leading-snug text-ink cursor-pointer hover:text-pine-700 transition-colors"
          onClick={() => navigate({ name: "offer", offerId: offer.id })}>
          {offer.project}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-soft">
          <span className="flex items-center gap-1"><IcPin size={12} /> {offer.district}</span>
          <span className="flex items-center gap-1"><IcMetro size={12} className="text-pine-600" /> м. {offer.metro}</span>
          <span>{roomsLabel(offer.rooms)} · {offer.areaMin}–{offer.areaMax} м²</span>
        </div>

        <p className="mt-2 text-[12.5px] leading-snug text-ink-soft">
          {offer.interestRatePercent === 0 ? "Беспроцентная рассрочка" : `Рассрочка ${offer.interestRatePercent}% годовых`} на {offer.termMonths} мес · ПВ от {offer.minDownPaymentPercent}% · {PAYMENT_LABELS[offer.paymentType].toLowerCase()}
        </p>

        <div className="mt-3 border-t border-line-soft pt-3">
          <div className="flex items-baseline justify-between text-[12px] text-ink-faint">
            <span>С ремонтом</span>
            <s className="tabular">{fmtMoney(offer.priceWithRepair)}</s>
          </div>
          <div className="flex items-baseline justify-between text-[12px] text-ink-faint">
            <span>Базовая цена</span>
            <span className="tabular">{fmtMoney(offer.basePrice)}</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-[12.5px] font-semibold text-pine-700">По программе</span>
            <span className="font-display text-[19px] font-bold text-ink tabular">{fmtMoney(offer.programPrice)}</span>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => navigate({ name: "offer", offerId: offer.id })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-pine-800 px-3 py-2.5 text-[13px] font-bold text-paper transition-all duration-200 hover:bg-pine-700 active:scale-[0.98]"
          >
            Подробнее <IcArrowR size={14} />
          </button>
          <button
            onClick={() => toggleCompare(offer.id)}
            className={`rounded-md border px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 active:scale-[0.98] ${inCompare ? "border-amber-500 bg-amber-100 text-amber-700" : "border-line text-ink-soft hover:border-pine-600 hover:text-pine-700"}`}
          >
            Сравнить
          </button>
        </div>
      </div>
    </article>
  );
}
