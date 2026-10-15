import { useState } from "react";
export type Tool =
  "none" | "laser" | "spotlight" | "pen" | "magnifier" | "blackout";
export function useTool() {
  const [tool, setTool] = useState<Tool>("none");
  return {
    tool,
    set: (t: Tool) => setTool((old) => (old === t ? "none" : t)),
    reset: () => setTool("none"),
  };
}
