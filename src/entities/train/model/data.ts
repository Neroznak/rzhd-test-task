import rawTrains from "../../../../trains.json";

import { parseTrainsJson } from "./validation";

export const trains = parseTrainsJson(rawTrains).trains;
