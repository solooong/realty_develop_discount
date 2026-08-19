import { useMemo, useRef, useState } from "react";
import { useStore, type Lead } from "../lib/store";
import { fmtMoney, fmtNum, programBenefit } from "../lib/finance";
import { DEVELOPERS, PAYMENT_LABELS, type FeedStatus, type Offer, type PaymentType, type TargetGroup } from "../data/offers";
import {
  IcCalc, IcChat, IcCheck, IcDoc, IcEdit, IcEye, IcFeed, IcGear, IcHouse, IcLogo, IcPercent, IcPlus, IcRefresh,
  IcSearch, IcShield, IcSpark, IcTrash, IcX, Modal, Toggle, FacadeArt,
} from "../components/ui";

type Section = "dash" | "offers" | "feeds" | "filters" | "leads" | "ai";

const NAV: { key: Section; label: string; icon: (s?: number) => JSX.Element }[] = [
  { key: "dash", label: "Дашборд", icon: (s) => <IcHouse size={s} /> },
  { key: "offers", label: "Предложения · DeveloperOffers", icon: (s) => <IcDoc size={s} /> },
  { key: "feeds", label: "Фиды застройщиков", icon: (s) => <IcFeed size={s} /> },
  { key: "filters", label: "Главная и фильтры", icon: (s) => <IcGear size={s} /> },
  { key: "leads", label: "Заявки · UserConversions", icon: (s) => <IcChat size={s} /> },
  { key: "ai", label: "AI-агент «Домовой»", icon: (s) => <IcSpark size={s} /> },
];

const FEED_TAGS: { tag: string; field: string; note: string }[] = [
  { tag: "<property-type>", field: "property_type", note: "жилая/коммерческая → ENUM" },
  { tag: "<category>", field: "property_type", note: "квартира/студия/апартаменты" },
  { tag: "<price><value>", field: "price_min", note: "базовая цена — основа фильтров" },
  { tag: "<rooms>", field: "rooms", note: "0 → студия" },
  { tag: "<area><total>", field: "area_total", note: "м², DECIMAL" },
  { tag: "<metro>", field: "metro_stations", note: "JSONB, может быть несколько" },
  { tag: "<building><ready-quarter>", field: "ready_quarter", note: "срок сдачи" },
  { tag: "<sales-phone>", field: "sales_phone", note: "телефон для конверсий" },
  { tag: "<images>", field: "images", note: "JSONB-массив URL" },
];

