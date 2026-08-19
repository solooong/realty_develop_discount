import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_AI_SCENARIOS, DEFAULT_FILTER_BLOCKS, SEED_OFFERS,
  type AiScenarioCfg, type FilterBlockCfg, type Offer, type PaymentType, type TargetGroup,
} from "../data/offers";
import { programBenefit, roiStats } from "./finance";

export type ViewName = "home" | "results" | "offer" | "compare" | "admin";
export interface View { name: ViewName; offerId?: string; }

export interface Filters {
  group: TargetGroup;
  budget: number;
  district: string | "all";
  rooms: number[]; // 0 = студия
  programs: string[]; // ключи предикатов
  payments: PaymentType[];
  conditions: string[];
  infra: string[];
  maxDown: number;
  minTerm: number;
  maxPayback: number; // лет, для инвестора
  rentMin: number; // ₽/мес
}

export const DEFAULT_FILTERS: Filters = {
  group: "family",
  budget: 20_000_000,
  district: "all",
  rooms: [],
  programs: [],
  payments: [],
  conditions: [],
  infra: [],
  maxDown: 50,
  minTerm: 6,
  maxPayback: 10,
  rentMin: 0,
};

export const PROGRAM_OPTIONS: { key: string; label: string; hint: string; test: (o: Offer) => boolean }[] = [
  { key: "family", label: "Семейная ипотека", hint: "переход на 6%", test: (o) => o.isForFamilies },
  { key: "it", label: "IT-ипотека", hint: "ставка от 6%", test: (o) => o.isItMortgage },
  { key: "kids7", label: "Дети до 7 лет", hint: "семейные рассрочки", test: (o) => o.isForFamilies || o.isForPregnant },
  { key: "pregnant", label: "Беременным", hint: "отсрочка ПВ", test: (o) => o.isForPregnant },
  { key: "matkap", label: "Материнский капитал", hint: "в зачёт ПВ", test: (o) => o.acceptsMaternityCapital },
  { key: "interest-free", label: "Беспроцентная 0%", hint: "без переплаты", test: (o) => o.isInterestFree },
];

export const CONDITION_OPTIONS: { key: string; label: string; test: (o: Offer) => boolean }[] = [
  { key: "keys", label: "Ключи до оплаты", test: (o) => o.hasKeyEarlyRelease },
  { key: "switch", label: "Переход на ипотеку", test: (o) => o.canSwitchToMortgage },
  { key: "tradein", label: "Trade-In", test: (o) => o.hasTradeIn },
  { key: "long", label: "Долгосрочная (3+ лет)", test: (o) => o.termMonths >= 36 },
  { key: "it", label: "IT-ипотека", test: (o) => o.isItMortgage },
];

export const INFRA_OPTIONS = [
  { key: "сад", label: "Детский сад рядом" },
  { key: "школа", label: "Школа рядом" },
  { key: "парк", label: "Парк / зелёная зона" },
  { key: "поликлиника", label: "Поликлиника" },
  { key: "двор без машин", label: "Безопасный двор без машин" },
];

export function filterOffers(offers: Offer[], f: Filters): Offer[] {
  return offers.filter((o) => {
    if (!o.isActive) return false;
    if (o.basePrice > f.budget) return false;
    if (f.district !== "all" && o.district !== f.district) return false;
    if (f.rooms.length > 0 && !f.rooms.includes(o.rooms)) return false;
    if (f.programs.length > 0 && !f.programs.every((k) => PROGRAM_OPTIONS.find((p) => p.key === k)?.test(o))) return false;
    if (f.payments.length > 0 && !f.payments.includes(o.paymentType)) return false;
    if (f.conditions.length > 0 && !f.conditions.every((k) => CONDITION_OPTIONS.find((c) => c.key === k)?.test(o))) return false;
    if (f.infra.length > 0 && !f.infra.every((k) => o.infrastructure.includes(k as never))) return false;
    if (o.minDownPaymentPercent > f.maxDown) return false;
    if (o.termMonths < f.minTerm) return false;
    if (f.group === "investor") {
      if (f.rentMin > 0 && o.rentEstimate < f.rentMin) return false;
      if (f.maxPayback < 15 && roiStats(o).paybackYears > f.maxPayback) return false;
    }
    return true;
  });
}

