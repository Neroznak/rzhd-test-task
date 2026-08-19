import {
  formatDepartureDate,
  formatDuration,
  formatPrice,
  formatTrainRoute,
  getNearestDeparture,
} from "@/entities/train/lib";
import { TRAIN_IMAGES } from "@/entities/train/model/images";
import type { Train } from "@/entities/train/model";

type TrainShowcaseCardProps = {
  train: Train;
  onOpen: (train: Train) => void;
};

export function TrainShowcaseCard({
  train,
  onOpen,
}: TrainShowcaseCardProps) {
  const name = train.name.trim() || "Поезд без названия";
  const region = train.region?.trim() || "Регион уточняется";
  const image = TRAIN_IMAGES[train.id];

  return (
    <article className="h-full min-w-0">
      <button
        type="button"
        onClick={() => onOpen(train)}
        aria-haspopup="dialog"
        className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-[0_12px_32px_rgba(17,18,22,0.06)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand/35 hover:shadow-[0_20px_48px_rgba(17,18,22,0.12)]"
      >
        <span className="relative block aspect-[16/10.5] w-full overflow-hidden bg-[#d9dde3]">
          {image ? (
            <span
              role="img"
              aria-label={image.alt}
              className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-500 group-hover:scale-[1.025]"
              style={{
                backgroundImage: `url(${image.src})`,
                backgroundPosition: image.cardPosition,
              }}
            />
          ) : (
            <>
              <span className="absolute inset-0 bg-linear-to-br from-[#e3e6ea] via-[#d7dbe0] to-[#c9ced5]" />
              <span className="absolute inset-0 flex items-center justify-center text-sm text-[#7c8491]">
                Место для фотографии
              </span>
            </>
          )}
          <span className="absolute left-4 top-4 rounded-lg bg-white/92 px-3 py-2 text-xs font-medium uppercase tracking-[0.05em] text-text-primary shadow-sm backdrop-blur-sm sm:left-5 sm:top-5">
            {region}
          </span>

          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/25 to-transparent px-4 pb-4 pt-14 sm:px-5 sm:pb-5 sm:pt-16">
            <span className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-4 sm:gap-6">
              <CardValue label="В пути">
                {formatDuration(train.duration_days)}
              </CardValue>
              <CardValue label="Ближайший рейс" alignRight noWrap>
                {formatDepartureDate(getNearestDeparture(train))}
              </CardValue>
            </span>
          </span>
        </span>

        <span className="flex w-full flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <span className="flex items-start justify-between gap-4">
            <span className="min-w-0 text-2xl font-normal leading-tight text-text-primary sm:text-[28px]">
              {name}
            </span>
            <span className="max-w-[46%] shrink-0 pt-1 text-right text-sm leading-5 text-text-secondary">
              {formatTrainRoute(train)}
            </span>
          </span>

          <span className="mt-auto flex items-end justify-between gap-5 pt-6">
            <span>
              <span className="block text-xs text-text-secondary">
                Стоимость тура
              </span>
              <span className="mt-1 block text-xl font-medium text-text-primary">
                {formatPrice(train.price_from)}
              </span>
            </span>
            <span className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-white transition-colors group-hover:bg-brand-hover sm:px-5">
              Подробнее
            </span>
          </span>
        </span>
      </button>
    </article>
  );
}

type CardValueProps = {
  label: string;
  alignRight?: boolean;
  noWrap?: boolean;
  children: React.ReactNode;
};

function CardValue({
  label,
  alignRight = false,
  noWrap = false,
  children,
}: CardValueProps) {
  return (
    <span
      className={`min-w-0 rounded-lg bg-black/15 px-3.5 py-2.5 backdrop-blur-[2px] ${
        alignRight ? "justify-self-end text-right" : "justify-self-start"
      }`}
    >
      <span className="block whitespace-nowrap text-xs text-white/70">
        {label}
      </span>
      <span
        className={`mt-1 block text-sm font-medium leading-5 text-white drop-shadow-sm ${
          noWrap ? "whitespace-nowrap" : ""
        }`}
      >
        {children}
      </span>
    </span>
  );
}