export default function Admin() {
  const store = useStore();
  const { adminAuthed, setAdminAuthed, navigate } = store;
  const [section, setSection] = useState<Section>("dash");
  const [login, setLogin] = useState({ user: "admin", pass: "" });
  const [loginErr, setLoginErr] = useState(false);

  if (!adminAuthed) {
    return (
      <div className="bg-blueprint grid min-h-screen place-items-center px-4">
        <div className="w-full max-w-sm anim-scale-in">
          <div className="mb-6 flex items-center justify-center gap-3">
            <IcLogo size={38} className="text-pine-800" />
            <div>
              <div className="font-display text-[17px] font-bold text-pine-950">Рассрочка·Дом</div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">Панель партнёра · Django Admin MVP</div>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (login.user === "admin" && login.pass === "demo") { setAdminAuthed(true); store.toast("Вход выполнен: admin"); }
              else setLoginErr(true);
            }}
            className="rounded-xl border border-line bg-card p-6 shadow-pop"
          >
            <h1 className="font-display text-[18px] font-bold text-ink">Вход в систему</h1>
            <p className="mt-1 text-[12.5px] text-ink-soft">Демо-доступ для показа заказчикам: логин <b>admin</b>, пароль <b>demo</b>.</p>
            <label className="mt-5 block">
              <span className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">Логин</span>
              <input value={login.user} onChange={(e) => setLogin({ ...login, user: e.target.value })} className="mt-1 w-full rounded-md border border-line bg-paper px-3.5 py-2.5 text-[13.5px] outline-none focus:border-pine-600" />
            </label>
            <label className="mt-3 block">
              <span className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">Пароль</span>
              <input type="password" value={login.pass} onChange={(e) => { setLogin({ ...login, pass: e.target.value }); setLoginErr(false); }} placeholder="demo" className="mt-1 w-full rounded-md border border-line bg-paper px-3.5 py-2.5 text-[13.5px] outline-none focus:border-pine-600" />
            </label>
            {loginErr && <p className="mt-2 text-[12px] font-bold text-clay-600 anim-fade-in">Неверный пароль. Подсказка: demo</p>}
            <button type="submit" className="mt-5 w-full rounded-md bg-pine-800 py-3 text-[14px] font-bold text-paper transition-all hover:bg-pine-700 active:scale-[0.99]">Войти</button>
            <button type="button" onClick={() => navigate({ name: "home" })} className="mt-2 w-full rounded-md border border-line py-2.5 text-[13px] font-semibold text-ink-soft transition-colors hover:text-pine-700">← Вернуться на портал</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-paper">
      {/* сайдбар */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-pine-950 text-pine-100 max-lg:w-16">
        <div className="flex items-center gap-2.5 px-4 py-5 max-lg:justify-center max-lg:px-0">
          <IcLogo size={32} className="flex-none text-pine-800" />
          <div className="max-lg:hidden">
            <div className="font-display text-[13px] font-bold leading-tight text-paper">Рассрочка·Дом</div>
            <div className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-pine-400">admin · prototype</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-2.5">
          {NAV.map((n) => (
            <button key={n.key} onClick={() => setSection(n.key)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[12.5px] font-semibold transition-all duration-150 max-lg:justify-center max-lg:px-0 ${
                section === n.key ? "bg-pine-800 text-amber-300 shadow-lift" : "text-pine-200 hover:bg-pine-900 hover:text-paper"
              }`}>
              <span className="flex-none">{n.icon(17)}</span>
              <span className="max-lg:hidden">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-pine-900 p-3">
          <button onClick={() => navigate({ name: "home" })} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[12.5px] font-semibold text-pine-300 transition-colors hover:text-paper max-lg:justify-center max-lg:px-0">
            <IcEye size={16} /> <span className="max-lg:hidden">Открыть портал</span>
          </button>
          <button onClick={() => setAdminAuthed(false)} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[12.5px] font-semibold text-pine-300 transition-colors hover:text-paper max-lg:justify-center max-lg:px-0">
            <IcX size={16} /> <span className="max-lg:hidden">Выйти</span>
          </button>
        </div>
      </aside>

      {/* контент */}
      <main className="ml-60 flex-1 px-6 py-7 max-lg:ml-16 max-lg:px-4">
        {section === "dash" && <Dashboard />}
        {section === "offers" && <OffersAdmin />}
        {section === "feeds" && <FeedsAdmin />}
        {section === "filters" && <FiltersAdmin />}
        {section === "leads" && <LeadsAdmin />}
        {section === "ai" && <AiAdmin />}
      </main>
    </div>
  );
}

/* ================= ДАШБОРД ================= */
function Dashboard() {
  const { offers, leads, stats, aiLog } = useStore();
  const active = offers.filter((o) => o.isActive);
  const avgBenefit = active.reduce((s, o) => s + programBenefit(o), 0) / Math.max(1, active.length);
  const feedsOk = offers.filter((o) => o.feedStatus === "success").length;
  const convRate = (stats.conversions / Math.max(1, stats.detailViews)) * 100;

  const byType = useMemo(() => {
    const map: Record<string, number> = { call: 0, whatsapp: 0, visit: 0, lead: 0, subscription: 0, ai_handoff: 0 };
    leads.forEach((l) => { map[l.type] = (map[l.type] ?? 0) + 1; });
    return Object.entries(map).map(([k, v]) => ({ k, v })).sort((a, b) => b.v - a.v);
  }, [leads]);
  const maxType = Math.max(1, ...byType.map((x) => x.v));

  const funnel = [
    { l: "Показы карточек (list_view)", v: stats.listViews, w: 100 },
    { l: "Детальные просмотры", v: stats.detailViews, w: (stats.detailViews / stats.listViews) * 100 },
    { l: "Расчёты в калькуляторе", v: stats.calcs, w: (stats.calcs / stats.listViews) * 100 },
    { l: "Сравнения сценариев", v: stats.comparisons, w: (stats.comparisons / stats.listViews) * 100 },
    { l: "Конверсии", v: stats.conversions, w: (stats.conversions / stats.listViews) * 100 },
  ];

  return (
    <div className="anim-fade-in">
      <Header title="Дашборд" sub="Сводка по порталу в реальном времени · данные обновляются из сессий пользователей" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { l: "Активные предложения", v: fmtNum(active.length), d: `${offers.length - active.length} скрыто`, tone: "text-pine-800" },
          { l: "Средняя выгода", v: fmtMoney(avgBenefit, true), d: "по программам", tone: "text-pine-800" },
          { l: "Конверсии", v: fmtNum(stats.conversions), d: `CR ${convRate.toFixed(1)}% от просмотров`, tone: "text-amber-600" },
          { l: "Фиды в норме", v: `${feedsOk}/${offers.length}`, d: "синхронизация XML", tone: feedsOk === offers.length ? "text-pine-800" : "text-clay-600" },
          { l: "Диалоги AI", v: fmtNum(aiLog.length + 27), d: "за неделю", tone: "text-pine-800" },
        ].map((k, i) => (
          <div key={k.l} className="rounded-lg border border-line bg-card p-4 shadow-lift anim-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">{k.l}</div>
            <div className={`mt-1.5 font-display text-[24px] font-bold tabular ${k.tone}`}>{k.v}</div>
            <div className="text-[11.5px] text-ink-faint">{k.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* конверсии по типам */}
        <div className="rounded-lg border border-line bg-card p-5 shadow-lift">
          <h3 className="font-display text-[14px] font-bold text-ink">Конверсии по типам · UserConversions</h3>
          <div className="mt-4 space-y-3">
            {byType.map((t, i) => (
              <div key={t.k}>
                <div className="mb-1 flex justify-between text-[12px]"><span className="font-semibold text-ink-soft">{LEAD_TYPE_LABELS[t.k] ?? t.k}</span><span className="font-bold tabular">{t.v}</span></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-line-soft">
                  <div className="anim-bar h-full rounded-full bg-pine-600" style={{ width: `${(t.v / maxType) * 100}%`, animationDelay: `${i * 0.08}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* воронка */}
        <div className="rounded-lg border border-line bg-card p-5 shadow-lift">
          <h3 className="font-display text-[14px] font-bold text-ink">Воронка UserViews → конверсия</h3>
          <div className="mt-4 space-y-2.5">
            {funnel.map((f, i) => (
              <div key={f.l} className="flex items-center gap-3">
                <span className="w-7 text-right font-display text-[12px] font-bold text-ink-faint tabular">{fmtNum(f.v)}</span>
                <div className="h-7 flex-1 overflow-hidden rounded bg-line-soft">
                  <div className={`flex h-full items-center rounded px-2 text-[10.5px] font-bold text-paper anim-bar ${i === funnel.length - 1 ? "bg-amber-500 text-pine-950" : "bg-pine-700"}`}
                    style={{ width: `${Math.max(7, f.w)}%`, animationDelay: `${i * 0.1}s` }}>
                    {f.l}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] text-ink-faint">Счётчики живые: откройте портал, покликайте карточки и калькулятор — цифры здесь вырастут.</p>
        </div>
      </div>

      {/* последние заявки */}
      <div className="mt-6 rounded-lg border border-line bg-card shadow-lift">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h3 className="font-display text-[14px] font-bold text-ink">Последние заявки</h3>
          <span className="text-[11.5px] font-semibold text-ink-faint">последние {Math.min(5, leads.length)} из {leads.length}</span>
        </div>
        <div className="divide-y divide-line-soft">
          {leads.slice(0, 5).map((l) => (
            <div key={l.id} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-mint/50">
              <LeadBadge type={l.type} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-bold text-ink">{l.name}</div>
                <div className="truncate text-[11.5px] text-ink-faint">{l.comment || l.phone}</div>
              </div>
              <span className="text-[11.5px] font-semibold text-ink-faint tabular">{l.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= ПРЕДЛОЖЕНИЯ ================= */
const emptyDraft = (): Offer => ({
  id: "o" + Math.random().toString(36).slice(2, 8), developer: DEVELOPERS[0], project: "", propertyType: "квартира",
  district: "Пресненский", metro: "", address: "", lat: 55.75, lng: 37.61, priceWithRepair: 12_000_000, basePrice: 11_000_000,
  programPrice: 9_900_000, minDownPaymentPercent: 20, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 0,
  objectMarkupFixed: 0, paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false,
  isForFamilies: true, canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: false, hasTradeIn: false,
  infrastructure: [], rooms: 1, areaMin: 38, areaMax: 44, readyQuarter: "IV кв. 2027", programName: "Новая программа",
  description: "", feedUrl: "", feedStatus: "pending", feedLastSynced: "ещё не синхронизирован", feedObjects: 0, isActive: true,
  rentEstimate: 55_000, priceGrowthYear: 8, hue: Math.floor(Math.random() * 360),
});

function OffersAdmin() {
  const store = useStore();
  const { offers, updateOffer, addOffer, removeOffer, toast } = store;
  const [q, setQ] = useState("");
  const [devFilter, setDevFilter] = useState("all");
  const [draft, setDraft] = useState<Offer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const list = offers.filter((o) =>
    (devFilter === "all" || o.developer === devFilter) &&
    `${o.project} ${o.developer} ${o.district} ${o.metro}`.toLowerCase().includes(q.toLowerCase())
  );

  const save = () => {
    if (!draft) return;
    if (!draft.project.trim()) { toast("Укажите название ЖК", "warn"); return; }
    if (isNew) { addOffer(draft); toast(`Объект «${draft.project}» добавлен в DeveloperOffers`); }
    else { updateOffer(draft.id, draft); toast(`Изменения сохранены: ${draft.project}`); }
    setDraft(null);
  };

  const num = (v: string) => Number(v.replace(/\s/g, "").replace(",", ".")) || 0;

  return (
    <div className="anim-fade-in">
      <Header title="Предложения · DeveloperOffers" sub={`${offers.length} записей · CRUD-управление структурой базы (ТЗ №5)`}
        action={<button onClick={() => { setDraft(emptyDraft()); setIsNew(true); }} className="flex items-center gap-1.5 rounded-md bg-amber-400 px-4 py-2.5 text-[12.5px] font-bold text-pine-950 transition-all hover:bg-amber-300 active:scale-95"><IcPlus size={14} /> Добавить объект</button>} />

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative">
          <IcSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по ЖК, застройщику, метро…" className="w-64 rounded-md border border-line bg-card py-2.5 pl-9 pr-3 text-[13px] outline-none focus:border-pine-600" />
        </div>
        <select value={devFilter} onChange={(e) => setDevFilter(e.target.value)} className="rounded-md border border-line bg-card px-3 py-2.5 text-[13px] font-semibold outline-none">
          <option value="all">Все застройщики</option>
          {DEVELOPERS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line bg-card shadow-lift">
        <table className="w-full min-w-[860px] border-collapse text-[12.5px]">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[10.5px] font-bold uppercase tracking-wide text-ink-faint">
              <th className="px-4 py-3">Объект</th><th className="px-3 py-3">Базовая цена</th><th className="px-3 py-3">По программе</th>
              <th className="px-3 py-3">Рассрочка</th><th className="px-3 py-3">Фид</th><th className="px-3 py-3">Активно</th><th className="px-3 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className={`border-b border-line-soft transition-colors last:border-0 hover:bg-mint/40 ${!o.isActive ? "opacity-55" : ""}`}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-12 flex-none overflow-hidden rounded"><FacadeArt offer={o} className="h-full w-full" /></div>
                    <div>
                      <div className="font-bold text-ink">{o.project}</div>
                      <div className="text-[11px] text-ink-faint">{o.developer} · м. {o.metro}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 tabular">{fmtMoney(o.basePrice, true)}</td>
                <td className="px-3 py-2.5">
                  <span className="font-bold text-pine-700 tabular">{fmtMoney(o.programPrice, true)}</span>
                  <div className="text-[10.5px] font-bold text-amber-600">− {fmtMoney(programBenefit(o), true)}</div>
                </td>
                <td className="px-3 py-2.5 text-ink-soft">{o.interestRatePercent}% · {o.termMonths} мес<br /><span className="text-[10.5px] text-ink-faint">ПВ от {o.minDownPaymentPercent}%</span></td>
                <td className="px-3 py-2.5"><FeedBadge status={o.feedStatus} /></td>
                <td className="px-3 py-2.5"><Toggle on={o.isActive} onChange={(v) => { updateOffer(o.id, { isActive: v }); toast(v ? `«${o.project}» опубликован на портале` : `«${o.project}» скрыт с портала`); }} label="Активность" /></td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => { setDraft({ ...o }); setIsNew(false); }} className="grid h-8 w-8 place-items-center rounded-md border border-line text-ink-soft transition-all hover:border-pine-600 hover:text-pine-700 active:scale-90" aria-label="Редактировать"><IcEdit size={14} /></button>
                    {confirmDel === o.id ? (
                      <button onClick={() => { removeOffer(o.id); setConfirmDel(null); toast(`«${o.project}» удалён`); }} className="flex h-8 items-center gap-1 rounded-md bg-clay-600 px-2 text-[11px] font-bold text-card anim-fade-in"><IcCheck size={12} /> Точно?</button>
                    ) : (
                      <button onClick={() => { setConfirmDel(o.id); setTimeout(() => setConfirmDel((c) => (c === o.id ? null : c)), 2600); }} className="grid h-8 w-8 place-items-center rounded-md border border-line text-ink-soft transition-all hover:border-clay-600 hover:text-clay-600 active:scale-90" aria-label="Удалить"><IcTrash size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* модалка редактирования */}
      <Modal open={!!draft} onClose={() => setDraft(null)} wide>
        {draft && (
          <div className="p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="font-display text-[18px] font-bold text-ink">{isNew ? "Новый объект DeveloperOffers" : `Редактирование: ${draft.project || "—"}`}</h3>
                <p className="mt-0.5 text-[12px] text-ink-faint">Группы полей повторяют структуру таблицы из раздела «База данных MVP»</p>
              </div>
              <button onClick={() => setDraft(null)} className="text-ink-faint hover:text-ink"><IcX size={18} /></button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Fieldset title="Базовая информация">
                <Field label="Застройщик"><input className={inp} value={draft.developer} onChange={(e) => setDraft({ ...draft, developer: e.target.value })} /></Field>
                <Field label="Название ЖК *"><input className={inp} value={draft.project} onChange={(e) => setDraft({ ...draft, project: e.target.value })} /></Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Район"><input className={inp} value={draft.district} onChange={(e) => setDraft({ ...draft, district: e.target.value })} /></Field>
                  <Field label="Метро"><input className={inp} value={draft.metro} onChange={(e) => setDraft({ ...draft, metro: e.target.value })} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Тип">
                    <select className={inp} value={draft.propertyType} onChange={(e) => setDraft({ ...draft, propertyType: e.target.value as Offer["propertyType"] })}>
                      <option>квартира</option><option>студия</option><option>апартаменты</option>
                    </select>
                  </Field>
                  <Field label="Комнат (0 = студия)"><input type="number" className={inp} value={draft.rooms} onChange={(e) => setDraft({ ...draft, rooms: Number(e.target.value) })} /></Field>
                </div>
              </Fieldset>

              <Fieldset title="Цены и наценка на объект">
                <Field label="Цена с ремонтом (витрина), ₽"><input className={inp} defaultValue={draft.priceWithRepair} onBlur={(e) => setDraft({ ...draft, priceWithRepair: num(e.target.value) })} /></Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Базовая цена (price_min) *"><input className={inp} defaultValue={draft.basePrice} onBlur={(e) => setDraft({ ...draft, basePrice: num(e.target.value) })} /></Field>
                  <Field label="Цена по программе"><input className={inp} defaultValue={draft.programPrice} onBlur={(e) => setDraft({ ...draft, programPrice: num(e.target.value) })} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Удорожание, % (markup_percent)"><input type="number" step="0.5" className={inp} value={draft.priceMarkupPercent} onChange={(e) => setDraft({ ...draft, priceMarkupPercent: Number(e.target.value) })} /></Field>
                  <Field label="Фикс-наценка, ₽ (markup_fixed)"><input type="number" className={inp} value={draft.objectMarkupFixed} onChange={(e) => setDraft({ ...draft, objectMarkupFixed: Number(e.target.value) })} /></Field>
                </div>
                <p className="rounded bg-amber-100/70 px-2.5 py-1.5 text-[11px] text-amber-700">Выгода пересчитается автоматически: {fmtMoney(Math.max(0, draft.basePrice - draft.programPrice), true)}</p>
              </Fieldset>

              <Fieldset title="Параметры рассрочки">
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Ставка, %"><input type="number" step="0.5" className={inp} value={draft.interestRatePercent} onChange={(e) => setDraft({ ...draft, interestRatePercent: Number(e.target.value), isInterestFree: Number(e.target.value) === 0 })} /></Field>
                  <Field label="Срок, мес"><input type="number" className={inp} value={draft.termMonths} onChange={(e) => setDraft({ ...draft, termMonths: Number(e.target.value) })} /></Field>
                  <Field label="ПВ от, %"><input type="number" className={inp} value={draft.minDownPaymentPercent} onChange={(e) => setDraft({ ...draft, minDownPaymentPercent: Number(e.target.value) })} /></Field>
                </div>
                <Field label="Тип платежа (payment_type)">
                  <select className={inp} value={draft.paymentType} onChange={(e) => setDraft({ ...draft, paymentType: e.target.value as PaymentType })}>
                    {(Object.keys(PAYMENT_LABELS) as PaymentType[]).map((t) => <option key={t} value={t}>{PAYMENT_LABELS[t]}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {([
                    ["isInterestFree", "Беспроцентная 0%"], ["hasKeyEarlyRelease", "Ключи до оплаты"], ["isForFamilies", "Семейная"],
                    ["isForPregnant", "Беременным"], ["isItMortgage", "IT-ипотека"], ["canSwitchToMortgage", "Переход на ипотеку"],
                    ["acceptsMaternityCapital", "Маткапитал"], ["hasTradeIn", "Trade-In"],
                  ] as [keyof Offer, string][]).map(([k, l]) => (
                    <label key={k} className="flex cursor-pointer items-center gap-2 text-[12px] font-semibold text-ink-soft">
                      <input type="checkbox" className="chk" checked={Boolean(draft[k])} onChange={(e) => setDraft({ ...draft, [k]: e.target.checked })} /> {l}
                    </label>
                  ))}
                </div>
              </Fieldset>

              <Fieldset title="Фид и статус">
                <Field label="URL фида Яндекс.Недвижимость"><input className={inp} value={draft.feedUrl} onChange={(e) => setDraft({ ...draft, feedUrl: e.target.value })} placeholder="https://…/yandex-realty.xml" /></Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Статус фида">
                    <select className={inp} value={draft.feedStatus} onChange={(e) => setDraft({ ...draft, feedStatus: e.target.value as FeedStatus })}>
                      <option value="success">success</option><option value="pending">pending</option><option value="error">error</option>
                    </select>
                  </Field>
                  <Field label="Объектов в фиде"><input type="number" className={inp} value={draft.feedObjects} onChange={(e) => setDraft({ ...draft, feedObjects: Number(e.target.value) })} /></Field>
                </div>
                <Field label="Название программы"><input className={inp} value={draft.programName} onChange={(e) => setDraft({ ...draft, programName: e.target.value })} /></Field>
                <Field label="Описание"><textarea className={`${inp} h-16 resize-none`} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
              </Fieldset>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
              <label className="flex items-center gap-2.5 text-[13px] font-bold text-ink">
                <Toggle on={draft.isActive} onChange={(v) => setDraft({ ...draft, isActive: v })} /> Публиковать на портале
              </label>
              <div className="flex gap-2">
                <button onClick={() => setDraft(null)} className="rounded-md border border-line px-5 py-2.5 text-[13px] font-bold text-ink-soft hover:text-ink">Отмена</button>
                <button onClick={save} className="flex items-center gap-1.5 rounded-md bg-pine-800 px-5 py-2.5 text-[13px] font-bold text-paper transition-all hover:bg-pine-700 active:scale-95"><IcCheck size={14} /> Сохранить</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ================= ФИДЫ ================= */
function FeedsAdmin() {
  const { offers, updateOffer, toast } = useStore();
  const [syncing, setSyncing] = useState<string | null>(null);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const feeds = useMemo(() => {
    const map = new Map<string, { dev: string; url: string; status: FeedStatus; synced: string; objects: number; offers: number }>();
    offers.forEach((o) => {
      const e = map.get(o.developer);
      if (e) { e.objects += o.feedObjects; e.offers += 1; if (o.feedStatus === "error") e.status = "error"; }
      else map.set(o.developer, { dev: o.developer, url: o.feedUrl, status: o.feedStatus, synced: o.feedLastSynced, objects: o.feedObjects, offers: 1 });
    });
    return [...map.values()];
  }, [offers]);

  const sync = (dev: string) => {
    setSyncing(dev);
    offers.filter((o) => o.developer === dev).forEach((o) => updateOffer(o.id, { feedStatus: "pending" }));
    syncTimer.current = setTimeout(() => {
      offers.filter((o) => o.developer === dev).forEach((o) =>
        updateOffer(o.id, { feedStatus: "success", feedLastSynced: "только что", feedObjects: o.feedObjects + Math.floor(Math.random() * 6) })
      );
      setSyncing(null);
      toast(`Фид ${dev}: синхронизировано, новых объектов ${Math.floor(Math.random() * 5) + 1}`);
    }, 1800);
  };

  return (
    <div className="anim-fade-in">
      <Header title="Фиды застройщиков · FeedRealtyObjects" sub="Cron-парсер XML-фидов Яндекс.Недвижимости · синхронизация каждые 6 часов" />

      <div className="grid gap-4 lg:grid-cols-2">
        {feeds.map((f) => (
          <div key={f.dev} className="rounded-lg border border-line bg-card p-5 shadow-lift transition-shadow hover:shadow-pop">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-display text-[14.5px] font-bold text-ink">{f.dev}</div>
                <div className="truncate text-[11.5px] text-ink-faint">{f.url || "фид не подключён"}</div>
              </div>
              <FeedBadge status={syncing === f.dev ? "pending" : f.status} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-paper py-2"><div className="font-display text-[15px] font-bold text-pine-800 tabular">{fmtNum(f.objects)}</div><div className="text-[10px] text-ink-faint">объектов</div></div>
              <div className="rounded-md bg-paper py-2"><div className="font-display text-[15px] font-bold text-pine-800 tabular">{f.offers}</div><div className="text-[10px] text-ink-faint">ЖК на портале</div></div>
              <div className="rounded-md bg-paper py-2"><div className="text-[11.5px] font-bold leading-5 text-ink-soft">{syncing === f.dev ? "парсинг…" : f.synced}</div><div className="text-[10px] text-ink-faint">синхр.</div></div>
            </div>
            <button onClick={() => sync(f.dev)} disabled={syncing !== null}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-pine-300 py-2.5 text-[12.5px] font-bold text-pine-800 transition-all enabled:hover:bg-pine-800 enabled:hover:text-paper enabled:active:scale-[0.99] disabled:opacity-50">
              <span className={syncing === f.dev ? "animate-[sync-spin_1s_linear_infinite]" : ""}><IcRefresh size={14} /></span>
              {syncing === f.dev ? "Парсим XML…" : "Синхронизировать сейчас"}
            </button>
          </div>
        ))}
      </div>

      {/* маппинг XML */}
      <div className="mt-6 rounded-lg border border-line bg-card shadow-lift">
        <div className="border-b border-line px-5 py-3.5">
          <h3 className="font-display text-[14px] font-bold text-ink">Маппинг XML-тегов фида → поля БД (Задача 4 из User Flow)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-[12.5px]">
            <thead><tr className="border-b border-line bg-paper text-left text-[10.5px] font-bold uppercase tracking-wide text-ink-faint"><th className="px-5 py-2.5">XML-тег</th><th className="px-3 py-2.5">Поле БД</th><th className="px-3 py-2.5">Комментарий</th></tr></thead>
            <tbody>
              {FEED_TAGS.map((t) => (
                <tr key={t.tag} className="border-b border-line-soft last:border-0 transition-colors hover:bg-mint/40">
                  <td className="px-5 py-2.5 font-mono text-[12px] font-semibold text-pine-700">{t.tag}</td>
                  <td className="px-3 py-2.5 font-mono text-[12px] text-ink">{t.field}</td>
                  <td className="px-3 py-2.5 text-ink-soft">{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-5 py-3 text-[11.5px] text-ink-faint">Условия рассрочек (ставка, ПВ, программы) остаются в ручной выгрузке застройщика — в фиде их нет. Это разделение зафиксировано в ТЗ «Маппинг данных».</p>
      </div>
    </div>
  );
}

/* ================= ГЛАВНАЯ И ФИЛЬТРЫ ================= */
function FiltersAdmin() {
  const store = useStore();
  const { homeCfg, setHomeCfg, filterBlocks, setFilterBlocks, toast } = useStore();
  const [title, setTitle] = useState(homeCfg.title);
  const [subtitle, setSubtitle] = useState(homeCfg.subtitle);
  const [geo, setGeo] = useState(homeCfg.geoPrompt);
  const [tab, setTab] = useState<TargetGroup>("family");

  const blocks = filterBlocks.filter((b) => b.groups.includes(tab)).sort((a, b) => a.order - b.order);

  const move = (id: string, dir: -1 | 1) => {
    const sorted = [...filterBlocks].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((b) => b.id === id);
    const other = sorted[idx + dir];
    if (!other) return;
    setFilterBlocks(filterBlocks.map((b) => b.id === id ? { ...b, order: other.order } : b.id === other.id ? { ...b, order: b.order } : b));
  };

  const toggleBlock = (id: string) => {
    setFilterBlocks(filterBlocks.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)));
  };

  const rename = (id: string, label: string) => {
    setFilterBlocks(filterBlocks.map((b) => (b.id === id ? { ...b, label } : b)));
  };

  return (
    <div className="anim-fade-in">
      <Header title="Главная страница и фильтры" sub="Управление структурой базы фильтров через админку — изменения мгновенно видны на портале (ТЗ №5)" />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* тексты главной */}
        <div className="rounded-lg border border-line bg-card p-5 shadow-lift">
          <h3 className="font-display text-[14px] font-bold text-ink">Тексты первого экрана</h3>
          <Field label="Заголовок (H1)"><input className={inp} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="Подзаголовок"><textarea className={`${inp} h-20 resize-none`} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></Field>
          <label className="mt-3 flex items-center justify-between rounded-md border border-line px-3 py-2.5">
            <span className="text-[12.5px] font-semibold text-ink-soft">Геопромт «Показать квартиры рядом с вами?»</span>
            <Toggle on={geo} onChange={setGeo} />
          </label>
          <button onClick={() => { setHomeCfg({ title, subtitle, geoPrompt: geo }); toast("Главная обновлена — откройте портал"); }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-pine-800 py-2.5 text-[13px] font-bold text-paper transition-all hover:bg-pine-700 active:scale-[0.99]">
            <IcCheck size={14} /> Опубликовать на портале
          </button>
          <p className="mt-2 text-[11.5px] text-ink-faint">Черновик сохраняется в localStorage прототипа и переживает перезагрузку.</p>
        </div>

        {/* блоки фильтров */}
        <div className="rounded-lg border border-line bg-card p-5 shadow-lift">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[14px] font-bold text-ink">Блоки фильтров по ЦГ</h3>
            <div className="flex gap-1 rounded-md border border-line p-0.5">
              {(["family", "investor", "individual"] as TargetGroup[]).map((g) => (
                <button key={g} onClick={() => setTab(g)} className={`rounded px-2.5 py-1 text-[11px] font-bold transition-all ${tab === g ? "bg-pine-800 text-paper" : "text-ink-soft"}`}>
                  {g === "family" ? "Семья" : g === "investor" ? "Инвестор" : "Индивид."}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {blocks.map((b, i) => (
              <div key={b.id} className={`flex items-center gap-2.5 rounded-md border px-3 py-2.5 transition-all ${b.visible ? "border-line bg-paper" : "border-dashed border-line opacity-55"}`}>
                <span className="w-5 text-center font-display text-[11px] font-bold text-ink-faint">{i + 1}</span>
                <input value={b.label} onChange={(e) => rename(b.id, e.target.value)} className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-ink outline-none focus:text-pine-700" />
                <span className="font-mono text-[10px] text-ink-faint">#{b.id}</span>
                <div className="flex flex-col">
                  <button onClick={() => move(b.id, -1)} disabled={i === 0} className="text-[9px] leading-3 text-ink-faint enabled:hover:text-pine-700 disabled:opacity-30">▲</button>
                  <button onClick={() => move(b.id, 1)} disabled={i === blocks.length - 1} className="text-[9px] leading-3 text-ink-faint enabled:hover:text-pine-700 disabled:opacity-30">▼</button>
                </div>
                <Toggle on={b.visible} onChange={() => toggleBlock(b.id)} label={`Блок ${b.label}`} />
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-md bg-mint px-3 py-2 text-[11.5px] leading-snug text-pine-800">
            Выключите блок (например, «IT-ипотека» в программах) — и он пропадёт из мастера подбора и сайдбара результатов для выбранной ЦГ. Порядок блоков тоже применяется.
          </p>
          <button onClick={() => store.toast("Порядок и видимость блоков сохранены")} className="mt-3 flex items-center gap-2 rounded-md border border-pine-300 px-4 py-2 text-[12.5px] font-bold text-pine-800 transition-all hover:bg-pine-800 hover:text-paper active:scale-95">
            <IcCheck size={13} /> Сохранить структуру
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= ЗАЯВКИ ================= */
const LEAD_TYPE_LABELS: Record<string, string> = {
  call: "Звонок", whatsapp: "МАКС/WhatsApp", visit: "Просмотр", lead: "Бронь", subscription: "Подписка", ai_handoff: "AI → менеджер",
};
function LeadBadge({ type }: { type: Lead["type"] }) {
  const cls = {
    call: "bg-pine-100 text-pine-800", whatsapp: "bg-mint text-pine-700", visit: "bg-amber-100 text-amber-700",
    lead: "bg-pine-800 text-amber-300", subscription: "bg-line-soft text-ink-soft", ai_handoff: "bg-clay-100 text-clay-600",
  }[type];
  return <span className={`rounded px-2 py-1 text-[10.5px] font-bold ${cls}`}>{LEAD_TYPE_LABELS[type]}</span>;
}

function LeadsAdmin() {
  const { leads, updateLead, offers, toast } = useStore();
  const [tab, setTab] = useState<"all" | Lead["type"]>("all");
  const list = leads.filter((l) => tab === "all" || l.type === tab);
  const offerName = (id?: string) => offers.find((o) => o.id === id)?.project ?? "—";

  return (
    <div className="anim-fade-in">
      <Header title="Заявки · UserConversions" sub="Конверсии без регистрации: звонок, МАКС, просмотр, бронь, подписка, передача от AI-агента" />
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(["all", "call", "whatsapp", "visit", "lead", "subscription", "ai_handoff"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3.5 py-2 text-[12.5px] font-bold transition-all active:scale-95 ${tab === t ? "bg-pine-800 text-paper" : "border border-line bg-card text-ink-soft hover:border-pine-400"}`}>
            {t === "all" ? `Все (${leads.length})` : `${LEAD_TYPE_LABELS[t]} (${leads.filter((l) => l.type === t).length})`}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-line bg-card shadow-lift">
        <table className="w-full min-w-[720px] text-[12.5px]">
          <thead><tr className="border-b border-line bg-paper text-left text-[10.5px] font-bold uppercase tracking-wide text-ink-faint">
            <th className="px-4 py-3">Тип</th><th className="px-3 py-3">Клиент</th><th className="px-3 py-3">Объект</th><th className="px-3 py-3">Дата</th><th className="px-3 py-3">Статус</th>
          </tr></thead>
          <tbody>
            {list.map((l) => (
              <tr key={l.id} className="border-b border-line-soft last:border-0 transition-colors hover:bg-mint/40">
                <td className="px-4 py-3"><LeadBadge type={l.type} /></td>
                <td className="px-3 py-3"><div className="font-bold text-ink">{l.name}</div><div className="text-[11px] text-ink-faint">{l.phone}{l.comment ? ` · ${l.comment}` : ""}</div></td>
                <td className="px-3 py-3 font-semibold text-ink-soft">{offerName(l.offerId)}</td>
                <td className="px-3 py-3 text-ink-faint tabular">{l.date}</td>
                <td className="px-3 py-3">
                  <select value={l.status} onChange={(e) => { updateLead(l.id, { status: e.target.value as Lead["status"] }); toast("Статус заявки обновлён"); }}
                    className={`rounded-md border px-2.5 py-1.5 text-[11.5px] font-bold outline-none ${l.status === "new" ? "border-amber-400 bg-amber-100 text-amber-700" : l.status === "progress" ? "border-pine-300 bg-mint text-pine-700" : "border-line bg-paper text-ink-faint"}`}>
                    <option value="new">Новая</option><option value="progress">В работе</option><option value="closed">Закрыта</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= AI-АГЕНТ ================= */
function AiAdmin() {
  const store = useStore();
  const { aiEnabled, setAiEnabled, aiScenarios, setAiScenarios, aiLog, toast } = store;

  const roadmap = [
    { t: "Голосовой ввод запроса", d: "Whisper-транскрипция → те же интенты, что и текст. Для мобильной аудитории 60%+." },
    { t: "PDF-подборка за 30 секунд", d: "Агент собирает топ-5 программ в брендированный PDF со ссылками и расчётами — лид-магнит для подписки." },
    { t: "Скоринг платёжеспособности", d: "По доходу и ПВ агент предлагает реалистичный бюджет до применения фильтров (одобряемо-ориентированный подбор)." },
    { t: "Триггерные уведомления", d: "Пуш при снижении цены / новой программе под сохранённые критерии — сценарий «Умные уведомления» уже заложен." },
    { t: "Обучение на конверсиях", d: "RLHF-контур: ответы, приведшие к заявке, поднимаются в ранжировании сценариев." },
    { t: "Эскалация с контекстом", d: "Менеджер видит всю историю: фильтры, расчёты, просмотренные ЖК — без переспрашивания клиента." },
  ];

  return (
    <div className="anim-fade-in">
      <Header title="AI-агент «Домовой»" sub="Настройка сценариев, покрытие запросов и журнал диалогов · в прототипе — rule-based NLU, в релизе — LLM"
        action={
          <div className="flex items-center gap-2.5 rounded-md border border-line bg-card px-4 py-2.5">
            <span className={`text-[12.5px] font-bold ${aiEnabled ? "text-pine-700" : "text-ink-faint"}`}>{aiEnabled ? "Агент активен на портале" : "Агент отключён"}</span>
            <Toggle on={aiEnabled} onChange={(v) => { setAiEnabled(v); toast(v ? "AI-агент включён — виджет вернулся на портал" : "AI-агент скрыт с портала"); }} />
          </div>
        } />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        {/* сценарии */}
        <div className="rounded-lg border border-line bg-card p-5 shadow-lift">
          <h3 className="font-display text-[14px] font-bold text-ink">Сценарии и покрытие запросов</h3>
          <div className="mt-4 space-y-3">
            {aiScenarios.map((s) => (
              <div key={s.id} className={`rounded-lg border p-4 transition-all ${s.enabled ? "border-line bg-paper" : "border-dashed border-line opacity-60"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-ink">{s.label}</div>
                    <div className="text-[11.5px] leading-snug text-ink-faint">{s.desc}</div>
                  </div>
                  <Toggle on={s.enabled} onChange={(v) => setAiScenarios(aiScenarios.map((x) => x.id === s.id ? { ...x, enabled: v, coverage: v ? Math.max(x.coverage, 8) : 0 } : x))} label={s.label} />
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-soft">
                    <div className={`h-full rounded-full transition-all duration-500 ${s.enabled ? "bg-pine-600" : "bg-line"}`} style={{ width: `${s.coverage}%` }} />
                  </div>
                  <span className="w-9 text-right text-[11px] font-bold text-ink-soft tabular">{s.coverage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {/* журнал */}
          <div className="rounded-lg border border-line bg-card shadow-lift">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <h3 className="font-display text-[14px] font-bold text-ink">Журнал диалогов</h3>
              <span className="text-[11px] font-semibold text-ink-faint">живой: пишите агенту на портале</span>
            </div>
            <div className="max-h-64 divide-y divide-line-soft overflow-y-auto thin-scroll">
              {aiLog.map((e) => (
                <div key={e.id} className="px-5 py-2.5 transition-colors hover:bg-mint/40">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-pine-100 px-1.5 py-0.5 text-[10px] font-bold text-pine-800">{e.intent}</span>
                    <span className="text-[10.5px] text-ink-faint tabular">{e.time}</span>
                  </div>
                  <div className="mt-1 truncate text-[12.5px] text-ink-soft">«{e.query}»</div>
                </div>
              ))}
            </div>
          </div>

          {/* примеры фраз */}
          <div className="rounded-lg border border-line bg-card p-5 shadow-lift">
            <h3 className="font-display text-[14px] font-bold text-ink">Тестовые фразы для демо</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Подбери студию до 10 млн для инвестиции", "Рассчитай платёж: 15 млн, ПВ 30%, 36 мес", "Можно ли маткапитал на первый взнос?", "Что значит ключи до оплаты?", "Позови менеджера"].map((p) => (
                <span key={p} className="rounded-full border border-pine-200 bg-mint px-3 py-1.5 text-[11.5px] font-semibold text-pine-800">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* роадмап */}
      <div className="mt-6 rounded-lg border border-line bg-card shadow-lift">
        <div className="border-b border-line px-5 py-3.5">
          <h3 className="font-display text-[14px] font-bold text-ink">Предложения по развитию агента → в релиз</h3>
          <p className="text-[11.5px] text-ink-faint">Расширение сверх текущего ТЗ: агент становится точкой входа, а не виджетом</p>
        </div>
        <div className="grid gap-px bg-line-soft sm:grid-cols-2 xl:grid-cols-3">
          {roadmap.map((r, i) => (
            <div key={r.t} className="group bg-card p-5 transition-colors hover:bg-mint/60">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-pine-800 font-display text-[11px] font-bold text-amber-300">{i + 1}</span>
                <span className="font-display text-[13px] font-semibold text-ink">{r.t}</span>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{r.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= общее ================= */
const inp = "w-full rounded-md border border-line bg-paper px-3 py-2 text-[13px] outline-none transition-colors focus:border-pine-600";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-faint">{label}</span>
      {children}
    </label>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-2.5 rounded-lg border border-line bg-paper/60 p-4">
      <legend className="px-2 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-pine-700">{title}</legend>
      {children}
    </fieldset>
  );
}

function FeedBadge({ status }: { status: FeedStatus }) {
  const m = {
    success: { t: "success", cls: "bg-pine-100 text-pine-800" },
    pending: { t: "pending", cls: "bg-amber-100 text-amber-700" },
    error: { t: "error", cls: "bg-clay-100 text-clay-600" },
  }[status];
  return (
    <span className={`flex items-center gap-1.5 rounded px-2 py-1 text-[10.5px] font-bold ${m.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "success" ? "bg-pine-600" : status === "pending" ? "animate-pulse bg-amber-500" : "bg-clay-600"}`} />
      {m.t}
    </span>
  );
}

function Header({ title, sub, action }: { title: string; sub: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-pine-950">{title}</h1>
        <p className="mt-1 text-[12.5px] text-ink-soft">{sub}</p>
      </div>
      {action}
    </div>
  );
}
