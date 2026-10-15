import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Stat } from "../content/types";
export function formatStat(s: Stat) {
  return `${s.prefix || ""}${s.value.toLocaleString("vi-VN", { minimumFractionDigits: s.decimals || 0, maximumFractionDigits: s.decimals || 0 })}${s.suffix || ""}`;
}
export function CountUp(props: Stat) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? props.value : 0);
  useEffect(() => {
    if (reduced) {
      setV(props.value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1000);
      setV(props.value * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [props.value, reduced]);
  return (
    <span aria-label={formatStat(props)}>
      {props.prefix && <small>{props.prefix}</small>}
      {v.toLocaleString("vi-VN", {
        minimumFractionDigits: props.decimals || 0,
        maximumFractionDigits: props.decimals || 0,
      })}
      {props.suffix && <small>{props.suffix}</small>}
    </span>
  );
}
