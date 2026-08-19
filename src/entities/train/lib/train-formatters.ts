import type { DepartureMonth, Train } from "../model/types";

const UNKNOWN_DATE = "Дата уточняется";
const UNKNOWN_DURATION = "Длительность уточняется";
const UNKNOWN_PRICE = "Цена уточняется";
const UNKNOWN_ROUTE = "Маршрут уточняется";
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const departureDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const departureMonthFormatter = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  currencyDisplay: "symbol",
  maximumFractionDigits: 0,
});

const durationPluralRules = new Intl.PluralRules("ru-RU");

type RouteSource = Pick<Train, "route"> | readonly string[] | null | undefined;
type DepartureSource =
  | Pick<Train, "departures">
  | readonly string[]
  | null
  | undefined;

function getRoute(source: RouteSource): readonly string[] {
  if (!source) {
    return [];
  }

  return "route" in source ? source.route : source;
}

function getDepartures(source: DepartureSource): readonly string[] {
  if (!source) {
    return [];
  }

  return "departures" in source ? source.departures : source;
}

function parseIsoDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const match = ISO_DATE_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function capitalize(value: string): string {
  return value.length > 0 ? value[0].toLocaleUpperCase("ru-RU") + value.slice(1) : value;
}

export function getFirstCity(source: RouteSource): string | null {
  return getRoute(source).find((city) => city.trim().length > 0) ?? null;
}

export function getLastCity(source: RouteSource): string | null {
  return getRoute(source).findLast((city) => city.trim().length > 0) ?? null;
}

export function formatTrainRoute(source: RouteSource): string {
  const firstCity = getFirstCity(source);
  const lastCity = getLastCity(source);

  if (!firstCity && !lastCity) {
    return UNKNOWN_ROUTE;
  }

  if (!firstCity || !lastCity) {
    return firstCity ?? lastCity ?? UNKNOWN_ROUTE;
  }

  return `${firstCity} → ${lastCity}`;
}

export function getNearestDeparture(
  source: DepartureSource,
  from: Date = new Date(),
): string | null {
  const startOfDay = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());

  return (
    getDepartures(source)
      .map((value) => ({ value, date: parseIsoDate(value) }))
      .filter(
        (departure): departure is { value: string; date: Date } =>
          departure.date !== null && departure.date.getTime() >= startOfDay,
      )
      .sort((left, right) => left.date.getTime() - right.date.getTime())[0]?.value ?? null
  );
}

export function formatDepartureDate(value: string | null | undefined): string {
  const date = parseIsoDate(value);
  return date ? departureDateFormatter.format(date) : UNKNOWN_DATE;
}

export function formatDepartureDates(
  values: readonly string[] | null | undefined,
): string[] {
  return (values ?? []).map(formatDepartureDate);
}

export function formatPrice(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return UNKNOWN_PRICE;
  }

  return `от ${priceFormatter.format(value)}`;
}

export function formatDuration(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    return UNKNOWN_DURATION;
  }

  const pluralCategory = durationPluralRules.select(value);
  const unit =
    pluralCategory === "one" ? "день" : pluralCategory === "few" ? "дня" : "дней";

  return `${value} ${unit}`;
}

export function getRegions(values: readonly Train[]): string[] {
  const regions = new Set(
    values
      .map((train) => train.region?.trim())
      .filter((region): region is string => Boolean(region)),
  );

  return [...regions].sort((left, right) => left.localeCompare(right, "ru-RU"));
}

export function getDepartureMonths(values: readonly Train[]): DepartureMonth[] {
  const monthKeys = new Set<string>();

  for (const train of values) {
    for (const departure of train.departures) {
      if (parseIsoDate(departure)) {
        monthKeys.add(departure.slice(0, 7));
      }
    }
  }

  return [...monthKeys].sort().map((value) => {
    const date = parseIsoDate(`${value}-01`);

    return {
      value,
      label: date ? capitalize(departureMonthFormatter.format(date)) : value,
    };
  });
}
