import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'framer-motion';
import { CategorySymbol } from './CategoryImprint';
import { getCategoryTheme } from './discoveryData';
import './category-filter.css';

const MEDIA_ORDER = [
  'game',
  'music',
  'movie',
  'book',
  'series',
  'video',
  'article',
  'quote',
  'tools',
  'websites',
  'food',
  'event',
];
const rank = (category) => {
  const index = MEDIA_ORDER.indexOf(category);
  return index < 0 ? MEDIA_ORDER.length : index;
};

const revealCategory = (rail, button, reducedMotion) => {
  if (!button) return;
  const bounds = rail.getBoundingClientRect();
  if (!bounds.width) return;
  const target = button.getBoundingClientRect();
  const inset = 36;
  const delta =
    target.left < bounds.left + inset
      ? target.left - bounds.left - inset
      : target.right > bounds.right - inset
        ? target.right - bounds.right + inset
        : 0;
  if (delta)
    rail.scrollBy?.({
      left: delta,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
};

export default function CategoryFilter({
  categories,
  counts,
  total,
  value,
  onChange,
  disabled,
}) {
  const railRef = useRef(null);
  const buttons = useRef(new Map());
  const reducedMotion = useReducedMotion();
  const [edges, setEdges] = useState({ left: false, right: false });
  const options = useMemo(
    () => [
      'all',
      ...[...categories].sort(
        (a, b) => rank(a) - rank(b) || a.localeCompare(b),
      ),
    ],
    [categories],
  );

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const measure = () => {
      const left = rail.scrollLeft > 2;
      const right = rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2;
      setEdges((previous) =>
        previous.left === left && previous.right === right
          ? previous
          : { left, right },
      );
    };
    const onLayout = () => {
      revealCategory(rail, buttons.current.get(value), reducedMotion);
      measure();
    };
    const onWheel = (event) => {
      if (
        event.ctrlKey ||
        rail.scrollWidth <= rail.clientWidth + 1 ||
        Math.abs(event.deltaX) >= Math.abs(event.deltaY)
      )
        return;
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? rail.clientWidth
            : 1);
      if (event.cancelable) event.preventDefault();
      rail.scrollLeft += delta;
      measure();
    };
    onLayout();
    rail.addEventListener('scroll', measure, { passive: true });
    rail.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onLayout);
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(onLayout);
    observer?.observe(rail);
    return () => {
      rail.removeEventListener('scroll', measure);
      rail.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onLayout);
      observer?.disconnect();
    };
  }, [value, options, reducedMotion]);

  const choose = (category) => {
    if (!disabled && category !== value) onChange(category);
  };
  const handleKey = (event, index) => {
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? (index + 1) % options.length
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? (index - 1 + options.length) % options.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? options.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    const category = options[next];
    buttons.current.get(category)?.focus({ preventScroll: true });
    choose(category);
  };
  const slide = (direction) =>
    railRef.current?.scrollBy({
      left: direction * Math.max(180, railRef.current.clientWidth * 0.65),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });

  return (
    <div
      className="dc-category-filter"
      data-left={edges.left}
      data-right={edges.right}
    >
      <div
        className="dc-category-rail"
        id="discovery-category-options"
        role="radiogroup"
        aria-label="Filter by category"
        aria-orientation="horizontal"
        ref={railRef}
      >
        {options.map((category, index) => {
          const theme = getCategoryTheme(category);
          const active = category === value;
          const count = category === 'all' ? total : counts[category] || 0;
          return (
            <button
              key={category}
              ref={(element) => {
                if (element) buttons.current.set(category, element);
                else buttons.current.delete(category);
              }}
              type="button"
              role="radio"
              aria-label={category === 'all' ? 'All categories' : theme.label}
              aria-describedby={`dc-category-count-${category}`}
              aria-checked={active}
              aria-controls="discovery-shelf-scroll"
              tabIndex={active ? 0 : -1}
              disabled={disabled}
              className="dc-category-tab"
              style={{ '--tab-accent': theme.accent }}
              onClick={() => choose(category)}
              onKeyDown={(event) => handleKey(event, index)}
            >
              {active && (
                <motion.span
                  className="dc-category-tab-paper"
                  layoutId="category-index-paper"
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 450, damping: 38 }
                  }
                  aria-hidden="true"
                />
              )}
              <CategorySymbol
                category={category}
                className="dc-filter-symbol"
              />
              <span className="dc-filter-label">
                {category === 'all' ? 'All' : theme.label}
              </span>
              <span className="dc-filter-count" aria-hidden="true">
                {count}
              </span>
              <span id={`dc-category-count-${category}`} className="sr-only">
                {count} discoveries
              </span>
            </button>
          );
        })}
      </div>
      {edges.left && (
        <button
          type="button"
          className="dc-category-scroll dc-category-scroll-left"
          aria-label="Previous categories"
          aria-controls="discovery-category-options"
          onClick={() => slide(-1)}
        >
          <CaretLeftIcon size={15} aria-hidden="true" />
        </button>
      )}
      {edges.right && (
        <button
          type="button"
          className="dc-category-scroll dc-category-scroll-right"
          aria-label="More categories"
          aria-controls="discovery-category-options"
          onClick={() => slide(1)}
        >
          <CaretRightIcon size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
