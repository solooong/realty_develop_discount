import { StoreProvider, useStore } from "./lib/store";
import Wizard from "./views/Wizard";
import Results from "./views/Results";
import OfferDetail from "./views/OfferDetail";
import Compare from "./views/Compare";
import Admin from "./views/Admin";
import AiAgent from "./components/AiAgent";
import { IcCheck, IcCompare, IcGear, IcHeart, IcLogo, IcX, IcShield, IcFeed, IcSpark } from "./components/ui";

function Shell() {
  const store = useStore();
  const { view, navigate, compare, favorites, toasts } = store;
  const isAdmin = view.name === "admin";

  return (
    <div className="noise-overlay min-h-screen bg-paper font-body text-ink">
      {!isAdmin && <PortalHeader />}

      {view.name === "home" && <Wizard />}
      {view.name === "results" && <Results />}
      {view.name === "offer" && view.offerId && <OfferDetail offerId={view.offerId} />}
      {view.name === "compare" && <Compare />}
      {view.name === "admin" && <Admin />}

      {!isAdmin && <PortalFooter />}
      {!isAdmin && <AiAgent />}

      {/* тосты */}
      <div className="pointer-events-none fixed left-1/2 top-5 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`anim-scale-in pointer-events-auto flex items-center gap-2.5 rounded-lg border px-4 py-3 shadow-pop ${t.tone === "ok" ? "border-pine-200 bg-pine-900 text-paper" : "border-amber-400 bg-amber-100 text-amber-700"}`}>
            {t.tone === "ok" ? <IcCheck size={16} className="text-amber-300" /> : <IcX size={16} />}
            <span className="text-[13px] font-semibold">{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortalHeader() {
  const { view, navigate, compare, favorites, offers } = useStore();
  const activeOffers = offers.filter((o) => o.isActive).length;
  const NavBtn = ({ label, active, onClick, badge }: { label: string; active: boolean; onClick: () => void; badge?: number }) => (
    <button onClick={onClick}
      className={`relative rounded-md px-3.5 py-2 text-[13px] font-bold transition-all duration-200 active:scale-95 ${active ? "bg-pine-800 text-paper" : "text-ink-soft hover:bg-mint hover:text-pine-800"}`}>
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-amber-400 px-1 font-display text-[9.5px] font-bold text-pine-950 anim-scale-in">{badge}</span>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-[65] border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button onClick={() => navigate({ name: "home" })} className="flex items-center gap-2.5 transition-transform active:scale-95">
          <IcLogo size={34} className="text-pine-800" />
          <div className="text-left leading-none">
            <div className="font-display text-[15px] font-bold tracking-tight text-pine-950">Рассрочка·Дом</div>
            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint">субсидии застройщиков</div>
          </div>
        </button>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          <NavBtn label="Подбор" active={view.name === "home"} onClick={() => navigate({ name: "home" })} />
          <NavBtn label="Результаты" active={view.name === "results" || view.name === "offer"} onClick={() => navigate({ name: "results" })} />
          <NavBtn label="Сравнение" active={view.name === "compare"} onClick={() => navigate({ name: "compare" })} badge={compare.length} />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="mr-1 hidden items-center gap-1.5 rounded-full border border-pine-200 bg-mint px-3 py-1.5 text-[11px] font-bold text-pine-800 lg:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pine-500" /> {activeOffers} программ онлайн
          </span>
          <button onClick={() => navigate({ name: "results" })} aria-label="Избранное"
            className="relative grid h-10 w-10 place-items-center rounded-md border border-line bg-card text-ink-soft transition-all hover:border-clay-600 hover:text-clay-600 active:scale-90">
            <IcHeart size={17} />
            {favorites.length > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-clay-600 px-1 font-display text-[9.5px] font-bold text-card">{favorites.length}</span>}
          </button>
          <button onClick={() => navigate({ name: "admin" })}
            className="flex items-center gap-2 rounded-md border border-line bg-card px-3.5 py-2.5 text-[12.5px] font-bold text-ink-soft transition-all hover:border-pine-600 hover:text-pine-800 active:scale-95">
            <IcGear size={15} /> <span className="hidden sm:inline">Партнёрам</span>
          </button>
          {/* мобильная навигация */}
          <button onClick={() => navigate({ name: "compare" })} className="relative grid h-10 w-10 place-items-center rounded-md border border-line bg-card text-ink-soft md:hidden" aria-label="Сравнение">
            <IcCompare size={17} />
            {compare.length > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-amber-400 px-1 font-display text-[9.5px] font-bold text-pine-950">{compare.length}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

function PortalFooter() {
  const { navigate, offers, toast } = useStore();
  const devs = [...new Set(offers.map((o) => o.developer))];
  return (
    <footer className="border-t border-pine-900 bg-pine-950 text-pine-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <IcLogo size={34} className="text-pine-800" />
            <div className="font-display text-[16px] font-bold text-paper">Рассрочка·Дом</div>
          </div>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-pine-300">
            Портал подбора новостроек по субсидированным программам застройщиков: рассрочки 0–7%, семейная и IT-ипотека, ключи до оплаты. Конверсия без регистрации — заявка уходит партнёру напрямую.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-[11.5px] font-semibold text-pine-400">
            <span className="flex items-center gap-1.5"><IcShield size={14} /> 214-ФЗ · эскроу</span>
            <span className="flex items-center gap-1.5"><IcFeed size={14} /> Фиды Яндекс.Недвижимости</span>
            <span className="flex items-center gap-1.5"><IcSpark size={14} /> AI-агент Домовой</span>
          </div>
        </div>
        <div>
          <div className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-pine-400">Покупателям</div>
          <ul className="mt-4 space-y-2.5 text-[13px] font-semibold">
            <li><button onClick={() => navigate({ name: "home" })} className="transition-colors hover:text-amber-300">Подбор по профилю</button></li>
            <li><button onClick={() => navigate({ name: "results" })} className="transition-colors hover:text-amber-300">Все программы</button></li>
            <li><button onClick={() => navigate({ name: "compare" })} className="transition-colors hover:text-amber-300">Сравнение сценариев</button></li>
            <li><button onClick={() => window.dispatchEvent(new CustomEvent("open-ai"))} className="transition-colors hover:text-amber-300">Спросить Домового</button></li>
          </ul>
        </div>
        <div>
          <div className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-pine-400">Партнёрам</div>
          <ul className="mt-4 space-y-2.5 text-[13px] font-semibold">
            <li><button onClick={() => navigate({ name: "admin" })} className="transition-colors hover:text-amber-300">Вход в панель (Django Admin)</button></li>
            <li><button onClick={() => { navigate({ name: "admin" }); toast("Раздел «Фиды» — синхронизация XML"); }} className="transition-colors hover:text-amber-300">Подключить XML-фид</button></li>
            <li><button onClick={() => navigate({ name: "admin" })} className="transition-colors hover:text-amber-300">Управление фильтрами</button></li>
            <li><button onClick={() => navigate({ name: "admin" })} className="transition-colors hover:text-amber-300">Заявки и конверсии</button></li>
          </ul>
        </div>
        <div>
          <div className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-pine-400">Застройщики в базе</div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {devs.slice(0, 10).map((d) => (
              <span key={d} className="rounded border border-pine-800 bg-pine-900 px-2.5 py-1 text-[11px] font-bold text-pine-300">{d}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-pine-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-[11.5px] text-pine-500 sm:px-6">
          <span>© 2026 Рассрочка·Дом · интерактивный прототип по документации User Flow v1.4 — данные демонстрационные</span>
          <span className="font-semibold">Ставка ЦБ в расчётах: 21% · API банков — в релизе</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
