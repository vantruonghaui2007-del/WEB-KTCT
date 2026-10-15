import { useEffect, useRef, useState } from "react";
import type { Hands, Results } from "@mediapipe/hands";
import { asset } from "../content/media";
import { detectSwipe, type HandSample } from "./swipe";
let scriptPromise: Promise<void> | undefined;
function loadScript() {
  if (!scriptPromise)
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = asset("gesture/hands.js");
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = undefined;
        reject(new Error("Không tải được bộ nhận diện tay."));
      };
      document.head.appendChild(script);
    });
  return scriptPromise;
}
export function GestureControl({
  onNext,
  onPrev,
  onClose,
}: {
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("Chưa bật camera"),
    [active, setActive] = useState(false);
  const cleanup = useRef<() => void>(() => {});
  const callbacks = useRef({ onNext, onPrev });
  callbacks.current = { onNext, onPrev };
  useEffect(() => () => cleanup.current(), []);
  const start = async () => {
    setActive(true);
    setStatus("Đang khởi động nhận diện trên thiết bị…");
    let disposed = false,
      stream: MediaStream | undefined,
      hands: Hands | undefined,
      frame = 0;
    cleanup.current = () => {
      disposed = true;
      if (frame && ref.current) ref.current.cancelVideoFrameCallback(frame);
      stream?.getTracks().forEach((t) => t.stop());
      void hands?.close();
    };
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      if (disposed) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      await loadScript();
      if (disposed) return;
      const video = ref.current!;
      video.srcObject = stream;
      await video.play();
      const ctor = (window as unknown as { Hands: typeof Hands }).Hands;
      hands = new ctor({ locateFile: (f: string) => asset(`gesture/${f}`) });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.65,
        minTrackingConfidence: 0.65,
      });
      let history: HandSample[] = [],
        last = -Infinity;
      hands.onResults((r: Results) => {
        if (disposed) return;
        const point = r.multiHandLandmarks?.[0]?.[0];
        const now = performance.now();
        if (!point) {
          history = [];
          setStatus("Đưa bàn tay vào khung hình");
          return;
        }
        history = [
          ...history.filter((p) => now - p.t < 600),
          { x: point.x, t: now },
        ];
        const action = detectSwipe(history, { lastFireAt: last });
        setStatus("Đã thấy bàn tay · Vuốt ngang để điều hướng");
        if (action) {
          last = now;
          history = [];
          callbacks.current[action === "next" ? "onNext" : "onPrev"]();
          setStatus(action === "next" ? "Đã chuyển tiếp" : "Đã quay lại");
        }
      });
      const tick = async () => {
        if (disposed) return;
        try {
          await hands!.send({ image: video });
          if (!disposed) frame = video.requestVideoFrameCallback(tick);
        } catch {
          cleanup.current();
          setActive(false);
          setStatus(
            "Trình duyệt không hỗ trợ nhận diện. Hãy dùng clicker hoặc bàn phím.",
          );
        }
      };
      frame = video.requestVideoFrameCallback(tick);
    } catch (e) {
      cleanup.current();
      setActive(false);
      setStatus(
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "Chưa được cấp quyền camera. Bạn vẫn có thể dùng bàn phím hoặc clicker."
          : "Không mở được camera hoặc bộ nhận diện. Hãy kiểm tra camera và thử lại.",
      );
    }
  };
  return (
    <aside className="gesture-panel" aria-label="Điều khiển bằng cử chỉ">
      <header>
        <b>Cử chỉ bàn tay</b>
        <button aria-label="Đóng điều khiển cử chỉ" onClick={onClose}>
          ×
        </button>
      </header>
      <video ref={ref} muted playsInline className={active ? "" : "hidden"} />
      <p role="status">{status}</p>
      <small>
        Camera được xử lý ngay trên máy, không gửi hình ảnh lên mạng. Vuốt sang
        trái để tiếp; sang phải để lùi. Khoảng nghỉ 1 giây.
      </small>
      {!active ? (
        <button className="primary" onClick={() => void start()}>
          Bật camera
        </button>
      ) : (
        <button
          onClick={() => {
            cleanup.current();
            setActive(false);
            setStatus("Đã tắt camera");
          }}
        >
          Tắt camera
        </button>
      )}
    </aside>
  );
}
