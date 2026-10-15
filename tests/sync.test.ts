// @vitest-environment node
import { it, expect } from "vitest";
import { createSync, type SyncMsg } from "../src/presenter/sync";
it("a presenter opened late receives the authoritative audience position", async () => {
  const got: SyncMsg[] = [];
  const channel = "test-" + Math.random();
  const audience = createSync(channel, (m) => {
    if (m.type === "hello")
      audience.send({ type: "state", pos: { slide: 6, step: 1 } });
  });
  const presenter = createSync(channel, (m) => got.push(m));
  try {
    presenter.send({ type: "hello" });
    await expect
      .poll(() => got)
      .toContainEqual({ type: "state", pos: { slide: 6, step: 1 } });
  } finally {
    audience.close();
    presenter.close();
  }
});
