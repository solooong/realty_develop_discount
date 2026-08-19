export type TargetGroup = "family" | "investor" | "individual";
export type PaymentType = "fixed" | "monthly" | "quarterly" | "deferred";
export type FeedStatus = "success" | "error" | "pending";

export interface Offer {
  id: string;
  developer: string;
  project: string;
  propertyType: "квартира" | "студия" | "апартаменты";
  district: string;
  metro: string;
  address: string;
  lat: number;
  lng: number;
  /** цена с ремонтом — перечёркнутая витринная цена */
  priceWithRepair: number;
  /** базовая цена — именно по ней работают фильтры */
  basePrice: number;
  /** цена по субсидированной программе застройщика */
  programPrice: number;
  minDownPaymentPercent: number;
  termMonths: number;
  interestRatePercent: number;
  /** удорожание при рассрочке, % */
  priceMarkupPercent: number;
  /** фиксированная наценка, ₽ */
  objectMarkupFixed: number;
  paymentType: PaymentType;
  isInterestFree: boolean;
  hasKeyEarlyRelease: boolean;
  isForPregnant: boolean;
  isForFamilies: boolean;
  canSwitchToMortgage: boolean;
  isItMortgage: boolean;
  acceptsMaternityCapital: boolean;
  hasTradeIn: boolean;
  infrastructure: ("школа" | "сад" | "парк" | "поликлиника" | "двор без машин")[];
  rooms: number; // 0 = студия
  areaMin: number;
  areaMax: number;
  readyQuarter: string;
  programName: string;
  description: string;
  feedUrl: string;
  feedStatus: FeedStatus;
  feedLastSynced: string;
  feedObjects: number;
  isActive: boolean;
  rentEstimate: number; // ₽/мес для расчёта ROI
  priceGrowthYear: number; // динамика цен района, %
  hue: number; // палитра фасад-арта
}

export const PAYMENT_LABELS: Record<PaymentType, string> = {
  fixed: "Фиксированный платёж",
  monthly: "Ежемесячные платежи",
  quarterly: "Ежеквартальные платежи",
  deferred: "Отложенный платёж",
};

export const GROUP_LABELS: Record<TargetGroup, string> = {
  family: "Молодая семья",
  investor: "Инвестор",
  individual: "Индивидуальный покупатель",
};

const M = 1_000_000;

