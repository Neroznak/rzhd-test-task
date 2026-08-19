"use client";

import {
  formatDepartureDate,
  formatDuration,
  formatPrice,
  formatTrainRoute,
  getNearestDeparture,
} from "../../lib";
import type { Train } from "../../model/types";

import styles from "./train-card.module.css";

export type TrainCardProps = {
  train: Train;
  onOpen: (train: Train) => void;
};

export function TrainCard({ train, onOpen }: TrainCardProps) {
  const nearestDeparture = getNearestDeparture(train);
  const name = train.name.trim() || "Поезд без названия";
  const region = train.region?.trim() || "Регион уточняется";

  return (
    <article className={styles.card}>
      <button
        className={styles.button}
        type="button"
        onClick={() => onOpen(train)}
        aria-haspopup="dialog"
        aria-label={`Подробнее о поезде «${name}»`}
      >
        <span className={styles.accent} aria-hidden="true" />

        <span className={styles.header}>
          <span className={styles.region}>{region}</span>
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </span>

        <span className={styles.name}>{name}</span>
        <span className={styles.route}>{formatTrainRoute(train)}</span>

        <span className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>В пути</span>
            <span className={styles.metaValue}>{formatDuration(train.duration_days)}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Ближайший рейс</span>
            <span className={styles.metaValue}>
              {formatDepartureDate(nearestDeparture)}
            </span>
          </span>
        </span>

        <span className={styles.footer}>
          <span className={styles.price}>{formatPrice(train.price_from)}</span>
          <span className={styles.details}>Подробнее</span>
        </span>
      </button>
    </article>
  );
}
