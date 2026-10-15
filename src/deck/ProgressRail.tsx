import { slides } from "../content/slides";
export function ProgressRail({
  current,
  onGo,
}: {
  current: number;
  onGo: (n: number) => void;
}) {
  return (
    <nav className="progress-rail" aria-label="Tiến độ bài thuyết trình">
      {slides.map((s, i) => (
        <button
          key={s.id}
          className={`section-${s.section} ${i <= current ? "visited" : ""} ${i === current ? "current" : ""}`}
          aria-label={`Slide ${i + 1}: ${s.title}`}
          aria-current={i === current ? "step" : undefined}
          title={s.title}
          onClick={() => onGo(i)}
        />
      ))}
    </nav>
  );
}
