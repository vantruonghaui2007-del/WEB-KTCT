import { describe, it, expect, vi, afterEach } from "vitest";
import {
  parseRoster,
  loadRoster,
  availablePeople,
  emptyRoster,
  randomIndex,
  ROSTER_KEY,
} from "../src/widgets/roster";
import { detectSwipe, SWIPE_PROFILES } from "../src/gesture/swipe";

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.removeItem(ROSTER_KEY);
});
describe("class roster", () => {
  it("reads Excel columns and numbered lines while preserving two people with the same name", () => {
    expect(
      parseRoster(
        "\uFEFFSTT\tMã SV\tHọ và tên\r\n1\t1234\tNguyễn An\n2\t2345\tNguyễn An",
      ),
    ).toEqual(["Nguyễn An", "Nguyễn An"]);
    expect(parseRoster("1. Nguyễn An\n 2) Trần   Bình \n• Lê Chi")).toEqual([
      "Nguyễn An",
      "Trần Bình",
      "Lê Chi",
    ]);
    expect(parseRoster('STT;Họ tên;Lớp\n1;"Lê Chi";A1')).toEqual(["Lê Chi"]);
    expect(parseRoster('STT,Họ và tên,Lớp\n1,"Nguyễn An, A",1')).toEqual([
      "Nguyễn An, A",
    ]);
  });
  it("rejects ambiguous columns, empty input, overlong rows and malformed CSV", () => {
    expect(() => parseRoster("   ")).toThrow(/ít nhất/);
    expect(() => parseRoster("1234\tNguyễn An\tA1")).toThrow(/nhiều cột/);
    expect(() => parseRoster("Họ và tên\n")).toThrow(/Chưa có tên/);
    expect(() => parseRoster('Họ và tên,Lớp\n"Chưa đóng,A1')).toThrow(
      /ngoặc kép/,
    );
    expect(() => parseRoster("A".repeat(101))).toThrow(/100 ký tự/);
  });
  it("uses individual row identities for no-repeat selection and recovers corrupt storage", () => {
    const roster = {
      ...emptyRoster(),
      names: ["An", "An", "Bình"],
      drawn: [0, 2],
    };
    expect(availablePeople(roster)).toEqual([1]);
    expect(availablePeople({ ...roster, noRepeat: false })).toEqual([0, 1, 2]);
    localStorage.setItem(ROSTER_KEY, "corrupt");
    expect(loadRoster()).toEqual(emptyRoster());
    localStorage.setItem(
      ROSTER_KEY,
      JSON.stringify({ ...roster, drawn: [0, -1, 99, "1", 1.5] }),
    );
    expect(loadRoster().drawn).toEqual([0]);
  });
  it("rejects random values outside the unbiased range", () => {
    const values = [0xffffffff, 4];
    vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
      (array as Uint32Array)[0] = values.shift()!;
      return array;
    });
    expect(randomIndex(3)).toBe(1);
    expect(crypto.getRandomValues).toHaveBeenCalledTimes(2);
    expect(() => randomIndex(0)).toThrow();
  });
});
describe("gesture sensitivity and false movement rejection", () => {
  const samples = (xs: number[], ys = xs.map(() => 0.5), interval = 70) =>
    xs.map((x, i) => ({ x, y: ys[i], t: i * interval }));
  it("recognizes a shorter deliberate swipe in sensitive mode", () => {
    const movement = samples([0.3, 0.34, 0.38, 0.42]);
    expect(detectSwipe(movement, SWIPE_PROFILES.sensitive)).toBe("next");
    expect(detectSwipe(movement, SWIPE_PROFILES.balanced)).toBeNull();
    expect(
      detectSwipe(samples([0.7, 0.63, 0.55, 0.48]), SWIPE_PROFILES.balanced),
    ).toBe("prev");
  });
  it("ignores jitter, diagonal movement, tracking jumps, and movement during cooldown", () => {
    expect(detectSwipe(samples([0.4, 0.41, 0.39, 0.42, 0.4]))).toBeNull();
    expect(detectSwipe(samples([0.2, 0.42, 0.25, 0.5]))).toBeNull();
    expect(detectSwipe(samples([0.2, 0.3, 0.4], [0.2, 0.4, 0.6]))).toBeNull();
    expect(detectSwipe(samples([0.2, 0.3, 0.5], undefined, 300))).toBeNull();
    expect(detectSwipe(samples([0.2, 0.3, 0.5]), { lastFireAt: 0 })).toBeNull();
  });
});
