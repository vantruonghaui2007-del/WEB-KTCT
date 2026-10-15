import React from "react";
import { it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "../src/App";
import { FlipCard } from "../src/widgets/FlipCard";
import { slides } from "../src/content/slides";

beforeAll(() => {
  // Mock ResizeObserver for jsdom
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;

  // Mock Canvas 2D context for jsdom
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

it("renders slide 12 FlipCards with Lucide vector icons and no unicode emoji stickers", () => {
  const slide12 = slides.find((s) => s.id === "12")!;
  expect(slide12).toBeDefined();
  expect(slide12.concepts).toHaveLength(3);

  const { container } = render(
    <div>
      {slide12.concepts!.map((c, i) => (
        <FlipCard key={c.term} concept={c} index={i} />
      ))}
    </div>,
  );

  // Check all 3 cards exist
  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(3);
  expect(screen.getAllByText("Chức sắc")).toHaveLength(2); // Front and back
  expect(screen.getAllByText("Chức việc")).toHaveLength(2);
  expect(screen.getAllByText("Nhà tu hành")).toHaveLength(2);

  // Ensure svg vector icons are rendered inside .concept-symbol
  const symbols = container.querySelectorAll(".concept-symbol svg");
  expect(symbols).toHaveLength(3);

  // Ensure no raw unicode stickers exist in text content
  expect(container.textContent).not.toContain("◈");
  expect(container.textContent).not.toContain("✳");
  expect(container.textContent).not.toContain("◇");
});

it("supports mobile touch navigation and swipe gestures in App", async () => {
  window.location.hash = "#/12/0";
  render(<App />);

  // Check mobile navigation buttons exist
  const prevBtn = screen.getByLabelText("Ý trước");
  const nextBtn = screen.getByLabelText("Ý tiếp");
  expect(prevBtn).toBeInTheDocument();
  expect(nextBtn).toBeInTheDocument();

  // Check rotate tip is rendered and can be closed
  const closeTip = screen.getByLabelText("Đóng gợi ý xoay màn hình");
  expect(closeTip).toBeInTheDocument();
  fireEvent.click(closeTip);
  expect(screen.queryByLabelText("Đóng gợi ý xoay màn hình")).toBeNull();

  // Test touch swipe left to go next
  await act(async () => {
    fireEvent.touchStart(window, {
      touches: [{ clientX: 250, clientY: 200 }],
    });
    fireEvent.touchEnd(window, {
      changedTouches: [{ clientX: 100, clientY: 200 }],
    });
  });

  // Verify slide moved to 13
  expect(window.location.hash).toBe("#/13/0");

  // Test touch swipe right to go back
  await act(async () => {
    fireEvent.touchStart(window, {
      touches: [{ clientX: 100, clientY: 200 }],
    });
    fireEvent.touchEnd(window, {
      changedTouches: [{ clientX: 250, clientY: 200 }],
    });
  });

  // Verify slide moved back to 12
  expect(window.location.hash).toBe("#/12/0");
});
