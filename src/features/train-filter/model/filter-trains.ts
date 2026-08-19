import type { Train } from "@/entities/train/model";

export type TrainFiltersValue = {
  query: string;
  region: string;
  month: string;
};

export type FilterOption = {
  value: string;
  label: string;
};

export const EMPTY_TRAIN_FILTERS: TrainFiltersValue = {
  query: "",
  region: "",
  month: "",
};

export function filterTrains(
  trains: readonly Train[],
  filters: TrainFiltersValue,
): Train[] {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase("ru-RU");

  return trains.filter((train) => {
    const matchesQuery = train.name
      .toLocaleLowerCase("ru-RU")
      .includes(normalizedQuery);
    const matchesRegion =
      filters.region === "" || train.region === filters.region;
    const matchesMonth =
      filters.month === "" ||
      train.departures.some((departure) => departure.startsWith(filters.month));

    return matchesQuery && matchesRegion && matchesMonth;
  });
}

export function getRegionOptions(trains: readonly Train[]): FilterOption[] {
  return Array.from(
    new Set(
      trains
        .map((train) => train.region?.trim())
        .filter((region): region is string => Boolean(region)),
    ),
  )
    .sort((first, second) => first.localeCompare(second, "ru-RU"))
    .map((region) => ({ value: region, label: region }));
}

export function getMonthOptions(trains: readonly Train[]): FilterOption[] {
  const months = Array.from(
    new Set(
      trains.flatMap((train) =>
        train.departures.map((departure) => departure.slice(0, 7)),
      ),
    ),
  ).sort();

  return months.map((month) => ({
    value: month,
    label: formatMonthLabel(month),
  }));
}

function formatMonthLabel(month: string): string {
  const date = new Date(`${month}-01T00:00:00Z`);
  const label = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

  return label.charAt(0).toLocaleUpperCase("ru-RU") + label.slice(1);
}
