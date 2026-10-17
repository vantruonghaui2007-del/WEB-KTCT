import { useCallback, useEffect, useRef, useState } from "react";
import type { Slide } from "../content/types";
export interface DeckPos {
  slide: number;
  step: number;
}
export const KEYMAP: Record<string, string> = {
  ArrowRight: "next",
  PageDown: "next",
  " ": "next",
  ArrowLeft: "prev",
  PageUp: "prev",
  Home: "first",
  End: "last",
  o: "overview",
  p: "presenter",
  b: "blackout",
  l: "laser",
  s: "spotlight",
  d: "pen",
  z: "magnifier",
  c: "clear",
  Escape: "escape",
  e: "export",
  g: "gesture",
  r: "picker",
  f: "fullscreen",
  "?": "help",
};
export const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  !!target.closest('input,textarea,select,[contenteditable="true"]');
export function fragmentCount(s: Slide) {
  return s.quiz ? s.quiz.length * 2 : s.points.length;
}
export function next(p: DeckPos, d: Slide[]): DeckPos {
  return p.step < fragmentCount(d[p.slide])
    ? { ...p, step: p.step + 1 }
    : p.slide < d.length - 1
      ? { slide: p.slide + 1, step: 0 }
      : p;
}
export function prev(p: DeckPos, d: Slide[]): DeckPos {
  return p.step > 0
    ? { ...p, step: p.step - 1 }
    : p.slide > 0
      ? { slide: p.slide - 1, step: fragmentCount(d[p.slide - 1]) }
      : p;
}
export function clampPos(p: DeckPos, d: Slide[]): DeckPos {
  const slide = Math.max(0, Math.min(d.length - 1, Math.trunc(p.slide) || 0));
  return {
    slide,
    step: Math.max(
      0,
      Math.min(fragmentCount(d[slide]), Math.trunc(p.step) || 0),
    ),
  };
}
export function parseHash(h: string, d: Slide[]): DeckPos {
  const m = h.match(/^#\/(\d+)(?:\/(\d+))?$/);
  return m
    ? clampPos({ slide: +m[1] - 1, step: +(m[2] || 0) }, d)
    : { slide: 0, step: 0 };
}
export const toHash = (p: DeckPos) => `#/${p.slide + 1}/${p.step}`;
export function useDeck(
  deck: Slide[],
  opts?: {
    onChange?: (p: DeckPos) => void;
    onAction?: (a: string) => void;
    enabled?: boolean;
  },
) {
  const [pos, setPos] = useState(() => parseHash(location.hash, deck));
  const [overview, setOverview] = useState(false);
  const ref = useRef(pos);
  ref.current = pos;
  const options = useRef(opts);
  options.current = opts;
  const go = useCallback(
    (p: DeckPos, broadcast = true) => {
      const n = clampPos(p, deck);
      ref.current = n;
      setPos(n);
      history.replaceState(null, "", toHash(n));
      if (broadcast) options.current?.onChange?.(n);
    },
    [deck],
  );
  const advance = useCallback(() => go(next(ref.current, deck)), [go, deck]);
  const back = useCallback(() => go(prev(ref.current, deck)), [go, deck]);
  useEffect(() => {
    if (!location.hash) history.replaceState(null, "", toHash(ref.current));
    const hash = () => go(parseHash(location.hash, deck));
    addEventListener("hashchange", hash);
    return () => removeEventListener("hashchange", hash);
  }, [go, deck]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        document.querySelector("dialog[open]") ||
        options.current?.enabled === false ||
        isTyping(e.target) ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      )
        return;
      if (
        (e.key === " " || e.key === "Enter") &&
        e.target instanceof HTMLElement &&
        e.target.closest("button,a,video")
      )
        return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const a = KEYMAP[k];
      if (!a) return;
      const onQuiz = Boolean(deck[ref.current.slide]?.quiz);
      if (
        onQuiz &&
        ((a === "next" && !["ArrowLeft", "PageUp"].includes(e.key)) ||
          /^[a-d]$/i.test(k))
      )
        return;
      e.preventDefault();
      if (a === "next") advance();
      else if (a === "prev") back();
      else if (a === "first") go({ slide: 0, step: 0 });
      else if (a === "last")
        go({ slide: deck.length - 1, step: fragmentCount(deck.at(-1)!) });
      else if (a === "overview") setOverview((v) => !v);
      else options.current?.onAction?.(a);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [advance, back, go, deck]);
  return {
    pos,
    go,
    next: advance,
    prev: back,
    overview,
    toggleOverview: () => setOverview((v) => !v),
    closeOverview: () => setOverview(false),
  };
}