export const SEED_OFFERS: Offer[] = [
  {
    id: "o1", developer: "Level Group", project: "Level Причальный", propertyType: "квартира",
    district: "Пресненский", metro: "Деловой центр", address: "Причальный проезд, 8", lat: 55.747, lng: 37.538,
    priceWithRepair: 19_400_000, basePrice: 18_200_000, programPrice: 16_050_000,
    minDownPaymentPercent: 30, termMonths: 12, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "fixed", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "парк", "двор без машин"], rooms: 2, areaMin: 54, areaMax: 61, readyQuarter: "IV кв. 2026",
    programName: "Рассрочка 0% «Причал»", description: "Беспроцентная рассрочка на 12 месяцев с фиксированным платежом. Переход на семейную или IT-ипотеку в любой момент без штрафа.",
    feedUrl: "https://feeds.levelgroup.ru/yandex-realty.xml", feedStatus: "success", feedLastSynced: "сегодня, 09:41", feedObjects: 214,
    isActive: true, rentEstimate: 95_000, priceGrowthYear: 14.2, hue: 158,
  },
  {
    id: "o2", developer: "ГК Эталон", project: "Эталон на Нагатиной", propertyType: "квартира",
    district: "Нагатино-Садовники", metro: "Нагатинская", address: "ул. Речников, 7", lat: 55.682, lng: 37.663,
    priceWithRepair: 13_900_000, basePrice: 12_800_000, programPrice: 10_560_000,
    minDownPaymentPercent: 10, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 3, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: true, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк"], rooms: 1, areaMin: 38, areaMax: 42, readyQuarter: "II кв. 2027",
    programName: "«Минимальный ПВ 10%»", description: "Вход от 10% первого взноса, ключи до полной оплаты по 214-ФЗ. Удорожание всего 3% при переходе на рассрочку.",
    feedUrl: "https://data.etalongroup.ru/realty-feed.xml", feedStatus: "success", feedLastSynced: "сегодня, 08:12", feedObjects: 168,
    isActive: true, rentEstimate: 62_000, priceGrowthYear: 9.8, hue: 204,
  },
  {
    id: "o3", developer: "ДСК-1", project: "Румянцево-Парк", propertyType: "квартира",
    district: "Новомосковский", metro: "Румянцево", address: "Киевское ш., 22-й км", lat: 55.633, lng: 37.435,
    priceWithRepair: 9_700_000, basePrice: 8_900_000, programPrice: 7_830_000,
    minDownPaymentPercent: 15, termMonths: 36, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 150_000,
    paymentType: "quarterly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад", "парк", "поликлиника"], rooms: 2, areaMin: 52, areaMax: 58, readyQuarter: "Сдан",
    programName: "«Семейная рассрочка 36 мес»", description: "Ежеквартальные платежи на 3 года без процентов. Действует для семей с детьми до 7 лет и под материнский капитал.",
    feedUrl: "https://dsk1.ru/export/yandex-feed.xml", feedStatus: "pending", feedLastSynced: "вчера, 23:00", feedObjects: 96,
    isActive: true, rentEstimate: 45_000, priceGrowthYear: 7.4, hue: 92,
  },
  {
    id: "o4", developer: "ГК ФСК", project: "Сидней Сити", propertyType: "квартира",
    district: "Хорошёво-Мнёвники", metro: "Мнёвники", address: "ул. Нижние Мнёвники", lat: 55.758, lng: 37.467,
    priceWithRepair: 22_600_000, basePrice: 21_300_000, programPrice: 18_300_000,
    minDownPaymentPercent: 20, termMonths: 18, interestRatePercent: 7, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: false, hasKeyEarlyRelease: true, isForPregnant: true, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: true,
    infrastructure: ["школа", "парк", "двор без машин"], rooms: 2, areaMin: 58, areaMax: 64, readyQuarter: "III кв. 2026",
    programName: "«Скидка 14% + 7% годовых»", description: "Скидка 14% от базовой цены при рассрочке под 7% годовых. Ключи выдаются после выплаты 50% стоимости.",
    feedUrl: "https://fsk.ru/feeds/realty.xml", feedStatus: "success", feedLastSynced: "сегодня, 07:55", feedObjects: 143,
    isActive: true, rentEstimate: 105_000, priceGrowthYear: 11.6, hue: 24,
  },
  {
    id: "o5", developer: "ПИК", project: "Западный порт", propertyType: "студия",
    district: "Филёвский Парк", metro: "Фили", address: "Заречная ул., 2", lat: 55.743, lng: 37.512,
    priceWithRepair: 11_200_000, basePrice: 10_400_000, programPrice: 9_570_000,
    minDownPaymentPercent: 20, termMonths: 12, interestRatePercent: 0, priceMarkupPercent: 2, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: false,
    infrastructure: ["парк", "двор без машин"], rooms: 0, areaMin: 24, areaMax: 28, readyQuarter: "IV кв. 2026",
    programName: "«Инвест-студия 0%»", description: "Самый ликвидный формат у делового центра: студия под аренду с доходностью от 6,8% годовых и рассрочкой без переплаты.",
    feedUrl: "https://api.pik.ru/realty/yandex.xml", feedStatus: "success", feedLastSynced: "сегодня, 10:02", feedObjects: 321,
    isActive: true, rentEstimate: 58_000, priceGrowthYear: 12.1, hue: 262,
  },
  {
    id: "o6", developer: "MR Group", project: "Метрополия", propertyType: "квартира",
    district: "Южнопортовый", metro: "Волгоградский проспект", address: "Волгоградский пр-т, 32", lat: 55.718, lng: 37.728,
    priceWithRepair: 16_300_000, basePrice: 15_200_000, programPrice: 13_070_000,
    minDownPaymentPercent: 25, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 4, objectMarkupFixed: 0,
    paymentType: "deferred", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад", "двор без машин"], rooms: 1, areaMin: 40, areaMax: 46, readyQuarter: "I кв. 2027",
    programName: "«Отложенный платёж 60/40»", description: "60% — в конце срока, 40% равными долями. Удорожание 4% уже включено, скрытых комиссий нет.",
    feedUrl: "https://mr-group.ru/exports/feed.xml", feedStatus: "error", feedLastSynced: "2 ч. назад", feedObjects: 87,
    isActive: true, rentEstimate: 72_000, priceGrowthYear: 8.9, hue: 336,
  },
  {
    id: "o7", developer: "ГК Самолёт", project: "Пригород Лесное", propertyType: "квартира",
    district: "Ленинский округ", metro: "Домодедовская", address: "д. Апаринки", lat: 55.563, lng: 37.679,
    priceWithRepair: 8_400_000, basePrice: 7_800_000, programPrice: 6_790_000,
    minDownPaymentPercent: 10, termMonths: 48, interestRatePercent: 0, priceMarkupPercent: 5, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: true, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк", "поликлиника"], rooms: 2, areaMin: 55, areaMax: 62, readyQuarter: "III кв. 2027",
    programName: "«Долгосрочная 4 года»", description: "Рассрочка до 48 месяцев для семей: ПВ от 10%, программа «Беременным», trade-in старой квартиры в зачёт.",
    feedUrl: "https://samolet.ru/feed/yandex-realty.xml", feedStatus: "success", feedLastSynced: "сегодня, 06:30", feedObjects: 275,
    isActive: true, rentEstimate: 38_000, priceGrowthYear: 6.7, hue: 130,
  },
  {
    id: "o8", developer: "Донстрой", project: "Остров", propertyType: "квартира",
    district: "Хорошёво-Мнёвники", metro: "Мнёвники", address: "ул. Нижние Мнёвники, вл. 63", lat: 55.768, lng: 37.477,
    priceWithRepair: 31_800_000, basePrice: 29_900_000, programPrice: 25_420_000,
    minDownPaymentPercent: 30, termMonths: 9, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "fixed", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк", "двор без машин"], rooms: 3, areaMin: 84, areaMax: 96, readyQuarter: "Сдан",
    programName: "«0% до ключей»", description: "Короткая рассрочка 9 месяцев до ввода корпуса. Ключи до полной оплаты, фиксированный график платежей.",
    feedUrl: "https://donstroy.com/api/realty-feed", feedStatus: "success", feedLastSynced: "сегодня, 09:58", feedObjects: 112,
    isActive: true, rentEstimate: 150_000, priceGrowthYear: 10.4, hue: 190,
  },
  {
    id: "o9", developer: "Capital Group", project: "Бадаевский", propertyType: "апартаменты",
    district: "Дорогомилово", metro: "Кутузовская", address: "Кутузовский пр-т, 34", lat: 55.739, lng: 37.524,
    priceWithRepair: 42_500_000, basePrice: 39_900_000, programPrice: 35_910_000,
    minDownPaymentPercent: 40, termMonths: 12, interestRatePercent: 8, priceMarkupPercent: 0, objectMarkupFixed: 500_000,
    paymentType: "quarterly", isInterestFree: false, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: false, isItMortgage: false, acceptsMaternityCapital: false, hasTradeIn: true,
    infrastructure: ["парк"], rooms: 2, areaMin: 68, areaMax: 75, readyQuarter: "IV кв. 2027",
    programName: "«Премиум-график»", description: "Ежеквартальные платежи на 12 месяцев под 8%. Знаковый проект на набережной с потенциалом роста 15%+ к вводу.",
    feedUrl: "https://capitalgroup.ru/realty.xml", feedStatus: "pending", feedLastSynced: "вчера, 21:14", feedObjects: 41,
    isActive: true, rentEstimate: 210_000, priceGrowthYear: 15.3, hue: 40,
  },
  {
    id: "o10", developer: "Группа ЛСР", project: "ЗиЛАРТ", propertyType: "квартира",
    district: "Даниловский", metro: "ЗИЛ", address: "ул. Лисицкого, 3", lat: 55.694, lng: 37.658,
    priceWithRepair: 17_800_000, basePrice: 16_600_000, programPrice: 14_440_000,
    minDownPaymentPercent: 20, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 2.5, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: true, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад", "парк", "двор без машин"], rooms: 1, areaMin: 42, areaMax: 48, readyQuarter: "II кв. 2026",
    programName: "«Рассрочка + IT 6%»", description: "0% на 24 месяца с переходом на IT-ипотеку 6%. Район с самой высокой динамикой цены на юге Москвы.",
    feedUrl: "https://lsrgroup.ru/feeds/yandex.xml", feedStatus: "success", feedLastSynced: "сегодня, 05:47", feedObjects: 189,
    isActive: true, rentEstimate: 80_000, priceGrowthYear: 13.5, hue: 220,
  },
  {
    id: "o11", developer: "А101", project: "Прокшино", propertyType: "квартира",
    district: "Новомосковский", metro: "Прокшино", address: "п. Прокшино", lat: 55.601, lng: 37.479,
    priceWithRepair: 10_900_000, basePrice: 10_100_000, programPrice: 8_890_000,
    minDownPaymentPercent: 15, termMonths: 30, interestRatePercent: 0, priceMarkupPercent: 3, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: true, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад", "поликлиника", "двор без машин"], rooms: 1, areaMin: 36, areaMax: 41, readyQuarter: "IV кв. 2026",
    programName: "«Ключи до оплаты»", description: "Заезжайте и живите, пока платите: ключи при ПВ 15%. Программа для беременных и семей с детьми до 7 лет.",
    feedUrl: "https://a101.ru/export/feed.xml", feedStatus: "success", feedLastSynced: "сегодня, 08:26", feedObjects: 154,
    isActive: true, rentEstimate: 47_000, priceGrowthYear: 8.1, hue: 12,
  },
  {
    id: "o12", developer: "ПИК", project: "Саларьево Парк", propertyType: "студия",
    district: "Новомосковский", metro: "Саларьево", address: "Киевское ш., вл. 6", lat: 55.618, lng: 37.421,
    priceWithRepair: 7_900_000, basePrice: 7_300_000, programPrice: 6_500_000,
    minDownPaymentPercent: 20, termMonths: 18, interestRatePercent: 0, priceMarkupPercent: 2, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: false,
    infrastructure: ["сад", "двор без машин"], rooms: 0, areaMin: 22, areaMax: 26, readyQuarter: "I кв. 2027",
    programName: "«Старт 0%»", description: "Самый доступный вход в инвестиционную недвижимость: студия у метро с рассрочкой без переплаты на 18 месяцев.",
    feedUrl: "https://api.pik.ru/realty/yandex.xml", feedStatus: "success", feedLastSynced: "сегодня, 10:02", feedObjects: 321,
    isActive: true, rentEstimate: 40_000, priceGrowthYear: 7.9, hue: 102,
  },
  {
    id: "o13", developer: "ГК Эталон", project: "Крылья", propertyType: "квартира",
    district: "Можайский", metro: "Кунцевская", address: "ул. Генерала Дорохова", lat: 55.711, lng: 37.419,
    priceWithRepair: 14_600_000, basePrice: 13_700_000, programPrice: 12_060_000,
    minDownPaymentPercent: 20, termMonths: 36, interestRatePercent: 4, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "quarterly", isInterestFree: false, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: true, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк"], rooms: 2, areaMin: 50, areaMax: 57, readyQuarter: "III кв. 2027",
    programName: "«4% на 3 года»", description: "Мягкая ставка 4% на 36 месяцев вместо рыночных 21%. Ежеквартальные платежи, можно гасить досрочно без комиссии.",
    feedUrl: "https://data.etalongroup.ru/realty-feed.xml", feedStatus: "success", feedLastSynced: "сегодня, 08:12", feedObjects: 168,
    isActive: true, rentEstimate: 66_000, priceGrowthYear: 9.2, hue: 300,
  },
  {
    id: "o14", developer: "Level Group", project: "Level Стрешнево", propertyType: "квартира",
    district: "Щукино", metro: "Стрешнево", address: "Волоколамское ш., 71", lat: 55.812, lng: 37.487,
    priceWithRepair: 15_900_000, basePrice: 14_800_000, programPrice: 12_730_000,
    minDownPaymentPercent: 25, termMonths: 12, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 120_000,
    paymentType: "deferred", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "парк", "поликлиника"], rooms: 1, areaMin: 39, areaMax: 44, readyQuarter: "Сдан",
    programName: "«70/30 у парка»", description: "30% — после заселения: отложенный платёж в готовом доме у Щукинского парка. Фикс-наценка 120 000 ₽ уже в цене.",
    feedUrl: "https://feeds.levelgroup.ru/yandex-realty.xml", feedStatus: "success", feedLastSynced: "сегодня, 09:41", feedObjects: 214,
    isActive: true, rentEstimate: 69_000, priceGrowthYear: 10.8, hue: 172,
  },
  {
    id: "o15", developer: "ГК ФСК", project: "Режиссёр", propertyType: "квартира",
    district: "Ростокино", metro: "ВДНХ", address: "ул. Сельскохозяйственная, 31", lat: 55.833, lng: 37.642,
    priceWithRepair: 20_100_000, basePrice: 18_900_000, programPrice: 16_820_000,
    minDownPaymentPercent: 30, termMonths: 18, interestRatePercent: 0, priceMarkupPercent: 3.5, objectMarkupFixed: 0,
    paymentType: "fixed", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: true, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк", "двор без машин"], rooms: 3, areaMin: 78, areaMax: 86, readyQuarter: "II кв. 2027",
    programName: "«Семейный квартал»", description: "Фиксированный график на 18 месяцев, рядом Ботанический сад и школы. Программа «беременным»: ПВ можно отложить на 3 мес.",
    feedUrl: "https://fsk.ru/feeds/realty.xml", feedStatus: "success", feedLastSynced: "сегодня, 07:55", feedObjects: 143,
    isActive: true, rentEstimate: 98_000, priceGrowthYear: 9.6, hue: 56,
  },
  {
    id: "o16", developer: "MR Group", project: "City Bay", propertyType: "квартира",
    district: "Покровское-Стрешнево", metro: "Спартак", address: "Волоколамское ш., вл. 71А", lat: 55.819, lng: 37.434,
    priceWithRepair: 24_300_000, basePrice: 22_900_000, programPrice: 19_690_000,
    minDownPaymentPercent: 20, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 4, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк", "двор без машин"], rooms: 2, areaMin: 56, areaMax: 63, readyQuarter: "IV кв. 2027",
    programName: "«У воды 0%»", description: "Первая линия Москвы-реки: рассрочка 0% на 24 мес, ключи до оплаты, переход на IT-ипотеку после сдачи корпуса.",
    feedUrl: "https://mr-group.ru/exports/feed.xml", feedStatus: "success", feedLastSynced: "сегодня, 06:12", feedObjects: 87,
    isActive: true, rentEstimate: 118_000, priceGrowthYear: 12.7, hue: 210,
  },
];

