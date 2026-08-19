import React, { useEffect, useRef, useState } from "react";
import { useStore, filterOffers, PROGRAM_OPTIONS, DEFAULT_FILTERS } from "../lib/store";
import { calcScenario, fmtMoney, roomsLabel, programBenefit, installmentMonthly } from "../lib/finance";
import { FAQ, GROUP_LABELS, type Offer, type TargetGroup } from "../data/offers";
import { FacadeArt, IcSpark, IcX, IcSend, IcArrowR } from "./ui";

interface BotMsg {
  id: number;
  from: "user" | "bot";
  text?: string;
  chips?: string[];
  results?: Offer[];
}

const WELCOME_CHIPS = [
  "Подбери двушку для семьи до 15 млн",
  "Рассчитай платёж: 12 млн, ПВ 20%, 24 мес",
  "Что такое ключи до оплаты?",
  "Покажи IT-ипотеку",
];

export default function AiAgent() {
  const store = useStore();
  const { aiEnabled, aiScenarios, offers, setFilters, navigate, toast, pushAiLog, addLead } = store;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<BotMsg[]>([]);
  const idRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  const scenarioOn = (id: string) => aiEnabled && aiScenarios.find((s) => s.id === id)?.enabled;

  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener("open-ai", h);
    return () => window.removeEventListener("open-ai", h);
  }, []);

  useEffect(() => {
    if (open && msgs.length === 0) {
      push({
        from: "bot",
        text: "Здравствуйте! Я Домовой — AI-агент портала. Понимаю запросы вроде «двушка для семьи до 15 млн без процентов», считаю платежи по рассрочке и сравниваю с ипотекой под 21%.\n\nС чего начнём?",
        chips: WELCOME_CHIPS,
      });
    }
  }, [open]); // eslint-disable-line

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  function push(m: Omit<BotMsg, "id">) {
    setMsgs((prev) => [...prev, { ...m, id: ++idRef.current }]);
  }

  function send(text: string) {
    const q = text.trim();
    if (!q || typing) return;
    setInput("");
    push({ from: "user", text: q });
    setTyping(true);
    const delay = 650 + Math.min(q.length * 8, 900);
    setTimeout(() => {
      const reply = process(q);
      setTyping(false);
      push(reply);
    }, delay);
  }

  /* ================= "NLU" ================= */
  function process(qRaw: string): Omit<BotMsg, "id"> {
    const q = qRaw.toLowerCase();

    // --- калькулятор ---
    const wantsCalc = /(плат[её]ж|рассчит|калькул|посчит|сколько платить)/.test(q);
    const priceMatch = q.match(/(\d+(?:[.,]\d+)?)\s*(млн|миллион)/);
    const pvMatch = q.match(/(?:пв|взнос)\s*(\d{1,2})/);
    const termMatch = q.match(/(\d{1,2})\s*(мес|месяц|лет|год)/);
    if (wantsCalc && scenarioOn("calc")) {
      const price = priceMatch ? parseFloat(priceMatch[1].replace(",", ".")) * 1e6 : 12_000_000;
      const pv = pvMatch ? parseInt(pvMatch[1]) : 20;
      let term = termMatch ? parseInt(termMatch[1]) : 24;
      if (termMatch && /(лет|год)/.test(termMatch[2])) term *= 12;
      const fake: Offer = { ...offers[0], programPrice: price, priceMarkupPercent: 0, objectMarkupFixed: 0, interestRatePercent: 0, paymentType: "monthly" };
      const r = calcScenario(fake, pv, term);
      pushAiLog("Калькулятор", qRaw);
      return {
        from: "bot",
        text:
          `Считаю для квартиры за ${fmtMoney(price)}:\n\n` +
          `• Первый взнос ${pv}% — ${fmtMoney(r.down)}\n` +
          `• Платёж по рассрочке 0% на ${term} мес — ${fmtMoney(r.monthly)}/мес\n` +
          `• Итого к выплате — ${fmtMoney(r.total)}\n\n` +
          `Рыночная ипотека под 21% на 25 лет — ${fmtMoney(r.mortgageMonthly)}/мес, итог ${fmtMoney(r.mortgageTotal)}.\n\n` +
          `✅ Выгода рассрочки: ${fmtMoney(r.benefit, true)}. Это как ${Math.round(r.benefit / 90)} месяцев аренды студии.`,
        chips: ["Покажи квартиры до " + (price / 1e6) + " млн", "Что такое удорожание?", "Позвать менеджера"],
      };
    }

    // --- передача менеджеру ---
    if (/(менеджер|позвон|человек|оператор|свяж)/.test(q) && scenarioOn("handoff")) {
      pushAiLog("Передача менеджеру", qRaw);
      addLead({ type: "ai_handoff", name: "Диалог с AI-агентом", phone: "—", offerId: undefined, comment: `Запрос: ${qRaw.slice(0, 80)}` });
      return {
        from: "bot",
        text: "Передал ваш диалог менеджеру партнёра — заявка уже в CRM застройщика. Перезвонят в течение 15 минут в рабочее время (9:00–21:00 МСК).\n\nПока ждёте, могу подобрать варианты по вашим критериям?",
        chips: ["Подбери варианты", "Что такое рассрочка?"],
      };
    }

    // --- FAQ ---
    const faqHit = FAQ.find((f) => f.keys.some((k) => q.includes(k)) && !/(подбер|найди|покаж)/.test(q));
    if (faqHit && scenarioOn("faq")) {
      pushAiLog("FAQ", qRaw);
      return { from: "bot", text: faqHit.a, chips: ["Подбери варианты", "Рассчитай платёж: 12 млн, ПВ 20%, 24 мес"] };
    }

    // --- сравнение ---
    if (/сравни/.test(q)) {
      pushAiLog("Навигация", qRaw);
      navigate({ name: "compare" });
      return { from: "bot", text: "Открываю таблицу сравнения — там до 4 ЖК с платежами, переплатой и графиком выплат против ипотеки под 21%." };
    }

    // --- приветствие ---
    if (/(привет|здравств|добрый|доброе|хай|спасибо)/.test(q) && !/(подбер|найди|покаж)/.test(q)) {
      pushAiLog("Приветствие", qRaw);
      return { from: "bot", text: "Здравствуйте! Подберу квартиру по субсидированной программе или посчитаю платёж. Опишите запрос одной фразой — например: «студия для инвестиции до 10 млн, ключи до оплаты».", chips: WELCOME_CHIPS };
    }

    // --- подбор ---
    const wantsMatch = /(подбер|найди|покаж|хочу|нужн|ищу|выбер|квартир|студи|жк|двуш|однуш|тр[её]ш)/.test(q);
    if (wantsMatch && scenarioOn("match")) {
      const f = { ...DEFAULT_FILTERS };
      let group: TargetGroup | null = null;
      if (/(семь|реб[её]н|дети|брачн)/.test(q)) group = "family";
      else if (/(инвест|доходн|сдач|арендн|окупаем)/.test(q)) group = "investor";
      else if (/(для себя|индивидуальн|сам д)/.test(q)) group = "individual";
      f.group = group ?? store.filters.group;

      if (priceMatch) f.budget = Math.round(parseFloat(priceMatch[1].replace(",", ".")) * 1e6);
      const rooms: number[] = [];
      if (/студ/.test(q)) rooms.push(0);
      if (/(1[-\s]?к|однуш|1[-\s]?комн)/.test(q)) rooms.push(1);
      if (/(2[-\s]?к|двуш|2[-\s]?комн)/.test(q)) rooms.push(2);
      if (/(3[-\s]?к|тр[её]ш|3[-\s]?комн)/.test(q)) rooms.push(3);
      if (rooms.length) f.rooms = rooms;

      const programs: string[] = [];
      if (/(без процент|0\s?%|беспроцент)/.test(q)) programs.push("interest-free");
      if (/(it|айти|ит-ипотек|ит ипотек)/.test(q)) { programs.push("it"); f.conditions = [...f.conditions, "it"]; }
      if (/(семейн|маткап|материн)/.test(q)) programs.push("family");
      if (/(маткап|материн)/.test(q)) programs.push("matkap");
      f.programs = [...new Set(programs)];

      if (/ключ/.test(q)) f.conditions = [...new Set([...f.conditions, "keys"])];
      if (/trade|трейд/.test(q)) f.conditions = [...new Set([...f.conditions, "tradein"])];
      if (/отлож/.test(q)) f.payments = ["deferred"];
      if (/долгосроч|3 год|4 год/.test(q)) f.conditions = [...new Set([...f.conditions, "long"])];

      const found = filterOffers(offers, f);
      pushAiLog("Подбор", qRaw);
      if (found.length === 0) {
        setFilters(f);
        return {
          from: "bot",
          text: `По вашему запросу сейчас нет точных совпадений. Обычно помогает одно из трёх:\n\n1. Увеличить бюджет на 10–15%\n2. Снять фильтр по типу рассрочки\n3. Расширить район\n\nПоказать варианты с бюджетом ${fmtMoney(f.budget * 1.15, true)}?`,
          chips: ["Покажи с бюджетом +15%", "Сбрось фильтры"],
        };
      }
      const top = [...found].sort((a, b) => programBenefit(b) - programBenefit(a)).slice(0, 3);
      setFilters(f);
      return {
        from: "bot",
        text:
          `Нашёл ${found.length} ${found.length === 1 ? "вариант" : found.length < 5 ? "варианта" : "вариантов"} · профиль «${GROUP_LABELS[f.group]}», бюджет до ${fmtMoney(f.budget, true)}.\n\nТоп-3 по выгоде:\n` +
          top.map((o, i) => `${i + 1}. ${o.project} — ${fmtMoney(o.programPrice, true)}, выгода ${fmtMoney(programBenefit(o), true)}, ${o.interestRatePercent === 0 ? "0%" : o.interestRatePercent + "%"} на ${o.termMonths} мес`).join("\n") +
          `\n\nПрименил фильтры — вся выдача уже на странице результатов.`,
        results: top,
        chips: ["Показать все результаты", "Рассчитай платёж по первому", "Что такое удорожание?"],
      };
    }

    // --- fallback ---
    pushAiLog("Другое", qRaw);
    return {
      from: "bot",
      text: "Пока я учусь понимать такие запросы 🏗 В прототипе я уверенно делаю четыре вещи:\n\n1. Подбор по фразе (бюджет, комнаты, программы)\n2. Расчёт платежа и выгоды против ипотеки\n3. Ответы на вопросы о рассрочках\n4. Передача диалога менеджеру\n\nПопробуйте один из вариантов ниже:",
      chips: WELCOME_CHIPS,
    };
  }

  if (!aiEnabled) return null;

  return (
    <>
      {/* floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Открыть чат с AI-агентом"
          className="pulse-ring fixed bottom-6 right-6 z-[80] grid h-16 w-16 place-items-center rounded-full bg-pine-800 text-amber-300 shadow-pop transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <IcSpark size={26} />
          <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-amber-400 font-display text-[10px] font-bold text-pine-950">AI</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 z-[85] flex h-[min(600px,calc(100dvh-2rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-pop anim-scale-in">
          {/* header */}
          <div className="flex items-center gap-3 bg-pine-900 px-4 py-3">
            <div className="relative grid h-10 w-10 flex-none place-items-center rounded-full bg-pine-700 text-amber-300">
              <IcSpark size={20} />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-pine-900 bg-pine-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display text-[13px] font-semibold text-paper">Домовой · AI-агент</div>
              <div className="text-[11px] text-pine-300">онлайн · отвечает за ~2 сек · демо без LLM-API</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Закрыть чат" className="text-pine-300 transition-colors hover:text-paper">
              <IcX size={18} />
            </button>
          </div>

          {/* messages */}
          <div ref={listRef} className="thin-scroll flex-1 space-y-3 overflow-y-auto px-3.5 py-4">
            {msgs.map((m) =>
              m.from === "user" ? (
                <div key={m.id} className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-pine-800 px-3.5 py-2.5 text-[13px] leading-relaxed text-paper anim-fade-up">
                  {m.text}
                </div>
              ) : (
                <div key={m.id} className="max-w-[92%] space-y-2 anim-fade-up">
                  <div className="rounded-lg rounded-bl-sm border border-line bg-card px-3.5 py-2.5 text-[13px] leading-relaxed text-ink whitespace-pre-line">
                    {m.text}
                  </div>
                  {m.results && m.results.length > 0 && (
                    <div className="space-y-2">
                      {m.results.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => { setOpen(false); navigate({ name: "offer", offerId: o.id }); }}
                          className="flex w-full items-center gap-2.5 overflow-hidden rounded-lg border border-line bg-card text-left transition-all hover:-translate-y-0.5 hover:border-pine-600 hover:shadow-lift"
                        >
                          <FacadeArt offer={o} className="h-12 w-16 flex-none" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[12.5px] font-bold text-ink">{o.project}</div>
                            <div className="text-[11px] text-ink-soft">{fmtMoney(o.programPrice, true)} · выгода {fmtMoney(programBenefit(o), true)} · {roomsLabel(o.rooms)}</div>
                          </div>
                          <IcArrowR size={14} className="mr-2 flex-none text-pine-600" />
                        </button>
                      ))}
                    </div>
                  )}
                  {m.chips && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.chips.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            if (c === "Показать все результаты") { navigate({ name: "results" }); return; }
                            if (c === "Сбрось фильтры") { store.resetFilters(); toast("Фильтры сброшены"); navigate({ name: "results" }); return; }
                            if (c.startsWith("Покажи с бюджетом")) { setFilters({ budget: Math.round(store.filters.budget * 1.15 / 100_000) * 100_000 }); navigate({ name: "results" }); return; }
                            if (c === "Рассчитай платёж по первому" && m.results?.[0]) {
                              const o = m.results[0];
                              const pay = installmentMonthly(o, Math.max(o.minDownPaymentPercent, 20), o.termMonths);
                              send(`Рассчитай платёж: ${(o.programPrice / 1e6).toFixed(0)} млн, ПВ ${Math.max(o.minDownPaymentPercent, 20)}, ${o.termMonths} мес (жк ${o.project}, факт. платёж ≈ ${fmtMoney(pay)})`);
                              return;
                            }
                            send(c);
                          }}
                          className="rounded-full border border-pine-300 bg-mint px-3 py-1.5 text-[12px] font-semibold text-pine-800 transition-all hover:border-pine-600 hover:bg-pine-100 active:scale-95"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
            {typing && (
              <div className="flex w-14 items-center justify-center gap-1 rounded-lg rounded-bl-sm border border-line bg-card py-3">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-pine-600" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-pine-600" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-pine-600" />
              </div>
            )}
          </div>

          {/* input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-line bg-card px-3 py-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Например: студия до 10 млн под аренду…"
              className="min-w-0 flex-1 rounded-md border border-line bg-paper px-3 py-2 text-[13px] outline-none transition-colors placeholder:text-ink-faint focus:border-pine-600"
            />
            <button type="submit" aria-label="Отправить" disabled={!input.trim()}
              className="grid h-9 w-9 flex-none place-items-center rounded-md bg-pine-800 text-paper transition-all enabled:hover:bg-pine-700 enabled:active:scale-90 disabled:opacity-40">
              <IcSend size={16} />
            </button>
          </form>
          <div className="bg-card px-3 pb-2 text-center text-[10px] text-ink-faint">
            Прототип: правила + намерения · в релизе — LLM с контекстом сделок
          </div>
        </div>
      )}
    </>
  );
}
