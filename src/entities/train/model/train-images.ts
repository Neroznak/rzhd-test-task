import { assetPath } from "@/shared/lib";

export type TrainImage = Readonly<{
  src: string;
  alt: string;
  cardPosition: string;
  detailPosition: string;
}>;

export const TRAIN_IMAGES: Readonly<Record<string, TrainImage>> = {
  karelia: {
    src: assetPath("/images/trains/karelia.jpg"),
    alt: "Озёра и леса Карелии",
    cardPosition: "center 52%",
    detailPosition: "center 52%",
  },
  "zhemchuzhina-kavkaza": {
    src: assetPath("/images/trains/kavkaz.jpg"),
    alt: "Горный пейзаж Кавказа",
    cardPosition: "center 68%",
    detailPosition: "center 54%",
  },
  "baikalskaya-skazka": {
    src: assetPath("/images/trains/baikal.jpg"),
    alt: "Побережье озера Байкал",
    cardPosition: "center 52%",
    detailPosition: "center 48%",
  },
  "zimnyaya-skazka": {
    src: assetPath("/images/trains/ustug.jpg"),
    alt: "Зимний Великий Устюг",
    cardPosition: "center 62%",
    detailPosition: "center 46%",
  },
  "po-zolotomu-koltsu": {
    src: assetPath("/images/trains/zolotoe.jpg"),
    alt: "Архитектурный ансамбль Золотого кольца",
    cardPosition: "center 38%",
    detailPosition: "center 50%",
  },
};
