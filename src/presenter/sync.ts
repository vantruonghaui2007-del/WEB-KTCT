import type { DeckPos } from "../deck/useDeck";
import type { Tool } from "../tools/useTool";
export type SyncMsg =
  | { type: "hello" }
  | { type: "state"; pos: DeckPos }
  | { type: "nav"; pos: DeckPos }
  | { type: "tool"; tool: Tool };
export function createSync(channel: string, onMsg: (m: SyncMsg) => void) {
  if (typeof BroadcastChannel !== "undefined") {
    const bc = new BroadcastChannel(channel);
    bc.onmessage = (e) => onMsg(e.data);
    return { send: (m: SyncMsg) => bc.postMessage(m), close: () => bc.close() };
  }
  const key = `sync-${channel}`;
  const listener = (e: StorageEvent) => {
    if (e.key === key && e.newValue) {
      try {
        onMsg(JSON.parse(e.newValue).message);
      } catch {
        /* Ignore unrelated malformed messages. */
      }
    }
  };
  addEventListener("storage", listener);
  return {
    send: (message: SyncMsg) =>
      localStorage.setItem(
        key,
        JSON.stringify({ message, nonce: Math.random() }),
      ),
    close: () => removeEventListener("storage", listener),
  };
}
