export type Roster = {
  version: 1;
  names: string[];
  drawn: number[];
  sound: boolean;
  noRepeat: boolean;
};
export const ROSTER_KEY = "nhom7-class-roster-v1";
export const emptyRoster = (): Roster => ({
  version: 1,
  names: [],
  drawn: [],
  sound: true,
  noRepeat: true,
});

const plain = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .trim();
const isNameHeader = (s: string) =>
  /^(ho( va)? ten|ho ten sinh vien|ten sinh vien|full name|name)$/.test(
    plain(s),
  );

function cells(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let value = "",
    quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === delimiter && !quoted) {
      result.push(value.trim());
      value = "";
    } else value += c;
  }
  if (quoted)
    throw new Error(
      "Dấu ngoặc kép trong CSV chưa đóng. Hãy kiểm tra lại hoặc dán riêng cột Họ và tên.",
    );
  return [...result, value.trim()];
}

/** Accept a name column, numbered lines, or CSV/Excel rows with a name header. */
export function parseRoster(text: string): string[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!lines.length)
    throw new Error("Hãy nhập ít nhất một tên, mỗi người một dòng.");
  const delimiter = ["\t", ";", ","].find((d) => lines[0].includes(d));
  const rows = lines.map((line) =>
    delimiter ? cells(line, delimiter) : [line],
  );
  const column = rows[0].findIndex(isNameHeader);
  const names = (column >= 0 ? rows.slice(1) : rows)
    .map((row) => {
      let name: string;
      if (column >= 0) name = row[column] ?? "";
      else {
        const candidates = row.filter((v) => v && !/^\d+$/.test(v));
        if (candidates.length !== 1)
          throw new Error(
            "Danh sách nhiều cột cần tiêu đề “Họ và tên”. Bạn cũng có thể dán riêng một cột tên.",
          );
        name = candidates[0];
      }
      return name
        .replace(/^\s*(?:\d+[.)\-:]\s*|[-•]\s+)/, "")
        .replace(/\s+/g, " ")
        .trim();
    })
    .filter(Boolean);
  if (!names.length) throw new Error("Chưa có tên nào bên dưới hàng tiêu đề.");
  if (names.length > 500)
    throw new Error("Mỗi danh sách hỗ trợ tối đa 500 người.");
  if (names.some((n) => n.length > 100))
    throw new Error("Có dòng dài hơn 100 ký tự. Hãy kiểm tra lại cột họ tên.");
  return names;
}

export function loadRoster(): Roster {
  try {
    const value = JSON.parse(localStorage.getItem(ROSTER_KEY) || "null");
    if (
      value?.version !== 1 ||
      !Array.isArray(value.names) ||
      value.names.length > 500 ||
      !value.names.every(
        (n: unknown) =>
          typeof n === "string" && n.length > 0 && n.length <= 100,
      )
    )
      return emptyRoster();
    return {
      version: 1,
      names: value.names,
      drawn: Array.isArray(value.drawn)
        ? value.drawn
            .filter(
              (i: unknown) =>
                Number.isInteger(i) &&
                Number(i) >= 0 &&
                Number(i) < value.names.length,
            )
            .slice(-500)
        : [],
      sound: value.sound !== false,
      noRepeat: value.noRepeat !== false,
    };
  } catch {
    return emptyRoster();
  }
}

export function availablePeople(roster: Roster): number[] {
  const picked = new Set(roster.drawn);
  return roster.names
    .map((_, i) => i)
    .filter((i) => !roster.noRepeat || !picked.has(i));
}

/** Rejection sampling avoids modulo bias; animation does not determine the winner. */
export function randomIndex(length: number): number {
  if (!Number.isInteger(length) || length <= 0 || length > 500)
    throw new Error("Danh sách quay không hợp lệ.");
  const limit = Math.floor(0x100000000 / length) * length;
  const sample = new Uint32Array(1);
  do {
    crypto.getRandomValues(sample);
  } while (sample[0] >= limit);
  return sample[0] % length;
}
