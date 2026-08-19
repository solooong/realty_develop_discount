import { MARKET_MORTGAGE_RATE, type Offer } from "../data/offers";

export const fmtMoney = (n: number, compact = false): string => {
  if (compact && Math.abs(n) >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m.toLocaleString("ru-RU", { maximumFractionDigits: Math.abs(m) < 10 ? 1 : 0 })} млн ₽`;
  }
  return `${Math.round(n).toLocaleString("ru-RU")} ₽`;
};

export const fmtNum = (n: number, digits = 0): string =>
  n.toLocaleString("ru-RU", { maximumFractionDigits: digits, minimumFractionDigits: 0 });

/** Полная цена при рассрочке с учётом удорожания (% + фикс) */
export const installmentTotal = (o: Offer): number =>
  o.programPrice * (1 + o.priceMarkupPercent / 100) + o.objectMarkupFixed;

/** Ежемесячный платёж по рассрочке при заданных ПВ и сроке */
export function installmentMonthly(o: Offer, downPct: number, termMonths: number): number {
  const total = installmentTotal(o);
  const down = (total * downPct) / 100;
  const rest = total - down;
  const r = o.interestRatePercent / 100 / 12;
  if (o.paymentType === "deferred") {
    // 60% в конце срока, 40% равными долями
    const tail = rest * 0.6;
    const annuity = r > 0 ? (rest * 0.4 * r) / (1 - Math.pow(1 + r, -termMonths)) : (rest * 0.4) / termMonths;
    return annuity + tail / termMonths; // усреднённый ежемесячный эквивалент
  }
  if (r > 0) return (rest * r) / (1 - Math.pow(1 + r, -termMonths));
  return rest / termMonths;
}

/** Переплата по рассрочке (удорожание + проценты) */
export function installmentOverpayment(o: Offer, downPct: number, termMonths: number): number {
  const total = installmentTotal(o);
  const down = (total * downPct) / 100;
  const rest = total - down;
  const r = o.interestRatePercent / 100 / 12;
  let paid: number;
  if (o.paymentType === "deferred") {
    const tail = rest * 0.6;
    const annuity = r > 0 ? (rest * 0.4 * r) / (1 - Math.pow(1 + r, -termMonths)) : (rest * 0.4) / termMonths;
    paid = annuity * termMonths + tail;
  } else if (r > 0) {
    paid = ((rest * r) / (1 - Math.pow(1 + r, -termMonths))) * termMonths;
  } else {
    paid = rest;
  }
  return paid + down - o.programPrice;
}

/** Аннуитетный платёж по рыночной ипотеке */
export function mortgageMonthly(price: number, downPct: number, annualRate: number, years: number): number {
  const body = price * (1 - downPct / 100);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return body / n;
  return (body * r) / (1 - Math.pow(1 + r, -n));
}

export interface CalcResult {
  monthly: number;
  down: number;
  total: number;
  overpayment: number;
  mortgageMonthly: number;
  mortgageTotal: number;
  benefit: number; // выгода против рыночной ипотеки
}

export function calcScenario(o: Offer, downPct: number, termMonths: number, mortgageRate = MARKET_MORTGAGE_RATE, mortgageYears = 25): CalcResult {
  const total = installmentTotal(o);
  const down = (total * downPct) / 100;
  const monthly = installmentMonthly(o, downPct, termMonths);
  const overpayment = installmentOverpayment(o, downPct, termMonths);
  const mMonthly = mortgageMonthly(o.programPrice, downPct, mortgageRate, mortgageYears);
  const mTotal = mMonthly * mortgageYears * 12 + (o.programPrice * downPct) / 100;
  return {
    monthly,
    down,
    total: total + overpayment,
    overpayment,
    mortgageMonthly: mMonthly,
    mortgageTotal: mTotal,
    benefit: mTotal - (total + overpayment),
  };
}

/** ROI и окупаемость для инвестора */
export function roiStats(o: Offer) {
  const price = o.programPrice;
  const annualRent = o.rentEstimate * 12;
  const roi = (annualRent / price) * 100;
  const paybackYears = price / annualRent;
  return { roi, paybackYears, annualRent };
}

/** Абсолютная выгода по программе застройщика */
export const programBenefit = (o: Offer): number => o.basePrice - o.programPrice;

export const discountPercent = (o: Offer): number => ((o.basePrice - o.programPrice) / o.basePrice) * 100;

/** Кумулятивные выплаты по месяцам для графика сравнения */
export function cumulativePayments(o: Offer, downPct: number, termMonths: number): number[] {
  const total = installmentTotal(o);
  const down = (total * downPct) / 100;
  const monthly = installmentMonthly(o, downPct, termMonths);
  const points: number[] = [down];
  for (let m = 1; m <= termMonths; m++) {
    points.push(Math.min(total + installmentOverpayment(o, downPct, termMonths), down + monthly * m));
  }
  return points;
}

export const plural = (n: number, one: string, few: string, many: string): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};

export const roomsLabel = (rooms: number): string =>
  rooms === 0 ? "Студия" : `${rooms}-комн.`;
