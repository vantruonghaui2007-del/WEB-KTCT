import React from "react";
import { it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  renderHook,
  act,
} from "@testing-library/react";
import { slides } from "../src/content/slides";
import { useDeck, fragmentCount } from "../src/deck/useDeck";
import { SlideView } from "../src/deck/SlideView";
import { Quiz } from "../src/widgets/Quiz";
import { FlipCard } from "../src/widgets/FlipCard";
import { SortGame } from "../src/media/SortGame";
import { FeatureMap } from "../src/widgets/FeatureMap";
import { useTool } from "../src/tools/useTool";
it.each(slides.map((s) => [s.id, s] as const))(
  "renders slide %s and its sources",
  (_, s) => {
    render(<SlideView slide={s} step={fragmentCount(s)} mode="audience" />);
    expect(screen.getByRole("heading", { name: s.title })).toBeInTheDocument();
    expect(screen.getByTestId("source-chip")).toBeInTheDocument();
  },
);
it("PageDown/PageUp and input exclusion", () => {
  history.replaceState(null, "", "#/1/0");
  const { result } = renderHook(() => useDeck(slides));
  act(() => fireEvent.keyDown(window, { key: "PageDown" }));
  expect(result.current.pos).toEqual({ slide: 0, step: 1 });
  act(() => fireEvent.keyDown(window, { key: "PageUp" }));
  expect(result.current.pos).toEqual({ slide: 0, step: 0 });
  const input = document.createElement("input");
  document.body.appendChild(input);
  input.focus();
  act(() => fireEvent.keyDown(input, { key: " " }));
  expect(result.current.pos).toEqual({ slide: 0, step: 0 });
  input.remove();
});
it("flip cards work with an explicit pressed state", () => {
  render(<FlipCard concept={slides[3].concepts![0]} index={0} />);
  const card = screen.getByRole("button");
  expect(card).toHaveAttribute("aria-pressed", "false");
  fireEvent.click(card);
  expect(card).toHaveAttribute("aria-pressed", "true");
  expect(
    screen.getByText(slides[3].concepts![0].definition),
  ).toBeInTheDocument();
});
it("feature 3 navigates to slide 10", () => {
  const go = vi.fn();
  render(<FeatureMap points={slides[4].points} step={5} onGo={go} />);
  fireEvent.click(screen.getAllByRole("button")[2]);
  expect(go).toHaveBeenCalledWith(9);
});
it("quiz supports four choices, confirmation, feedback, score and replay", () => {
  const items = slides[18].quiz!;
  const onNext = vi.fn();
  const onRestart = vi.fn();
  const { rerender } = render(
    <Quiz items={items} step={0} onNext={onNext} onRestart={onRestart} />,
  );
  expect(screen.queryByText(items[0].explanation)).toBeNull();
  fireEvent.keyDown(window, { key: "b" });
  expect(screen.getByRole("button", { name: /^B\./ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  fireEvent.click(screen.getByRole("button", { name: "Xác nhận đáp án" }));
  expect(onNext).toHaveBeenCalledTimes(1);
  rerender(
    <Quiz items={items} step={1} onNext={onNext} onRestart={onRestart} />,
  );
  expect(screen.getByRole("button", { name: /^B\./ })).toHaveAttribute(
    "data-correct",
    "true",
  );
  expect(screen.getByText(items[0].explanation)).toBeVisible();

  rerender(
    <Quiz items={items} step={2} onNext={onNext} onRestart={onRestart} />,
  );
  fireEvent.keyDown(window, { key: "a" });
  fireEvent.click(screen.getByRole("button", { name: "Xác nhận đáp án" }));
  rerender(
    <Quiz items={items} step={3} onNext={onNext} onRestart={onRestart} />,
  );
  expect(screen.getByText(/Chưa chính xác\. Đáp án là B\./)).toBeVisible();

  rerender(
    <Quiz items={items} step={14} onNext={onNext} onRestart={onRestart} />,
  );
  expect(screen.getByText("Bạn trả lời đúng 1/7 câu")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: /Chơi lại/ }));
  expect(onRestart).toHaveBeenCalledTimes(1);
  rerender(
    <Quiz items={items} step={0} onNext={onNext} onRestart={onRestart} />,
  );
  expect(screen.getByRole("button", { name: /^B\./ })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});
it("sorts all seven cards with the keyboard and rejects incorrect assignments", () => {
  render(<SortGame conclusion={slides[2].points[2]} />);
  const temple = screen.getByRole("button", { name: "Đình", exact: true });
  fireEvent.keyDown(temple, { key: "1" });
  expect(
    screen.queryByRole("button", { name: "Đình, đã xếp đúng" }),
  ).toBeNull();
  for (const [name, key] of [
    ["Chùa", "1"],
    ["Nhà thờ", "1"],
    ["Thánh thất", "1"],
    ["Thánh đường", "1"],
    ["Bàn thờ tổ tiên", "2"],
    ["Đình", "2"],
    ["Đền", "2"],
  ])
    fireEvent.keyDown(screen.getByRole("button", { name, exact: true }), {
      key,
    });
  expect(screen.getByText(slides[2].points[2])).toBeVisible();
  expect(screen.getByText("Đã phân loại đủ 7 hình ảnh")).toBeVisible();
});
it("tool toggles and reset are deterministic", () => {
  const { result } = renderHook(() => useTool());
  act(() => result.current.set("laser"));
  expect(result.current.tool).toBe("laser");
  act(() => result.current.set("laser"));
  expect(result.current.tool).toBe("none");
  act(() => result.current.set("pen"));
  act(() => result.current.reset());
  expect(result.current.tool).toBe("none");
});
