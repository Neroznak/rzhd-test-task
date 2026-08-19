"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import type {
  FilterOption,
  TrainFiltersValue,
} from "../model/filter-trains";
import styles from "./train-filters.module.css";

type TrainFiltersProps = {
  value: TrainFiltersValue;
  regions: FilterOption[];
  months: FilterOption[];
  resultCount: number;
  totalCount: number;
  onChange: (value: TrainFiltersValue) => void;
  onReset: () => void;
};

export function TrainFilters({
  value,
  regions,
  months,
  resultCount,
  totalCount,
  onChange,
  onReset,
}: TrainFiltersProps) {
  const hasActiveFilters = Boolean(value.query || value.region || value.month);

  return (
    <form
      className={styles.panel}
      role="search"
      aria-label="Поиск и фильтры туристских поездов"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className={styles.fields}>
        <FilterField
          label="Название поезда"
          htmlFor="train-search"
        >
          <input
            id="train-search"
            type="search"
            value={value.query}
            onChange={(event) =>
              onChange({ ...value, query: event.target.value })
            }
            placeholder="Например, Байкальская сказка"
            autoComplete="off"
            className={styles.searchInput}
          />
        </FilterField>

        <FilterField
          label="Регион"
          htmlFor="train-region"
        >
          <FilterSelect
            id="train-region"
            value={value.region}
            label="Регион"
            emptyLabel="Все регионы"
            options={regions}
            onChange={(region) => onChange({ ...value, region })}
          />
        </FilterField>

        <FilterField
          label="Месяц отправления"
          htmlFor="train-month"
        >
          <FilterSelect
            id="train-month"
            value={value.month}
            label="Месяц отправления"
            emptyLabel="Любой месяц"
            options={months}
            onChange={(month) => onChange({ ...value, month })}
          />
        </FilterField>

        <div className={styles.resetSection}>
          <span className={styles.resultCount} aria-live="polite">
            Найдено: {resultCount} из {totalCount}
          </span>
          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={styles.resetButton}
          >
            Сбросить
          </button>
        </div>
      </div>
    </form>
  );
}

type FilterFieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
};

function FilterField({ label, htmlFor, children }: FilterFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
    </div>
  );
}

type FilterSelectProps = {
  id: string;
  value: string;
  label: string;
  emptyLabel: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

function FilterSelect({
  id,
  value,
  label,
  emptyLabel,
  options,
  onChange,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const listboxId = useId();
  const allOptions = [{ value: "", label: emptyLabel }, ...options];
  const selectedIndex = Math.max(
    allOptions.findIndex((option) => option.value === value),
    0,
  );
  const selectedLabel = allOptions[selectedIndex].label;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen]);

  const openAndFocus = (index: number) => {
    setIsOpen(true);
    requestAnimationFrame(() => optionRefs.current[index]?.focus());
  };

  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openAndFocus(selectedIndex);
    }
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    index: number,
  ) => {
    let nextIndex = index;

    if (event.key === "ArrowDown") nextIndex = (index + 1) % allOptions.length;
    else if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + allOptions.length) % allOptions.length;
    } else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = allOptions.length - 1;
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(allOptions[index].value);
      return;
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    } else if (event.key === "Tab") {
      setIsOpen(false);
      return;
    } else {
      return;
    }

    event.preventDefault();
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.select} ref={rootRef}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={styles.selectTrigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        onClick={() => {
          if (isOpen) setIsOpen(false);
          else openAndFocus(selectedIndex);
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selectedLabel}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          className={styles.menu}
          role="listbox"
          aria-label={label}
        >
          {allOptions.map((option, index) => {
            const isSelected = option.value === value;

            return (
              <li
                key={option.value}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                aria-selected={isSelected}
                tabIndex={index === selectedIndex ? 0 : -1}
                className={styles.option}
                onClick={() => selectOption(option.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <span className={styles.checkmark} aria-hidden="true">
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
