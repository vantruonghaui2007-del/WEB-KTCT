import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { formatClock, paceStatus } from "./timerUtils";
export { formatClock, paceStatus } from "./timerUtils";
export function Timer({ slide }: { slide: number }) {
  const [elapsed, setElapsed] = useState(0),
    [running, setRunning] = useState(false),
    [target, setTarget] = useState(15),
    [now, setNow] = useState(new Date());
  const saved = useRef(0),
    started = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
      if (running)
        setElapsed(saved.current + performance.now() - started.current);
    }, 250);
    return () => clearInterval(id);
  }, [running]);
  const pace = paceStatus(elapsed, target * 60000, slide, 20);
  return (
    <div className={`presenter-timer pace-${pace}`}>
      <div>
        <span className="eyebrow">THỜI GIAN ĐÃ TRÔI</span>
        <strong>{formatClock(elapsed)}</strong>
      </div>
      <div className="timer-buttons">
        <button
          aria-label={running ? "Tạm dừng đồng hồ" : "Bắt đầu đồng hồ"}
          onClick={() => {
            if (running) saved.current = elapsed;
            else started.current = performance.now();
            setRunning((v) => !v);
          }}
        >
          {running ? <Pause /> : <Play />}
        </button>
        <button
          aria-label="Đặt lại đồng hồ"
          onClick={() => {
            saved.current = 0;
            started.current = performance.now();
            setElapsed(0);
          }}
        >
          <RotateCcw />
        </button>
      </div>
      <label>
        Mục tiêu{" "}
        <input
          aria-label="Số phút mục tiêu"
          type="number"
          min="1"
          max="180"
          value={target}
          onChange={(e) =>
            setTarget(Math.max(1, Math.min(180, +e.target.value || 1)))
          }
        />{" "}
        phút
      </label>
      <div className="pace-label">
        {elapsed >= target * 60000
          ? "Đã hết thời gian mục tiêu"
          : {
              ahead: "Đang đi nhanh hơn dự kiến",
              "on-track": "Đúng tiến độ",
              behind: "Cần tăng nhịp trình bày",
            }[pace]}
        <small>
          {now.toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} ·
          giờ Việt Nam
        </small>
      </div>
      <div className="timer-progress">
        <i
          style={{
            width: `${Math.min(100, (elapsed / (target * 60000)) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
