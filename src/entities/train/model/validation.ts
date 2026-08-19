import type { Train, TrainsJson } from "./types";

type UnknownRecord = Record<string, unknown>;

export class TrainDataValidationError extends Error {
  constructor(message: string) {
    super(`Некорректные данные поездов: ${message}`);
    this.name = "TrainDataValidationError";
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRequiredString(
  record: UnknownRecord,
  field: string,
  path: string,
): string {
  const value = record[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TrainDataValidationError(`${path}.${field} должен быть непустой строкой`);
  }

  return value;
}

function readOptionalString(
  record: UnknownRecord,
  field: string,
  path: string,
): string | null {
  const value = record[field];

  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new TrainDataValidationError(`${path}.${field} должен быть строкой`);
  }

  return value;
}

function readStringArray(
  record: UnknownRecord,
  field: string,
  path: string,
): readonly string[] {
  const value = record[field];

  if (value === undefined || value === null) {
    return Object.freeze([]);
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new TrainDataValidationError(`${path}.${field} должен быть массивом строк`);
  }

  return Object.freeze([...value]);
}

function readOptionalNumber(
  record: UnknownRecord,
  field: string,
  path: string,
): number | null {
  const value = record[field];

  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new TrainDataValidationError(`${path}.${field} должен быть неотрицательным числом`);
  }

  return value;
}

function parseTrain(value: unknown, index: number): Train {
  const path = `trains[${index}]`;

  if (!isRecord(value)) {
    throw new TrainDataValidationError(`${path} должен быть объектом`);
  }

  const duration = readOptionalNumber(value, "duration_days", path);

  if (duration !== null && !Number.isInteger(duration)) {
    throw new TrainDataValidationError(`${path}.duration_days должен быть целым числом`);
  }

  return Object.freeze({
    id: readRequiredString(value, "id", path),
    name: readRequiredString(value, "name", path),
    region: readOptionalString(value, "region", path),
    route: readStringArray(value, "route", path),
    duration_days: duration,
    departures: readStringArray(value, "departures", path),
    price_from: readOptionalNumber(value, "price_from", path),
    tags: readStringArray(value, "tags", path),
    description: readOptionalString(value, "description", path),
    excursions: readStringArray(value, "excursions", path),
    buy_url: readOptionalString(value, "buy_url", path),
  });
}

export function parseTrainsJson(value: unknown): TrainsJson {
  if (!isRecord(value) || !Array.isArray(value.trains)) {
    throw new TrainDataValidationError("корневое поле trains должно быть массивом");
  }

  const trains = value.trains.map(parseTrain);
  const ids = new Set<string>();

  for (const train of trains) {
    if (ids.has(train.id)) {
      throw new TrainDataValidationError(`идентификатор ${train.id} встречается более одного раза`);
    }

    ids.add(train.id);
  }

  return Object.freeze({ trains: Object.freeze(trains) });
}
