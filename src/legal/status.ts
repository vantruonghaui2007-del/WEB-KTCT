export const LAW_2026 = {
  number: "07/2026/QH16",
  issued: "2026-04-23",
  effective: "2027-01-01",
} as const;
export function todayVN(now = new Date()) {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((t) => p.find((x) => x.type === t)!.value)
    .join("-");
}
export function lawStatus(
  now = new Date(),
): { phase: "pending"; daysLeft: number } | { phase: "in-force" } {
  const today = todayVN(now);
  return today >= LAW_2026.effective
    ? { phase: "in-force" }
    : {
        phase: "pending",
        daysLeft: Math.round(
          (Date.parse(LAW_2026.effective) - Date.parse(today)) / 86400000,
        ),
      };
}
export function lawLabel(now = new Date()) {
  const s = lawStatus(now);
  return s.phase === "pending"
    ? `Luật 2026 chưa có hiệu lực – còn ${s.daysLeft} ngày`
    : "Luật 2026 đã có hiệu lực – cần cập nhật căn cứ và số điều";
}
export function dataAgeLabel(asOf: string, now = new Date()) {
  const [y, m, d] = asOf.split("-");
  const [ty, tm, td] = todayVN(now).split("-").map(Number);
  const age = (ty - +y) * 12 + tm - +m - (td < +d ? 1 : 0);
  return `Số liệu công bố ${d}/${m}/${y} · ${age > 0 ? `cách đây ${age} tháng` : age === 0 ? "trong tháng qua" : "mốc công bố trong tương lai"}`;
}