export const DISTRICTS = [...new Set(SEED_OFFERS.map((o) => o.district))].sort((a, b) => a.localeCompare(b, "ru"));

export const DEVELOPERS = [...new Set(SEED_OFFERS.map((o) => o.developer))].sort((a, b) => a.localeCompare(b, "ru"));

/* ---------- FAQ для AI-агента ---------- */
export interface FaqEntry {
  keys: string[];
  q: string;
  a: string;
}

export const FAQ: FaqEntry[] = [
  {
    keys: ["рассрочк", "что такое рассрочка", "installment"],
    q: "Что такое рассрочка от застройщика?",
    a: "Рассрочка — это оплата квартиры частями напрямую застройщику, без банка. Вы вносите первый взнос (обычно 10–30%), остаток делится на равные платежи на срок от 6 до 48 месяцев. Субсидированная рассрочка означает, что застройщик компенсирует часть своей прибыли, поэтому ставка часто 0%.\n\nВ отличие от ипотеки: нет одобрения банка, нет страховок и оценки, сделка проходит за 1–2 дня.",
  },
  {
    keys: ["it", "айти", "ит-ипотек", "ит ипотека"],
    q: "Как работает IT-ипотека?",
    a: "IT-ипотека — госпрограмма для сотрудников аккредитованных IT-компаний: ставка от 6% годовых, лимит кредита до 18 млн ₽ в Москве.\n\nНа портале есть фильтр «IT-ипотека» — он показывает ЖК, где застройщик разрешает перейти с рассрочки на IT-ипотеку в любой момент: пока дом строится, вы платите рассрочку 0%, а после сдачи рефинансируете остаток под 6%.",
  },
  {
    keys: ["материн", "маткап", "сертификат"],
    q: "Можно ли использовать материнский капитал?",
    a: "Да, в большинстве программ. Маткапитал (в 2026 году — 690 тыс. ₽ на первого ребёнка) можно направить на первый взнос или погашение рассрочки.\n\nВключите фильтр «Материнский капитал» — система покажет только подходящие ЖК. После сделки Пенсионный фонд перечисляет деньги застройщику в течение 10 рабочих дней.",
  },
  {
    keys: ["trade", "трейд", "трейд-ин"],
    q: "Что такое Trade-In?",
    a: "Trade-In — обмен вашей старой квартиры на новую в зачёт. Партнёр застройщика оценивает и продаёт вашу недвижимость (обычно за 60–90 дней), а вырученные деньги идут в оплату новой.\n\nНа это время застройщик бесплатно бронирует квартиру и фиксирует цену. Фильтр «Trade-In» покажет ЖК с такой опцией.",
  },
  {
    keys: ["ключ", "до оплаты", "заселен"],
    q: "Что значит «Ключи до оплаты»?",
    a: "Это условие, при котором застройщик передаёт ключи и разрешает заселение или сдачу в аренду ДО полной выплаты рассрочки — обычно после 50–70% выплат.\n\nДля инвестора это означает, что квартира начинает приносить арендный доход, пока вы ещё выплачиваете остаток. Фактически аренда частично гасит вашу рассрочку.",
  },
  {
    keys: ["удорож", "наценк", "markup", "дороже"],
    q: "Почему при рассрочке есть удорожание?",
    a: "Некоторые застройщики добавляют к цене 2–5% (или фикс-сумму) за пользование рассрочкой — это их альтернатива банковскому проценту.\n\nНаш калькулятор всегда показывает полную стоимость С удорожанием и сравнивает её с рыночной ипотекой под 21%: даже с наценкой рассрочка почти всегда выгоднее на сотни тысяч рублей.",
  },
  {
    keys: ["214", "дду", "эскроу", "рисков", "безопасн", "надёжн"],
    q: "Насколько это безопасно?",
    a: "Все предложения на портале — по 214-ФЗ с расчётом через эскроу-счета: деньги хранятся в банке до сдачи дома, а не у застройщика.\n\nЕсли стройка остановится, банк вернёт деньги или фонд развития территорий достроит дом. Рассрочка оформляется тем же договором ДДУ, что и покупка в ипотеку.",
  },
  {
    keys: ["отложен", "дефер"],
    q: "Что такое отложенный платёж?",
    a: "Схема, при которой значительная часть (обычно 40–60%) выплачивается одним платежом в конце срока, а до этого вы платите небольшие суммы.\n\nУдобно, если ждёте поступления денег: продажу старой квартиры, бонус, снятие депозита. Фильтр «Отложенный платёж» покажет такие программы.",
  },
  {
    keys: ["семейн", "семья", "дет"],
    q: "Какие программы есть для семей?",
    a: "Для семей с детьми доступны: семейная ипотека 6% (дети до 7 лет или два несовершеннолетних), переход с рассрочки на семейную ипотеку после сдачи, программы «Беременным» с отсрочкой первого взноса, маткапитал в зачёт.\n\nВыберите профиль «Молодая семья» в начале подбора — фильтры соберутся автоматически.",
  },
  {
    keys: ["доходн", "roi", "окупаем", "аренд", "инвест"],
    q: "Как считается доходность для инвестора?",
    a: "ROI = (аренда × 12) ÷ цена квартиры × 100%. Для студий у метро в Москве это сейчас 6–8% годовых.\n\nСрок окупаемости = цена ÷ (аренда × 12). В профиле «Инвестор» мы сортируем выдачу по ROI и показываем динамику цен района: рассрочка усиливает доходность, так как ваш капитал (ПВ) работает с плечом.",
  },
];

