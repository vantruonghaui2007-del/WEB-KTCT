import { ArrowUpRight } from "lucide-react";
export function FeatureMap({
  points,
  step,
  onGo,
}: {
  points: string[];
  step: number;
  onGo?: (n: number) => void;
}) {
  return (
    <div className="feature-map">
      <svg className="map-lines" viewBox="0 0 1600 620" aria-hidden="true">
        <circle cx="800" cy="300" r="180" />
        <circle cx="800" cy="300" r="220" />
        {[
          [300, 100],
          [1300, 100],
          [1370, 410],
          [800, 555],
          [240, 410],
        ].map(([x, y], i) => (
          <path key={i} d={`M800 300L${x} ${y}`} />
        ))}
      </svg>
      <div className="map-center">
        <span>05</span>
        <strong>
          Tôn giáo
          <br />ở Việt Nam
        </strong>
      </div>
      {points.map((p, i) => (
        <button
          key={p}
          className={`map-node node-${i} ${step > i ? "shown" : ""}`}
          disabled={step <= i}
          onClick={() => onGo?.([5, 7, 9, 11, 13][i])}
        >
          <span className="node-index">0{i + 1}</span>
          <b>{p.replace(/^\d\. /, "")}</b>
          <ArrowUpRight size={22} />
        </button>
      ))}
    </div>
  );
}
