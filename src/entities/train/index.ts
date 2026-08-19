export type { DepartureMonth, Train, TrainsJson } from "./model/types";
export { trains } from "./model/data";
export { parseTrainsJson, TrainDataValidationError } from "./model/validation";
export {
  formatDepartureDate,
  formatDepartureDates,
  formatDuration,
  formatPrice,
  formatTrainRoute,
  getDepartureMonths,
  getFirstCity,
  getLastCity,
  getNearestDeparture,
  getRegions,
} from "./lib";
export { TrainCard, TrainDetailsDialog } from "./ui";
export type { TrainCardProps, TrainDetailsDialogProps } from "./ui";
