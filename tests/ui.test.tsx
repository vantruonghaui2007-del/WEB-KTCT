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
it("quiz selection does not reveal the answer until the next step", () => {
  const { rerender } = render(<Quiz items={slides[18].quiz!} step={0} />);
  expect(screen.queryByText(slides[18].quiz![0].explanation)).toBeNull();
  fireEvent.keyDown(window, { key: "1" });
  expect(screen.getByRole("button", { name: /^A/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  rerender(<Quiz items={slides[18].quiz!} step={1} />);
  expect(screen.getByRole("button", { name: /^A/ })).toHaveAttribute(
    "data-correct",
    "true",
  );
  expect(screen.getByText(slides[18].quiz![0].explanation)).toBeVisible();
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
