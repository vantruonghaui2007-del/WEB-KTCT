import { useEffect, useRef, useState } from "react";
import type { Hands, Results } from "@mediapipe/hands";
import { Hand, ArrowLeft, ArrowRight } from "lucide-react";
import { asset } from "../content/media";
import {
  detectSwipe,
  SWIPE_PROFILES,
  type HandSample,
  type Sensitivity,
} from "./swipe";
let scriptPromise: Promise<void> | undefined;
function loadScript() {
  if (!scriptPromise)
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = asset("gesture/hands.js");
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        scriptPromise = undefined;
        reject(new Error("Không tải được bộ nhận diện tay."));
      };
      document.head.appendChild(script);
    });
  return scriptPromise;
}
function savedSensitivity(): Sensitivity {
  try {
    const value = localStorage.getItem("nhom7-gesture-sensitivity");
    if (value && Object.hasOwn(SWIPE_PROFILES, value))
      return value as Sensitivity;
  } catch {
    /* Use the default when browser storage is disabled. */
  }
  return "balanced";
}
export function GestureControl({
  onNext,
  onPrev,
  onClose,
  paused = false,
}: {
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  paused?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("Chưa bật camera");
  const [active, setActive] = useState(false);
  const [sensitivity, setSensitivity] = useState<Sensitivity>(savedSensitivity);
  const [tracking, setTracking] = useState<{
    x: number;
    y: number;
    progress: number;
  } | null>(null);
  const cleanup = useRef<() => void>(() => {});
  const running = useRef(false);
  const current = useRef({ onNext, onPrev, paused, sensitivity });
  current.current = { onNext, onPrev, paused, sensitivity };
  useEffect(() => () => cleanup.current(), []);
  const start = async () => {
    if (running.current) return;
    running.current = true;
    setActive(true);
    setTracking(null);
    setStatus("Đang khởi động nhận diện trên thiết bị…");
    let disposed = false,
      stream: MediaStream | undefined,
      hands: Hands | undefined;
    let frame = 0,
      animationFrame = 0;
    const video = ref.current!;
    const stop = () => {
      if (disposed) return;
      disposed = true;
      running.current = false;
      if (frame) video.cancelVideoFrameCallback?.(frame);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      stream?.getTracks().forEach((t) => {
        t.onended = null;
        t.stop();
      });
      video.srcObject = null;
      if (hands) void hands.close().catch(() => {});
    };
    cleanup.current = stop;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30, max: 30 },
          facingMode: "user",
        },
        audio: false,
      });
      if (disposed) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.getVideoTracks().forEach((t) => {
        t.onended = () => {
          if (disposed) return;
          stop();
          setActive(false);
          setTracking(null);
          setStatus("Camera đã ngắt. Kết nối lại và bấm Bật camera.");
        };
      });
      await loadScript();
      if (disposed) return;
      video.srcObject = stream;
      await video.play();
      if (disposed) return;
      const ctor = (window as unknown as { Hands: typeof Hands }).Hands;
      hands = new ctor({
        locateFile: (file: string) => asset(`gesture/${file}`),
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      let history: HandSample[] = [],
        smooth: { x: number; y: number } | null = null;
      let last = -Infinity,
        feedbackUntil = 0,
        lastUI = 0;
      let lastSensitivity = current.current.sensitivity;
      hands.onResults((result: Results) => {
        if (disposed) return;
        const now = performance.now();
        const settings = current.current;
        const profile = SWIPE_PROFILES[settings.sensitivity];
        if (settings.sensitivity !== lastSensitivity) {
          history = [];
          smooth = null;
          lastSensitivity = settings.sensitivity;
        }
        if (
          settings.paused ||
          document.hidden ||
          document.querySelector("dialog[open]")
        ) {
          history = [];
          smooth = null;
          setTracking(null);
          setStatus("Tạm dừng cử chỉ khi đang mở hộp thoại");
          return;
        }
        const landmarks = result.multiHandLandmarks?.[0];
        if (!landmarks || landmarks.length < 21) {
          history = [];
          smooth = null;
          setTracking(null);
          if (now >= feedbackUntil) setStatus("Đưa bàn tay vào khung hình");
          return;
        }
        // Average the wrist and four knuckles, then smooth small tracking noise.
        const center = [0, 5, 9, 13, 17].reduce(
          (p, i) => ({
            x: p.x + landmarks[i].x / 5,
            y: p.y + landmarks[i].y / 5,
          }),
          { x: 0, y: 0 },
        );
        const previous: { x: number; y: number } | null = smooth;
        smooth = previous
          ? {
              x: previous.x * 0.35 + center.x * 0.65,
              y: previous.y * 0.35 + center.y * 0.65,
            }
          : center;
        if (now - last < profile.cooldownMs) history = [];
        else
          history = [
            ...history.filter((p) => now - p.t <= 700),
            { ...smooth, t: now },
          ];
        const action = detectSwipe(history, { ...profile, lastFireAt: last });
        if (action) {
          last = now;
          history = [];
          feedbackUntil = now + 700;
          settings[action === "next" ? "onNext" : "onPrev"]();
          setStatus(action === "next" ? "Đã chuyển tiếp" : "Đã quay lại");
        } else if (now >= feedbackUntil)
          setStatus("Đã thấy bàn tay · Vuốt ngang để điều hướng");
        if (now - lastUI > 90) {
          lastUI = now;
          setTracking({
            ...smooth,
            progress: action
              ? 1
              : history.length
                ? Math.min(1, Math.abs(smooth.x - history[0].x) / profile.minDx)
                : 0,
          });
        }
      });
      const schedule = () => {
        if (disposed) return;
        if (typeof video.requestVideoFrameCallback === "function")
          frame = video.requestVideoFrameCallback(() => void tick());
        else animationFrame = requestAnimationFrame(() => void tick());
      };
      const tick = async () => {
        if (disposed) return;
        try {
          if (!document.hidden && video.readyState >= 2)
            await hands!.send({ image: video });
          schedule();
        } catch {
          if (disposed) return;
          stop();
          setActive(false);
          setTracking(null);
          setStatus(
            "Trình duyệt không hỗ trợ nhận diện. Hãy dùng clicker hoặc bàn phím.",
          );
        }
      };
      schedule();
    } catch (e) {
      if (disposed) return;
      stop();
      setActive(false);
      setTracking(null);
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
        <b>
          <Hand size={16} /> Cử chỉ bàn tay
        </b>
        <button aria-label="Đóng điều khiển cử chỉ" onClick={onClose}>
          ×
        </button>
      </header>
      <div className={`gesture-preview ${active ? "" : "hidden"}`}>
        <video ref={ref} muted playsInline />
        {tracking && !paused && (
          <span
            className="gesture-hand-dot"
            style={{
              left: `${(1 - tracking.x) * 100}%`,
              top: `${tracking.y * 100}%`,
            }}
          />
        )}
        <div className="gesture-preview-caption">
          <span>
            <ArrowLeft size={12} /> Tiếp
          </span>
          <span>
            Lùi <ArrowRight size={12} />
          </span>
        </div>
      </div>
      <div className="gesture-meter" aria-hidden="true">
        <i style={{ width: `${(tracking?.progress ?? 0) * 100}%` }} />
      </div>
      <p role="status">
        {paused && active ? "Tạm dừng cử chỉ khi đang mở hộp thoại" : status}
      </p>
      <label className="gesture-sensitivity">
        Độ nhạy
        <select
          value={sensitivity}
          onChange={(e) => {
            const value = e.target.value as Sensitivity;
            setSensitivity(value);
            try {
              localStorage.setItem("nhom7-gesture-sensitivity", value);
            } catch {
              /* Session setting remains usable. */
            }
          }}
        >
          {Object.entries(SWIPE_PROFILES).map(([value, profile]) => (
            <option key={value} value={value}>
              {profile.label}
            </option>
          ))}
        </select>
      </label>
      <small>
        Nhìn vào ảnh camera: vuốt tay sang trái để tiếp, sang phải để lùi. Nếu
        tay ở xa, chọn Nhạy. Giữ tay yên sau mỗi lượt vuốt để tránh chuyển nhầm.
      </small>
      <small className="gesture-privacy">
        Camera được xử lý trên máy, không gửi hình ảnh lên mạng.
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
            setTracking(null);
            setStatus("Đã tắt camera");
          }}
        >
          Tắt camera
        </button>
      )}
    </aside>
  );
}
