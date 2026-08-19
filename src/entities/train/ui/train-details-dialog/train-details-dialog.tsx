"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";

import { TRAIN_IMAGES } from "../../model/images";
import {
  formatDuration,
  formatPrice,
  getNearestDeparture,
} from "../../lib";
import type { Train } from "../../model/types";

import styles from "./train-details-dialog.module.css";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export type TrainDetailsDialogProps = {
  train: Train | null;
  open: boolean;
  onClose: () => void;
};

function isSafeExternalUrl(value: string | null): value is string {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const calendarTitleFormatter = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function parseCalendarDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null;
}

function capitalize(value: string) {
  return value.length > 0 ? value[0].toLocaleUpperCase("ru-RU") + value.slice(1) : value;
}

function DepartureDates({ departures }: { departures: readonly string[] }) {
  const validDepartures = departures
    .filter((departure) => parseCalendarDate(departure) !== null)
    .toSorted();
  const nearestDeparture = getNearestDeparture(validDepartures);
  const monthKeys = [...new Set(validDepartures.map((departure) => departure.slice(0, 7)))];
  const initialMonthIndex = Math.max(
    0,
    monthKeys.indexOf(nearestDeparture?.slice(0, 7) ?? monthKeys[0]),
  );
  const [monthIndex, setMonthIndex] = useState(initialMonthIndex);

  if (validDepartures.length === 0) {
    return <p className={styles.empty}>Даты отправления пока не объявлены.</p>;
  }

  const monthKey = monthKeys[monthIndex];
  const [yearText, monthText] = monthKey.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const leadingEmptyDays = (firstDay.getUTCDay() + 6) % 7;
  const availableDates = new Set(validDepartures);
  const calendarCells = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  const calendarWeeks = Array.from(
    { length: calendarCells.length / 7 },
    (_, index) => calendarCells.slice(index * 7, index * 7 + 7),
  );
  const monthTitle = capitalize(calendarTitleFormatter.format(firstDay));
  const hasPreviousMonth = monthIndex > 0;
  const hasNextMonth = monthIndex < monthKeys.length - 1;

  return (
    <div className={styles.monthCalendar}>
      <div className={styles.monthNavigation}>
        <span className={styles.monthArrowSlot}>
          <button
            type="button"
            onClick={() => setMonthIndex((index) => Math.max(0, index - 1))}
            disabled={!hasPreviousMonth}
            aria-label="Предыдущий месяц с отправлениями"
          >
            <span
              className={`${styles.monthArrowIcon} ${styles.monthArrowLeft}`}
              aria-hidden="true"
            />
          </button>
        </span>
        <strong aria-live="polite">{monthTitle}</strong>
        <span
          className={styles.monthArrowSlot}
          data-tooltip={!hasNextMonth ? "Следующие рейсы появятся позднее" : undefined}
        >
          <button
            type="button"
            onClick={() =>
              setMonthIndex((index) => Math.min(monthKeys.length - 1, index + 1))
            }
            disabled={!hasNextMonth}
            aria-label={
              hasNextMonth
                ? "Следующий месяц с отправлениями"
                : "Следующие рейсы появятся позднее"
            }
          >
            <span
              className={`${styles.monthArrowIcon} ${styles.monthArrowRight}`}
              aria-hidden="true"
            />
          </button>
        </span>
      </div>

      <table className={styles.calendarTable}>
        <caption className={styles.visuallyHidden}>{monthTitle}</caption>
        <thead>
          <tr>
            {WEEKDAYS.map((weekday) => (
              <th key={weekday} scope="col">
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map((week, weekIndex) => (
            <tr key={`week-${weekIndex}`}>
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return <td key={`empty-${weekIndex}-${dayIndex}`} aria-hidden="true" />;
                }

                const dateKey = `${monthKey}-${String(day).padStart(2, "0")}`;
                const available = availableDates.has(dateKey);

                return (
                  <td
                    key={dateKey}
                    className={available ? styles.availableDay : undefined}
                    aria-label={`${day} ${monthTitle}: ${
                      available ? "отправление доступно" : "отправления нет"
                    }`}
                  >
                    <span>{day}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.calendarLegend}>
        <span aria-hidden="true" /> Красным отмечены доступные даты
      </p>
    </div>
  );
}

export function TrainDetailsDialog({
  train,
  open,
  onClose,
}: TrainDetailsDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open || !train) {
      return;
    }

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstElement || !dialog.contains(activeElement))) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElementRef.current?.focus();
      previousActiveElementRef.current = null;
    };
  }, [open, train]);

  if (!open || !train) {
    return null;
  }

  const name = train.name.trim() || "Поезд без названия";
  const description = train.description?.trim() || "Описание пока не добавлено.";
  const hasBuyUrl = isSafeExternalUrl(train.buy_url);
  const headerImage = TRAIN_IMAGES[train.id];

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onMouseDown={handleBackdropClick}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <header
          className={`${styles.header} ${headerImage ? "" : styles.headerFallback}`}
          style={
            headerImage
              ? {
                  backgroundImage: `url(${headerImage.src})`,
                  backgroundPosition: headerImage.detailPosition,
                }
              : undefined
          }
        >
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>{train.region?.trim() || "Туристский поезд"}</p>
            <h2 className={styles.title} id={titleId}>
              {name}
            </h2>
          </div>
          {train.tags.length > 0 ? (
            <ul className={styles.headerTags} aria-label="Особенности поездки">
              {train.tags.map((tag, index) => (
                <li key={`${tag}-${index}`}>{tag || "Детали уточняются"}</li>
              ))}
            </ul>
          ) : null}
          <button
            ref={closeButtonRef}
            className={styles.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Закрыть информацию о поезде"
          >
            <span className={styles.closeIcon} aria-hidden="true" />
          </button>
          <p className={styles.headerDescription} id={descriptionId}>
            {description}
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.routePanel} aria-labelledby={`${titleId}-route`}>
            <h3 id={`${titleId}-route`}>Маршрут</h3>
            {train.route.length > 0 ? (
              <ol className={styles.routeList} aria-label="Полный маршрут поезда">
                {train.route.map((city, index) => (
                  <li key={`${city}-${index}`}>
                    <span className={styles.routeMarker} aria-hidden="true" />
                    <span>{city.trim() || "Город уточняется"}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={styles.empty}>Маршрут пока не указан.</p>
            )}
            <div className={styles.routeDuration}>
              <span>Длительность</span>
              <strong>{formatDuration(train.duration_days)}</strong>
            </div>
          </section>

          <div className={styles.detailsColumn}>
            <section className={styles.section} aria-label="Календарь отправлений">
              <DepartureDates departures={train.departures} />
            </section>

            <section className={styles.section} aria-labelledby={`${titleId}-excursions`}>
              <h3 id={`${titleId}-excursions`}>Экскурсии</h3>
              {train.excursions.length > 0 ? (
                <ul className={styles.excursionList}>
                  {train.excursions.map((excursion, index) => (
                    <li key={`${excursion}-${index}`}>
                      {excursion || "Экскурсия уточняется"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.empty}>Экскурсионная программа пока не указана.</p>
              )}
            </section>

          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.priceSummary}>
            <span className={styles.footerLabel}>Стоимость тура</span>
            <strong>{formatPrice(train.price_from)}</strong>
          </div>
          {hasBuyUrl ? (
            <a
              className={styles.buyButton}
              href={train.buy_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Купить билет
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className={styles.unavailableButton}>Продажа пока недоступна</span>
          )}
        </footer>
      </div>
    </div>
  );
}