export type LeadType = "call" | "whatsapp" | "visit" | "lead" | "subscription" | "ai_handoff";
export interface Lead {
  id: string;
  offerId?: string;
  type: LeadType;
  name: string;
  phone: string;
  date: string;
  status: "new" | "progress" | "closed";
  comment?: string;
}

export interface AiLogEntry {
  id: string;
  time: string;
  intent: string;
  query: string;
}

export interface HomeCfg {
  title: string;
  subtitle: string;
  geoPrompt: boolean;
}

interface StoreState {
  view: View;
  navigate: (v: View) => void;
  offers: Offer[];
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  updateOffer: (id: string, patch: Partial<Offer>) => void;
  addOffer: (o: Offer) => void;
  removeOffer: (id: string) => void;
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: (group?: TargetGroup) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  leads: Lead[];
  addLead: (l: Omit<Lead, "id" | "date" | "status">) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  homeCfg: HomeCfg;
  setHomeCfg: (patch: Partial<HomeCfg>) => void;
  filterBlocks: FilterBlockCfg[];
  setFilterBlocks: (b: FilterBlockCfg[]) => void;
  aiScenarios: AiScenarioCfg[];
  setAiScenarios: (s: AiScenarioCfg[]) => void;
  aiEnabled: boolean;
  setAiEnabled: (v: boolean) => void;
  aiLog: AiLogEntry[];
  pushAiLog: (intent: string, query: string) => void;
  stats: { listViews: number; detailViews: number; calcs: number; comparisons: number; conversions: number };
  track: (k: keyof StoreState["stats"]) => void;
  toast: (msg: string, tone?: "ok" | "warn") => void;
  toasts: { id: number; msg: string; tone: "ok" | "warn" }[];
  geoDistrict: string;
  adminAuthed: boolean;
  setAdminAuthed: (v: boolean) => void;
}

const StoreCtx = createContext<StoreState | null>(null);

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const uid = () => Math.random().toString(36).slice(2, 10);

