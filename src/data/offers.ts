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
  {
    id: "o15", developer: "Донстрой", project: "Символ. Квартал Свобода", propertyType: "студия",
    district: "Лефортово", metro: "Площадь Ильича", address: "Золоторожский Вал, 11", lat: 55.747, lng: 37.687,
    priceWithRepair: 10_900_000, basePrice: 10_100_000, programPrice: 9_240_000,
    minDownPaymentPercent: 15, termMonths: 36, interestRatePercent: 0, priceMarkupPercent: 2, objectMarkupFixed: 0,
    paymentType: "deferred", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: false,
    infrastructure: ["парк", "двор без машин"], rooms: 0, areaMin: 24, areaMax: 28, readyQuarter: "III кв. 2027",
    programName: "«Отложенный платёж 36 мес»", description: "60% стоимости — одним платежом в конце срока, до этого минимальные взносы. Ключи до полной оплаты, переход на IT-ипотеку после сдачи.",
    feedUrl: "https://donstroy.com/feeds/yandex.xml", feedStatus: "success", feedLastSynced: "сегодня, 05:47", feedObjects: 132,
    isActive: true, rentEstimate: 52_000, priceGrowthYear: 10.4, hue: 262,
  },
  {
    id: "o16", developer: "Самолёт", project: "Люберцы. Квартал 4", propertyType: "квартира",
    district: "Люберцы", metro: "Лухмановская", address: "ул. Вертолётчиков, 5", lat: 55.702, lng: 37.928,
    priceWithRepair: 9_100_000, basePrice: 8_400_000, programPrice: 7_140_000,
    minDownPaymentPercent: 10, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: true, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад", "парк", "поликлиника"], rooms: 3, areaMin: 72, areaMax: 80, readyQuarter: "II кв. 2028",
    programName: "«Семейная 10% ПВ»", description: "Рассрочка 0% для семей с детьми до 7 лет и беременных, ПВ от 10%. Материнский капитал в зачёт первого взноса.",
    feedUrl: "https://samolet.ru/export/feed.xml", feedStatus: "success", feedLastSynced: "сегодня, 09:02", feedObjects: 201,
    isActive: true, rentEstimate: 58_000, priceGrowthYear: 8.1, hue: 36,
  },
  {
    id: "o17", developer: "MR Group", project: "SLAVA. Апарт-квартал", propertyType: "апартаменты",
    district: "Беговой", metro: "Белорусская", address: "Ленинградский пр-т, 21", lat: 55.779, lng: 37.583,
    priceWithRepair: 26_400_000, basePrice: 24_900_000, programPrice: 21_100_000,
    minDownPaymentPercent: 25, termMonths: 18, interestRatePercent: 5, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: false, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: true,
    infrastructure: ["двор без машин"], rooms: 1, areaMin: 40, areaMax: 46, readyQuarter: "IV кв. 2026",
    programName: "«Скидка 15% + 5% годовых»", description: "Апартаменты премиум у Белорусской: скидка 15% при рассрочке под 5% годовых, trade-in в зачёт.",
    feedUrl: "https://mr-group.ru/exports/slava.xml", feedStatus: "success", feedLastSynced: "сегодня, 06:12", feedObjects: 64,
    isActive: true, rentEstimate: 140_000, priceGrowthYear: 9.6, hue: 210,
  },
  {
    id: "o18", developer: "ГК ФСК", project: "Южная Битца", propertyType: "квартира",
    district: "Бутово", metro: "Бульвар Дмитрия Донского", address: "ул. Поляны, 8", lat: 55.545, lng: 37.573,
    priceWithRepair: 8_600_000, basePrice: 7_950_000, programPrice: 6_880_000,
    minDownPaymentPercent: 20, termMonths: 30, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 120_000,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк"], rooms: 1, areaMin: 36, areaMax: 41, readyQuarter: "I кв. 2027",
    programName: "«Trade-In + рассрочка»", description: "Обмен старой квартиры в зачёт новой + рассрочка 0% на 30 мес. Фикс-наценка всего 120 тыс. ₽ за пользование рассрочкой.",
    feedUrl: "https://fsk.ru/feeds/bitca.xml", feedStatus: "success", feedLastSynced: "сегодня, 07:55", feedObjects: 118,
    isActive: true, rentEstimate: 44_000, priceGrowthYear: 6.9, hue: 24,
  },
  {
    id: "o19", developer: "ГК Эталон", project: "Нагатино i-Land. Берег", propertyType: "квартира",
    district: "Нагатино-Садовники", metro: "Технопарк", address: "пр-т Андропова, 18", lat: 55.694, lng: 37.662,
    priceWithRepair: 16_300_000, basePrice: 15_200_000, programPrice: 13_180_000,
    minDownPaymentPercent: 15, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "quarterly", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: true, isForFamilies: true,
    canSwitchToMortgage: false, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад", "парк", "двор без машин"], rooms: 2, areaMin: 55, areaMax: 62, readyQuarter: "III кв. 2026",
    programName: "«Ежеквартальная 0%»", description: "Ежеквартальные платежи без процентов на 24 мес, ключи после 50% выплат. Подходит беременным и под маткапитал.",
    feedUrl: "https://data.etalongroup.ru/iland.xml", feedStatus: "success", feedLastSynced: "сегодня, 08:12", feedObjects: 91,
    isActive: true, rentEstimate: 85_000, priceGrowthYear: 11.2, hue: 204,
  },
  {
    id: "o20", developer: "ПИК", project: "Амурский парк", propertyType: "студия",
    district: "Гольяново", metro: "Щёлковская", address: "Амурская ул., 1", lat: 55.809, lng: 37.799,
    priceWithRepair: 7_400_000, basePrice: 6_900_000, programPrice: 5_940_000,
    minDownPaymentPercent: 10, termMonths: 18, interestRatePercent: 0, priceMarkupPercent: 3, objectMarkupFixed: 90_000,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: false, hasTradeIn: false,
    infrastructure: ["сад", "парк"], rooms: 0, areaMin: 21, areaMax: 25, readyQuarter: "Сдан",
    programName: "«Студия от 5,9 млн»", description: "Готовая студия у метро с рассрочкой 0% на 18 мес. Удорожание 3% + 90 тыс. ₽ фиксом — всё учтено в калькуляторе.",
    feedUrl: "https://pik.ru/export/amursky.xml", feedStatus: "pending", feedLastSynced: "вчера, 22:30", feedObjects: 76,
    isActive: true, rentEstimate: 41_000, priceGrowthYear: 7.8, hue: 275,
  },
  {
    id: "o21", developer: "Level Group", project: "Level Стрешнево", propertyType: "квартира",
    district: "Покровское-Стрешнево", metro: "Стрешнево", address: "Волоколамское ш., 71", lat: 55.818, lng: 37.489,
    priceWithRepair: 29_800_000, basePrice: 27_900_000, programPrice: 24_300_000,
    minDownPaymentPercent: 20, termMonths: 48, interestRatePercent: 0, priceMarkupPercent: 4, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: false, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк", "поликлиника", "двор без машин"], rooms: 3, areaMin: 84, areaMax: 95, readyQuarter: "IV кв. 2027",
    programName: "«Длинная рассрочка 48 мес»", description: "Рассрочка 0% на 4 года с ключами до оплаты. Удорожание 4% компенсируется длиной срока: платёж комфортный даже для 3-комнатной.",
    feedUrl: "https://feeds.levelgroup.ru/streshnevo.xml", feedStatus: "success", feedLastSynced: "сегодня, 09:41", feedObjects: 58,
    isActive: true, rentEstimate: 130_000, priceGrowthYear: 10.9, hue: 158,
  },
  {
    id: "o22", developer: "Гранель", project: "Государев дом", propertyType: "квартира",
    district: "Видное", metro: "Домодедовская", address: "г. Видное, ул. Завидная", lat: 55.551, lng: 37.706,
    priceWithRepair: 7_900_000, basePrice: 7_300_000, programPrice: 6_210_000,
    minDownPaymentPercent: 15, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад", "парк"], rooms: 1, areaMin: 34, areaMax: 39, readyQuarter: "II кв. 2027",
    programName: "«IT-рассрочка 0%»", description: "Рассрочка 0% с правом перехода на IT-ипотеку под 6% после сдачи. Маткапитал и семейные программы — в зачёт.",
    feedUrl: "https://granelle.ru/feeds/gosdom.xml", feedStatus: "success", feedLastSynced: "сегодня, 10:15", feedObjects: 147,
    isActive: true, rentEstimate: 40_000, priceGrowthYear: 7.2, hue: 320,
  },
  {
    id: "o23", developer: "А101", project: "Испанские кварталы. Юг", propertyType: "квартира",
    district: "Новомосковский", metro: "Прокшино", address: "Сосенское пос., уч. 12", lat: 55.581, lng: 37.477,
    priceWithRepair: 13_200_000, basePrice: 12_300_000, programPrice: 10_460_000,
    minDownPaymentPercent: 15, termMonths: 30, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 200_000,
    paymentType: "deferred", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад", "парк", "поликлиника"], rooms: 2, areaMin: 54, areaMax: 60, readyQuarter: "I кв. 2028",
    programName: "«Отложенный 30 мес»", description: "50% стоимости — в конце срока. До этого небольшие ежемесячные взносы. Фикс-наценка 200 тыс. ₽, маткапитал принимается.",
    feedUrl: "https://a101.ru/export/ispanskie.xml", feedStatus: "success", feedLastSynced: "сегодня, 07:33", feedObjects: 104,
    isActive: true, rentEstimate: 62_000, priceGrowthYear: 8.8, hue: 18,
  },
  {
    id: "o24", developer: "Capital Group", project: "Capital Towers. Апарты", propertyType: "апартаменты",
    district: "Пресненский", metro: "Выставочная", address: "Краснопресненская наб., 14", lat: 55.747, lng: 37.542,
    priceWithRepair: 58_500_000, basePrice: 55_200_000, programPrice: 47_400_000,
    minDownPaymentPercent: 30, termMonths: 12, interestRatePercent: 8, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "fixed", isInterestFree: false, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: false, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: true,
    infrastructure: ["двор без машин"], rooms: 2, areaMin: 68, areaMax: 76, readyQuarter: "Сдан",
    programName: "«Премиум у Москва-Сити»", description: "Готовые апартаменты в башнях Сити: фиксированные платежи на 12 мес под 8% годовых, trade-in в зачёт.",
    feedUrl: "https://capitalgroup.ru/feeds/towers.xml", feedStatus: "error", feedLastSynced: "ошибка парсинга, 03:12", feedObjects: 22,
    isActive: true, rentEstimate: 260_000, priceGrowthYear: 6.5, hue: 288,
  },
  {
    id: "o25", developer: "Инград", project: "Речной", propertyType: "квартира",
    district: "Левобережный", metro: "Речной вокзал", address: "Ленинградское ш., 69", lat: 55.854, lng: 37.487,
    priceWithRepair: 11_400_000, basePrice: 10_600_000, programPrice: 8_900_000,
    minDownPaymentPercent: 10, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: true, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад", "парк"], rooms: 1, areaMin: 38, areaMax: 43, readyQuarter: "III кв. 2027",
    programName: "«Беременным и семьям»", description: "Специальные условия для беременных: отсрочка первого взноса до родов, ПВ от 10%, маткапитал в зачёт.",
    feedUrl: "https://ingrad.ru/export/rechnoy.xml", feedStatus: "success", feedLastSynced: "сегодня, 08:40", feedObjects: 83,
    isActive: true, rentEstimate: 57_000, priceGrowthYear: 9.1, hue: 130,
  },
  {
    id: "o26", developer: "ПИК", project: "Бусиново. Инвест", propertyType: "квартира",
    district: "Западное Дегунино", metro: "Селигерская", address: "ул. Бусиновская Горка", lat: 55.862, lng: 37.533,
    priceWithRepair: 10_200_000, basePrice: 9_500_000, programPrice: 8_170_000,
    minDownPaymentPercent: 20, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: false, isItMortgage: false, acceptsMaternityCapital: false, hasTradeIn: false,
    infrastructure: ["парк", "двор без машин"], rooms: 2, areaMin: 50, areaMax: 56, readyQuarter: "IV кв. 2026",
    programName: "«Инвест-рассрочка»", description: "Ключи после 40% выплат — сдача в аренду гасит остаток. Рассрочка 0% на 24 мес, высокая ликвидность района.",
    feedUrl: "https://pik.ru/export/businovo.xml", feedStatus: "success", feedLastSynced: "сегодня, 06:58", feedObjects: 95,
    isActive: true, rentEstimate: 68_000, priceGrowthYear: 12.4, hue: 275,
  },
  {
    id: "o27", developer: "Донстрой", project: "Остров. Квартал 3", propertyType: "студия",
    district: "Мнёвниковская пойма", metro: "Мнёвники", address: "ул. Нижние Мнёвники, 9", lat: 55.763, lng: 37.473,
    priceWithRepair: 12_600_000, basePrice: 11_800_000, programPrice: 10_300_000,
    minDownPaymentPercent: 20, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 2, objectMarkupFixed: 0,
    paymentType: "quarterly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: false,
    infrastructure: ["парк", "поликлиника", "двор без машин"], rooms: 0, areaMin: 26, areaMax: 30, readyQuarter: "II кв. 2027",
    programName: "«Квартальная 0% на Острове»", description: "Ежеквартальные платежи 0% на 24 мес в эко-квартале на острове. Переход на IT-ипотеку после сдачи.",
    feedUrl: "https://donstroy.com/feeds/ostrov.xml", feedStatus: "success", feedLastSynced: "сегодня, 05:47", feedObjects: 71,
    isActive: true, rentEstimate: 60_000, priceGrowthYear: 13.1, hue: 262,
  },
  {
    id: "o28", developer: "Самолёт", project: "Томилино. Парк", propertyType: "квартира",
    district: "Томилино", metro: "Котельники", address: "г.о. Люберцы, Томилино", lat: 55.641, lng: 38.013,
    priceWithRepair: 12_900_000, basePrice: 11_900_000, programPrice: 10_000_000,
    minDownPaymentPercent: 15, termMonths: 36, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк", "поликлиника"], rooms: 3, areaMin: 70, areaMax: 78, readyQuarter: "III кв. 2028",
    programName: "«3-комн. Trade-In 36 мес»", description: "Продайте старую квартиру через trade-in, а новую 3-комнатную оплачивайте рассрочкой 0% на 36 мес. Маткапитал — в зачёт.",
    feedUrl: "https://samolet.ru/export/tomilino.xml", feedStatus: "pending", feedLastSynced: "вчера, 21:10", feedObjects: 88,
    isActive: true, rentEstimate: 70_000, priceGrowthYear: 7.6, hue: 36,
  },
  {
    id: "o29", developer: "ГК ФСК", project: "Западный. Квартал 2", propertyType: "квартира",
    district: "Очаково-Матвеевское", metro: "Аминьевская", address: "ул. Веерная, 4", lat: 55.691, lng: 37.466,
    priceWithRepair: 14_800_000, basePrice: 13_800_000, programPrice: 11_900_000,
    minDownPaymentPercent: 20, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 4, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: false, hasTradeIn: false,
    infrastructure: ["школа", "парк"], rooms: 1, areaMin: 40, areaMax: 45, readyQuarter: "I кв. 2027",
    programName: "«Скидка 14% при 0%»", description: "Большая скидка 14% от базовой цены компенсирует удорожание 4%: итоговая переплата всё равно минимальна.",
    feedUrl: "https://fsk.ru/feeds/zapadny.xml", feedStatus: "success", feedLastSynced: "сегодня, 07:55", feedObjects: 109,
    isActive: true, rentEstimate: 66_000, priceGrowthYear: 10.2, hue: 24,
  },
  {
    id: "o30", developer: "А101", project: "Скандинавия. IT", propertyType: "квартира",
    district: "Новомосковский", metro: "Коммунарка", address: "Сосенское пос., Скандинавия", lat: 55.568, lng: 37.469,
    priceWithRepair: 15_600_000, basePrice: 14_500_000, programPrice: 12_330_000,
    minDownPaymentPercent: 15, termMonths: 30, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад", "парк", "поликлиника", "двор без машин"], rooms: 2, areaMin: 57, areaMax: 64, readyQuarter: "IV кв. 2027",
    programName: "«IT-семейная 0%»", description: "Рассрочка 0% на 30 мес с двойным правом: переход на IT-ипотеку или семейную 6% после сдачи. Полный пакет инфраструктуры.",
    feedUrl: "https://a101.ru/export/scandinavia.xml", feedStatus: "success", feedLastSynced: "сегодня, 07:33", feedObjects: 121,
    isActive: true, rentEstimate: 74_000, priceGrowthYear: 9.7, hue: 18,
  },
  {
    id: "o31", developer: "Гранель", project: "Видный берег. Старт", propertyType: "студия",
    district: "Видное", metro: "Домодедовская", address: "г. Видное, ул. Ольховая", lat: 55.543, lng: 37.712,
    priceWithRepair: 6_400_000, basePrice: 5_980_000, programPrice: 5_900_000,
    minDownPaymentPercent: 10, termMonths: 30, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "deferred", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: false, hasTradeIn: false,
    infrastructure: ["сад", "парк"], rooms: 0, areaMin: 20, areaMax: 24, readyQuarter: "III кв. 2027",
    programName: "«Старт 5,9 млн»", description: "Самый доступный вход на портал: студия от 5,9 млн, ПВ 10%, отложенный платёж на 30 мес без процентов.",
    feedUrl: "https://granelle.ru/feeds/vidny.xml", feedStatus: "success", feedLastSynced: "сегодня, 10:15", feedObjects: 133,
    isActive: true, rentEstimate: 34_000, priceGrowthYear: 6.8, hue: 320,
  },
  {
    id: "o32", developer: "ГК Эталон", project: "ЗИЛАРТ. Юг", propertyType: "квартира",
    district: "Даниловский", metro: "Технопарк", address: "ул. Лисицкого, 3", lat: 55.689, lng: 37.655,
    priceWithRepair: 21_400_000, basePrice: 19_900_000, programPrice: 16_900_000,
    minDownPaymentPercent: 15, termMonths: 36, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 250_000,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: true, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк", "поликлиника", "двор без машин"], rooms: 3, areaMin: 78, areaMax: 88, readyQuarter: "II кв. 2027",
    programName: "«ЗИЛАРТ семейный»", description: "3-комнатная в ЗИЛАРТ: рассрочка 0% на 36 мес, ключи до оплаты, беременным отсрочка ПВ, маткапитал и trade-in — всё вместе.",
    feedUrl: "https://data.etalongroup.ru/zilart.xml", feedStatus: "success", feedLastSynced: "сегодня, 08:12", feedObjects: 77,
    isActive: true, rentEstimate: 110_000, priceGrowthYear: 13.8, hue: 204,
  },
  {
    id: "o33", developer: "Capital Group", project: "Триколор. Апарты", propertyType: "апартаменты",
    district: "Ростокино", metro: "Ростокино", address: "ул. Докукина, 8", lat: 55.826, lng: 37.652,
    priceWithRepair: 11_800_000, basePrice: 11_000_000, programPrice: 9_680_000,
    minDownPaymentPercent: 20, termMonths: 18, interestRatePercent: 3, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: false, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: false,
    infrastructure: ["парк"], rooms: 1, areaMin: 36, areaMax: 41, readyQuarter: "IV кв. 2026",
    programName: "«Апарты под 3%»", description: "Апартаменты у ВДНХ: рассрочка под 3% годовых на 18 мес, переход на IT-ипотеку. Синхронизация фида ожидается.",
    feedUrl: "https://capitalgroup.ru/feeds/trikolor.xml", feedStatus: "pending", feedLastSynced: "запланировано, 12:00", feedObjects: 0,
    isActive: true, rentEstimate: 55_000, priceGrowthYear: 8.4, hue: 288,
  },
  {
    id: "o34", developer: "ДСК-1", project: "Некрасовка. Квартал 9", propertyType: "квартира",
    district: "Некрасовка", metro: "Некрасовка", address: "ул. Вертолетчиков, 15", lat: 55.687, lng: 37.928,
    priceWithRepair: 9_400_000, basePrice: 8_700_000, programPrice: 7_480_000,
    minDownPaymentPercent: 15, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад"], rooms: 2, areaMin: 51, areaMax: 57, readyQuarter: "Сдан",
    programName: "«Черновик (не опубликован)»", description: "Объект скрыт с портала для демонстрации работы переключателя активности в админке.",
    feedUrl: "https://dsk1.ru/export/nekrasovka.xml", feedStatus: "success", feedLastSynced: "сегодня, 23:00", feedObjects: 64,
    isActive: false, rentEstimate: 47_000, priceGrowthYear: 6.2, hue: 92,
  },
  {
    id: "o35", developer: "Level Group", project: "Level Мичуринский", propertyType: "квартира",
    district: "Раменки", metro: "Мичуринский проспект", address: "ул. Лобачевского, 126", lat: 55.689, lng: 37.501,
    priceWithRepair: 13_600_000, basePrice: 12_700_000, programPrice: 10_800_000,
    minDownPaymentPercent: 20, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 2, objectMarkupFixed: 100_000,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: false,
    infrastructure: ["парк", "двор без машин"], rooms: 1, areaMin: 39, areaMax: 44, readyQuarter: "III кв. 2026",
    programName: "«Ключи до оплаты + IT»", description: "Для инвестора: ключи после 50% выплат, аренда гасит остаток, переход на IT-ипотеку 6%. Удорожание 2% + 100 тыс. ₽.",
    feedUrl: "https://feeds.levelgroup.ru/michurinsky.xml", feedStatus: "success", feedLastSynced: "сегодня, 09:41", feedObjects: 69,
    isActive: true, rentEstimate: 72_000, priceGrowthYear: 12.9, hue: 158,
  },
  {
    id: "o36", developer: "Инград", project: "Серебряный фонтан", propertyType: "квартира",
    district: "Алексеевский", metro: "Алексеевская", address: "ул. Новоалексеевская, 16", lat: 55.807, lng: 37.643,
    priceWithRepair: 17_900_000, basePrice: 16_700_000, programPrice: 14_200_000,
    minDownPaymentPercent: 10, termMonths: 30, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "quarterly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: true, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: false,
    infrastructure: ["школа", "сад", "парк", "поликлиника"], rooms: 2, areaMin: 56, areaMax: 63, readyQuarter: "I кв. 2027",
    programName: "«Фонтан: беременным 10%»", description: "Ежеквартальная рассрочка 0% на 30 мес, ПВ от 10%, отсрочка для беременных, маткапитал в зачёт.",
    feedUrl: "https://ingrad.ru/export/fontan.xml", feedStatus: "success", feedLastSynced: "сегодня, 08:40", feedObjects: 92,
    isActive: true, rentEstimate: 88_000, priceGrowthYear: 10.6, hue: 130,
  },
  {
    id: "o37", developer: "Донстрой", project: "Событие. IT-студии", propertyType: "студия",
    district: "Раменки", metro: "Ломоносовский проспект", address: "ул. Лобачевского, 114", lat: 55.682, lng: 37.513,
    priceWithRepair: 11_900_000, basePrice: 11_100_000, programPrice: 9_770_000,
    minDownPaymentPercent: 15, termMonths: 36, interestRatePercent: 0, priceMarkupPercent: 0, objectMarkupFixed: 0,
    paymentType: "monthly", isInterestFree: true, hasKeyEarlyRelease: true, isForPregnant: false, isForFamilies: false,
    canSwitchToMortgage: true, isItMortgage: true, acceptsMaternityCapital: false, hasTradeIn: false,
    infrastructure: ["парк", "двор без машин"], rooms: 0, areaMin: 25, areaMax: 29, readyQuarter: "IV кв. 2026",
    programName: "«IT-студия с арендой»", description: "Студия в «Событии»: ключи до оплаты, аренда 60 тыс. ₽/мес гасит остаток, IT-ипотека 6% после сдачи. Рост района 13%/год.",
    feedUrl: "https://donstroy.com/feeds/sobytie.xml", feedStatus: "success", feedLastSynced: "сегодня, 05:47", feedObjects: 54,
    isActive: true, rentEstimate: 60_000, priceGrowthYear: 13.4, hue: 262,
  },
  {
    id: "o38", developer: "Самолёт", project: "Пригород Лесное. Юг", propertyType: "квартира",
    district: "Ленинский округ", metro: "Домодедовская", address: "д. Апаринки, Пригород Лесное", lat: 55.559, lng: 37.758,
    priceWithRepair: 14_300_000, basePrice: 13_300_000, programPrice: 11_300_000,
    minDownPaymentPercent: 15, termMonths: 48, interestRatePercent: 0, priceMarkupPercent: 3, objectMarkupFixed: 0,
    paymentType: "deferred", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк", "поликлиника"], rooms: 3, areaMin: 74, areaMax: 82, readyQuarter: "II кв. 2028",
    programName: "«Длинный отложенный 48 мес»", description: "60% — в конце 4-летнего срока, удорожание всего 3%. Trade-in и маткапитал в зачёт, подходит для больших семей.",
    feedUrl: "https://samolet.ru/export/pri-gorod.xml", feedStatus: "success", feedLastSynced: "сегодня, 09:02", feedObjects: 142,
    isActive: true, rentEstimate: 72_000, priceGrowthYear: 7.9, hue: 36,
  },
  {
    id: "o39", developer: "ПИК", project: "Люблинский парк", propertyType: "квартира",
    district: "Люблино", metro: "Люблино", address: "ул. Верхние Поля, 52", lat: 55.672, lng: 37.762,
    priceWithRepair: 10_800_000, basePrice: 10_000_000, programPrice: 8_700_000,
    minDownPaymentPercent: 20, termMonths: 24, interestRatePercent: 0, priceMarkupPercent: 2, objectMarkupFixed: 80_000,
    paymentType: "quarterly", isInterestFree: true, hasKeyEarlyRelease: false, isForPregnant: false, isForFamilies: true,
    canSwitchToMortgage: true, isItMortgage: false, acceptsMaternityCapital: true, hasTradeIn: true,
    infrastructure: ["школа", "сад", "парк"], rooms: 1, areaMin: 37, areaMax: 42, readyQuarter: "III кв. 2027",
    programName: "«Квартальная + Trade-In»", description: "Ежеквартальные платежи 0% на 24 мес с trade-in в зачёт. Удорожание 2% + 80 тыс. ₽ фиксом, маткапитал принимается.",
    feedUrl: "https://pik.ru/export/lublinsky.xml", feedStatus: "success", feedLastSynced: "сегодня, 06:58", feedObjects: 117,
    isActive: true, rentEstimate: 55_000, priceGrowthYear: 8.9, hue: 275,
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
