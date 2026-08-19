"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { type Train } from "@/entities/train/model";
import {
  EMPTY_TRAIN_FILTERS,
  filterTrains,
  getMonthOptions,
  getRegionOptions,
  TrainFilters,
  type TrainFiltersValue,
} from "@/features/train-filter";

import { TrainShowcaseCard } from "./train-showcase-card";

type TrainCatalogProps = {
  trains: readonly Train[];
};

const TRAINS_PER_PAGE = 10;

const TrainDetailsDialog = dynamic(() =>
  import("@/entities/train/ui/train-details-dialog").then(
    (module) => module.TrainDetailsDialog,
  ),
  { ssr: false },
);

export function TrainCatalog({ trains }: TrainCatalogProps) {
  const [filters, setFilters] = useState<TrainFiltersValue>(
    EMPTY_TRAIN_FILTERS,
  );
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [visibleCount, setVisibleCount] = useState(TRAINS_PER_PAGE);

  const regions = useMemo(() => getRegionOptions(trains), [trains]);
  const months = useMemo(() => getMonthOptions(trains), [trains]);
  const filteredTrains = useMemo(
    () => filterTrains(trains, filters),
    [filters, trains],
  );
  const visibleTrains = filteredTrains.slice(0, visibleCount);
  const hasMoreTrains = visibleCount < filteredTrains.length;

  function changeFilters(nextFilters: TrainFiltersValue) {
    setFilters(nextFilters);
    setVisibleCount(TRAINS_PER_PAGE);
  }

  function resetFilters() {
    setFilters(EMPTY_TRAIN_FILTERS);
    setVisibleCount(TRAINS_PER_PAGE);
  }

  function showMoreTrains() {
    setVisibleCount((currentCount) =>
      Math.min(currentCount + TRAINS_PER_PAGE, filteredTrains.length),
    );
  }

  return (
    <section id="catalog" className="relative z-20 scroll-mt-4 pb-18 sm:pb-24">
      <div className="mx-auto w-full max-w-container px-5 sm:px-8 lg:px-10">
        <div className="-mt-12 sm:-mt-14">
          <TrainFilters
            value={filters}
            regions={regions}
            months={months}
            resultCount={filteredTrains.length}
            totalCount={trains.length}
            onChange={changeFilters}
            onReset={resetFilters}
          />
        </div>

        <div className="flex flex-col gap-4 pb-8 pt-12 sm:flex-row sm:items-end sm:justify-between sm:pt-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#d81920]">
              Каталог маршрутов
            </p>
            <h2 className="mt-2 text-3xl font-normal tracking-normal text-text-primary sm:text-4xl">
              Найдите своё путешествие
            </h2>
          </div>
          <p className="text-sm text-[#636b78]" aria-live="polite">
            {getResultLabel(filteredTrains.length)}
          </p>
        </div>

        {filteredTrains.length > 0 ? (
          <>
            <div className="grid items-stretch gap-6 lg:grid-cols-2">
              {visibleTrains.map((train) => (
                <TrainShowcaseCard
                  key={train.id}
                  train={train}
                  onOpen={setSelectedTrain}
                />
              ))}
            </div>

            {hasMoreTrains && (
              <div className="flex justify-center pt-10">
                <button
                  type="button"
                  onClick={showMoreTrains}
                  className="min-h-12 rounded-xl border border-brand bg-surface px-7 font-medium text-brand transition-colors hover:bg-brand hover:text-white"
                >
                  Показать ещё
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center sm:px-10">
            <p className="text-xl font-medium text-text-primary">
              Подходящих поездов не найдено
            </p>
            <p className="mx-auto mt-3 max-w-md leading-7 text-text-secondary">
              Попробуйте изменить название, регион или месяц отправления.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 min-h-12 rounded-xl bg-brand px-6 font-medium text-white transition-colors hover:bg-brand-hover"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {selectedTrain ? (
        <TrainDetailsDialog
          train={selectedTrain}
          open
          onClose={() => setSelectedTrain(null)}
        />
      ) : null}
    </section>
  );
}

function getResultLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} маршрут`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} маршрута`;
  }

  return `${count} маршрутов`;
}