const SEED_LEADS: Lead[] = [
  { id: "l1", offerId: "o2", type: "visit", name: "Анна Крылова", phone: "+7 916 204-11-87", date: "19.08, 14:32", status: "new", comment: "Просмотр в субботу, 2 взрослых + ребёнок" },
  { id: "l2", offerId: "o5", type: "call", name: "Дмитрий Соколов", phone: "+7 903 512-40-09", date: "19.08, 11:05", status: "progress", comment: "Инвестор, студия под аренду" },
  { id: "l3", offerId: "o7", type: "lead", name: "Мария и Игорь Ветровы", phone: "+7 926 733-28-51", date: "18.08, 19:47", status: "new", comment: "Семейная рассрочка, маткапитал" },
  { id: "l4", offerId: "o10", type: "subscription", name: "—", phone: "—", date: "18.08, 16:12", status: "closed", comment: "Подписка: 1-комн, ЗАО, до 15 млн" },
  { id: "l5", offerId: "o4", type: "whatsapp", name: "Павел Гущин", phone: "+7 985 118-73-20", date: "18.08, 10:30", status: "progress" },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>({ name: "home" });
  const [offers, setOffers] = useState<Offer[]>(SEED_OFFERS);
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS);
  const [favorites, setFavorites] = useState<string[]>(() => load("rd_favorites", [] as string[]));
  const [compare, setCompare] = useState<string[]>([]);
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);
  const [homeCfg, setHomeCfgState] = useState<HomeCfg>(() =>
    load("rd_home", {
      title: "Квартира по программе застройщика — дешевле рыночной ипотеки",
      subtitle: "Субсидированные рассрочки 0–7%, семейная и IT-ипотека, ключи до оплаты. Сравните честную выгоду за 2 минуты.",
      geoPrompt: true,
    } as HomeCfg));
  const [filterBlocks, setFilterBlocks] = useState<FilterBlockCfg[]>(DEFAULT_FILTER_BLOCKS);
  const [aiScenarios, setAiScenarios] = useState<AiScenarioCfg[]>(DEFAULT_AI_SCENARIOS);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiLog, setAiLog] = useState<AiLogEntry[]>([
    { id: "a1", time: "19.08 13:41", intent: "Подбор", query: "Нужна двушка для семьи до 15 млн, без процентов" },
    { id: "a2", time: "19.08 12:07", intent: "Калькулятор", query: "Рассчитай платёж за 12 млн, ПВ 20%, на 2 года" },
    { id: "a3", time: "19.08 11:22", intent: "FAQ", query: "Можно ли использовать маткапитал?" },
  ]);
  const [stats, setStats] = useState({ listViews: 1284, detailViews: 342, calcs: 156, comparisons: 89, conversions: 47 });
  const [toasts, setToasts] = useState<{ id: number; msg: string; tone: "ok" | "warn" }[]>([]);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const toastId = useRef(0);

  useEffect(() => localStorage.setItem("rd_favorites", JSON.stringify(favorites)), [favorites]);

  const navigate = useCallback((v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const setFilters = useCallback((patch: Partial<Filters>) => {
    setFiltersState((f) => ({ ...f, ...patch }));
  }, []);

  const resetFilters = useCallback((group?: TargetGroup) => {
    setFiltersState((f) => ({ ...DEFAULT_FILTERS, group: group ?? f.group, budget: f.budget, district: f.district }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id);
      if (c.length >= 4) {
        setToasts((t) => [...t, { id: ++toastId.current, msg: "В сравнении максимум 4 объекта", tone: "warn" }]);
        return c;
      }
      return [...c, id];
    });
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  const addLead = useCallback((l: Omit<Lead, "id" | "date" | "status">) => {
    const now = new Date();
    const date = `${now.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}, ${now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;
    setLeads((ls) => [{ ...l, id: uid(), date, status: "new" }, ...ls]);
    setStats((s) => ({ ...s, conversions: s.conversions + 1 }));
  }, []);

  const updateLead = useCallback((id: string, patch: Partial<Lead>) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const updateOffer = useCallback((id: string, patch: Partial<Offer>) => {
    setOffers((os) => os.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }, []);

  const addOffer = useCallback((o: Offer) => setOffers((os) => [o, ...os]), []);
  const removeOffer = useCallback((id: string) => setOffers((os) => os.filter((o) => o.id !== id)), []);

  const setHomeCfg = useCallback((patch: Partial<HomeCfg>) => setHomeCfgState((c) => ({ ...c, ...patch })), []);
  useEffect(() => localStorage.setItem("rd_home", JSON.stringify(homeCfg)), [homeCfg]);

  const pushAiLog = useCallback((intent: string, query: string) => {
    const now = new Date();
    const time = `${now.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })} ${now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;
    setAiLog((l) => [{ id: uid(), time, intent, query }, ...l].slice(0, 40));
  }, []);

  const track = useCallback((k: keyof StoreState["stats"]) => {
    setStats((s) => ({ ...s, [k]: s[k] + 1 }));
  }, []);

  const toast = useCallback((msg: string, tone: "ok" | "warn" = "ok") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  const value = useMemo<StoreState>(
    () => ({
      view, navigate, offers, setOffers, updateOffer, addOffer, removeOffer,
      filters, setFilters, resetFilters, favorites, toggleFavorite, compare,
      toggleCompare, clearCompare, leads, addLead, updateLead, homeCfg, setHomeCfg,
      filterBlocks, setFilterBlocks, aiScenarios, setAiScenarios, aiEnabled, setAiEnabled,
      aiLog, pushAiLog, stats, track, toast, toasts, geoDistrict: "Пресненский", adminAuthed, setAdminAuthed,
    }),
    [view, navigate, offers, updateOffer, addOffer, removeOffer, filters, setFilters, resetFilters,
      favorites, toggleFavorite, compare, toggleCompare, clearCompare, leads, addLead, updateLead,
      homeCfg, setHomeCfg, filterBlocks, aiScenarios, aiEnabled, aiLog, pushAiLog, stats, track, toast,
      toasts, adminAuthed]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore outside provider");
  return ctx;
}

export const topBenefits = (offers: Offer[], n = 3): Offer[] =>
  [...offers].filter((o) => o.isActive).sort((a, b) => programBenefit(b) - programBenefit(a)).slice(0, n);