/* ---------- конфигурация админки (ТЗ №5) ---------- */
export interface FilterBlockCfg {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  groups: TargetGroup[];
}

export const DEFAULT_FILTER_BLOCKS: FilterBlockCfg[] = [
  { id: "geo", label: "Район и метро", visible: true, order: 1, groups: ["family", "investor", "individual"] },
  { id: "rooms", label: "Количество комнат", visible: true, order: 2, groups: ["family", "investor", "individual"] },
  { id: "programs", label: "Льготные программы", visible: true, order: 3, groups: ["family", "investor", "individual"] },
  { id: "payment", label: "Тип рассрочки", visible: true, order: 4, groups: ["investor", "individual"] },
  { id: "conditions", label: "Уникальные условия", visible: true, order: 5, groups: ["family", "investor", "individual"] },
  { id: "term", label: "Срок и первый взнос", visible: true, order: 6, groups: ["family", "individual"] },
  { id: "infra", label: "Инфраструктура", visible: true, order: 7, groups: ["family"] },
  { id: "invest", label: "Инвестиционные параметры", visible: true, order: 8, groups: ["investor"] },
];

export interface AiScenarioCfg {
  id: string;
  label: string;
  desc: string;
  enabled: boolean;
  coverage: number; // % запросов, которые закрывает сценарий
}

