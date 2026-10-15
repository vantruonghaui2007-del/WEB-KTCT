import { ExternalLink, BookOpen } from "lucide-react";
import { sources } from "../content/sources";
export function SourceChip({
  ids,
  full = false,
}: {
  ids: string[];
  full?: boolean;
}) {
  return (
    <div className={`sources ${full ? "full" : ""}`} data-testid="source-chip">
      {ids.map((id) => {
        const s = sources.find((s) => s.id === id)!;
        return (
          <span className="source-wrap" key={id}>
            <a
              href={s.url}
              target={s.url ? "_blank" : undefined}
              rel="noreferrer"
              tabIndex={0}
              aria-label={`Nguồn: ${s.label}`}
            >
              <BookOpen size={15} />
              {s.label}
              {s.url && <ExternalLink size={13} />}
            </a>
            {s.url && <span className="source-tooltip">{s.url}</span>}
          </span>
        );
      })}
    </div>
  );
}
