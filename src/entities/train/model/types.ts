export type Train = Readonly<{
  id: string;
  name: string;
  region: string | null;
  route: readonly string[];
  duration_days: number | null;
  departures: readonly string[];
  price_from: number | null;
  tags: readonly string[];
  description: string | null;
  excursions: readonly string[];
  buy_url: string | null;
}>;

export type TrainsJson = Readonly<{
  trains: readonly Train[];
}>;

export type DepartureMonth = Readonly<{
  value: string;
  label: string;
}>;