export const DEFAULT_AI_SCENARIOS: AiScenarioCfg[] = [
  { id: "match", label: "Подбор по запросу", desc: "Распознаёт бюджет, ЦГ, комнаты и условия из свободной фразы и применяет фильтры", enabled: true, coverage: 38 },
  { id: "calc", label: "Калькулятор в чате", desc: "Считает платёж по рассрочке и сравнивает с рыночной ипотекой", enabled: true, coverage: 21 },
  { id: "faq", label: "FAQ по программам", desc: "Отвечает на вопросы о рассрочке, IT-ипотеке, маткапитале, trade-in", enabled: true, coverage: 24 },
  { id: "handoff", label: "Передача менеджеру", desc: "Собирает контакт и передаёт диалог партнёру-застройщику", enabled: true, coverage: 9 },
  { id: "notify", label: "Умные уведомления", desc: "Подписывает на новые программы по сохранённым критериям", enabled: false, coverage: 0 },
];

export const MARKET_MORTGAGE_RATE = 21; // % годовых, ориентир ЦБ на 2026
export const BANKS = [
  { name: "Сбер", rate: 21.3 },
  { name: "ДОМ.РФ", rate: 20.6 },
  { name: "ВТБ", rate: 21.5 },
  { name: "Альфа-Банк", rate: 21.9 },
];
