import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Shuffle,
  Users,
  Upload,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Check,
  Download,
} from "lucide-react";
import { Modal } from "./Modal";
import {
  availablePeople,
  loadRoster,
  parseRoster,
  randomIndex,
  ROSTER_KEY,
} from "./roster";
import { createPickerSound } from "./pickerSound";
import "../styles/picker.css";

export function ClassPicker({ onClose }: { onClose: () => void }) {
  const [roster, setRoster] = useState(loadRoster);
  const [editing, setEditing] = useState(() => roster.names.length === 0);
  const [draft, setDraft] = useState(() => roster.names.join("\n"));
  const [message, setMessage] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [reading, setReading] = useState(false);
  const [display, setDisplay] = useState<number | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [storageWarning, setStorageWarning] = useState("");
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const audio = useRef<ReturnType<typeof createPickerSound> | undefined>(
    undefined,
  );
  const lock = useRef(false);
  const mounted = useRef(true);
  const input = useRef<HTMLInputElement>(null);
  const spinButton = useRef<HTMLButtonElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const available = availablePeople(roster);
  const uniqueDrawn = new Set(roster.drawn).size;

  useEffect(() => {
    try {
      localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
      setStorageWarning("");
    } catch {
      setStorageWarning(
        "Trình duyệt chưa lưu được danh sách. Bạn vẫn có thể quay; hãy tải bản TXT để giữ lại.",
      );
    }
  }, [roster]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
      audio.current?.close();
    };
  }, []);
  useEffect(() => {
    if (editing) textarea.current?.focus();
    else if (!spinning) spinButton.current?.focus();
  }, [editing, spinning]);

  const apply = () => {
    try {
      const names = parseRoster(draft);
      setRoster((r) => ({ ...r, names, drawn: [] }));
      setDraft(names.join("\n"));
      setWinner(null);
      setDisplay(null);
      setProgress(0);
      setEditing(false);
      setMessage("");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Chưa đọc được danh sách.");
    }
  };
  const readFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    if (!/\.(csv|txt)$/i.test(file.name)) {
      setMessage(
        "Hãy chọn tệp TXT hoặc CSV UTF-8; với Excel, sao chép cột họ tên vào ô bên dưới.",
      );
      return;
    }
    if (file.size > 1_000_000) {
      setMessage("Tệp quá lớn. Hãy xuất riêng cột họ tên (tối đa 1 MB).");
      return;
    }
    setReading(true);
    try {
      const text = await file.text();
      if (!mounted.current) return;
      setDraft(parseRoster(text).join("\n"));
      setMessage("Đã đọc tệp. Kiểm tra tên rồi bấm Dùng danh sách.");
    } catch (e) {
      if (mounted.current)
        setMessage(e instanceof Error ? e.message : "Không đọc được tệp.");
    } finally {
      if (mounted.current) setReading(false);
    }
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + roster.names.join("\r\n")], {
        type: "text/plain;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "danh-sach-lop.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const spin = () => {
    if (lock.current || !available.length || editing) return;
    lock.current = true;
    setSpinning(true);
    setWinner(null);
    setProgress(0);
    audio.current?.close();
    audio.current = createPickerSound(roster.sound);
    const selected = available[randomIndex(available.length)];
    const start = performance.now();
    const duration = reduced ? 450 : 3600;
    const tick = () => {
      if (!mounted.current) return;
      const p = Math.min(1, (performance.now() - start) / duration);
      setProgress(p);
      if (p >= 1) {
        setDisplay(selected);
        setWinner(selected);
        setSpinning(false);
        lock.current = false;
        setRoster((r) => ({
          ...r,
          drawn: [...r.drawn.filter((i) => i !== selected), selected],
        }));
        audio.current?.win();
      } else {
        setDisplay(reduced ? null : available[randomIndex(available.length)]);
        if (!reduced) audio.current?.tick();
        timer.current = setTimeout(
          tick,
          reduced ? duration : 55 + 300 * p ** 3,
        );
      }
    };
    tick();
  };
  const resetRound = () => {
    setRoster((r) => ({ ...r, drawn: [] }));
    setWinner(null);
    setDisplay(null);
    setProgress(0);
  };

  return (
    <Modal
      title="Ai sẽ là người tiếp theo?"
      onClose={onClose}
      className="picker-modal"
    >
      <div
        className={`picker-layout ${editing ? "is-editing" : ""}`}
        onKeyDown={(e) => {
          if (
            (e.key === " " || e.key === "Enter") &&
            !(e.target as HTMLElement).closest("button,input,textarea,select,a")
          ) {
            e.preventDefault();
            e.stopPropagation();
            spin();
          }
        }}
      >
        <section
          className={`picker-stage ${spinning ? "is-spinning" : ""} ${winner !== null ? "has-winner" : ""}`}
          aria-label="Sân khấu quay tên"
          tabIndex={0}
        >
          <div className="picker-stage-heading">
            <span className="picker-live-dot" />
            <span>MỘT CÂU HỎI · MỘT GÓC NHÌN MỚI</span>
          </div>
          <div className="picker-orbit" aria-hidden="true">
            <i />
            <i />
            <Sparkles />
          </div>
          <div className="picker-ticket">
            <span className="picker-kicker">
              {spinning
                ? "Vòng quay đang tìm bạn…"
                : winner !== null
                  ? "XIN MỜI BẠN"
                  : "SẴN SÀNG CHIA SẺ?"}
            </span>
            <div className="picker-name" aria-hidden={spinning}>
              {display !== null
                ? roster.names[display]
                : roster.names.length
                  ? "Cơ hội dành cho tất cả"
                  : "Cả lớp cùng tham gia"}
            </div>
            <span className="picker-person-number">
              {display !== null
                ? `SỐ ${String(display + 1).padStart(2, "0")} TRONG DANH SÁCH`
                : "Thêm danh sách · Quay tên · Cùng thảo luận"}
            </span>
          </div>
          {winner !== null && (
            <div className="picker-confetti" aria-hidden="true">
              {Array.from({ length: 16 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    left: `${6 + i * 6}%`,
                    animationDelay: `${(i % 5) * 0.07}s`,
                    background: i % 2 ? "var(--gold)" : "var(--red)",
                  }}
                />
              ))}
            </div>
          )}
          <div className="sr-only" role="status" aria-live="polite">
            {winner !== null
              ? `Xin mời ${roster.names[winner]}, số ${winner + 1} trong danh sách.`
              : ""}
          </div>
          <div className="picker-progress" aria-hidden="true">
            <i style={{ width: `${progress * 100}%` }} />
          </div>
          <button
            ref={spinButton}
            className="picker-spin"
            disabled={spinning || !available.length || editing}
            onClick={spin}
          >
            <Shuffle size={22} />
            {spinning
              ? "Đang quay…"
              : winner !== null
                ? "Quay người tiếp theo"
                : "Bắt đầu quay tên"}
          </button>
          <p className="picker-stage-note">
            {!roster.names.length
              ? "Nhập danh sách lớp để bắt đầu."
              : !available.length
                ? "Đã gọi đủ cả lớp! Bấm Vòng mới để bắt đầu lại."
                : editing
                  ? "Lưu danh sách để bắt đầu vòng quay."
                  : `${available.length} người có thể được chọn · Space hoặc Enter để quay`}
          </p>
        </section>
        <aside className="picker-sidebar">
          <div className="picker-sidebar-head">
            <h3>
              <Users size={19} /> Danh sách lớp
            </h3>
            <span>{roster.names.length} người</span>
          </div>
          {editing ? (
            <div className="picker-editor">
              <label htmlFor="class-roster">Mỗi người một dòng</label>
              <p>
                Dán cột họ tên từ Excel, hoặc nhập tệp TXT / CSV UTF-8 có cột
                “Họ và tên”.
              </p>
              <textarea
                ref={textarea}
                id="class-roster"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Dán danh sách lớp tại đây…"
                rows={7}
                disabled={reading}
              />
              <input
                ref={input}
                type="file"
                accept=".txt,.csv,text/plain,text/csv"
                onChange={(e) => void readFile(e)}
                className="sr-only"
                tabIndex={-1}
                aria-label="Nhập tệp danh sách lớp"
              />
              <div className="picker-editor-actions">
                <button
                  className="picker-secondary"
                  onClick={() => input.current?.click()}
                  disabled={reading}
                >
                  <Upload size={16} />
                  {reading ? "Đang đọc…" : "Nhập tệp"}
                </button>
                <button
                  className="primary"
                  onClick={apply}
                  disabled={reading || !draft.trim()}
                >
                  <Check size={16} /> Dùng danh sách
                </button>
              </div>
              {roster.names.length > 0 && (
                <button
                  className="picker-cancel"
                  onClick={() => {
                    setDraft(roster.names.join("\n"));
                    setEditing(false);
                    setMessage("");
                  }}
                >
                  Hủy chỉnh sửa
                </button>
              )}
              <p className="picker-local-note">
                Tên trùng vẫn là hai người riêng, phân biệt bằng số thứ tự. Áp
                dụng danh sách sẽ bắt đầu vòng mới.
              </p>
              {message && (
                <p className="picker-message" role="status">
                  {message}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="picker-counts">
                <div>
                  <strong>{available.length}</strong>
                  <span>Có thể được gọi</span>
                </div>
                <div>
                  <strong>{uniqueDrawn}</strong>
                  <span>Đã tham gia</span>
                </div>
              </div>
              <div className="picker-editor-actions">
                <button
                  className="picker-secondary"
                  disabled={spinning}
                  onClick={() => {
                    setEditing(true);
                    setDraft(roster.names.join("\n"));
                  }}
                >
                  <Users size={16} /> Sửa danh sách
                </button>
                <button
                  className="picker-secondary"
                  onClick={download}
                  aria-label="Tải danh sách TXT"
                >
                  <Download size={16} />
                </button>
              </div>
            </>
          )}
          <div className="picker-settings">
            <label>
              <input
                type="checkbox"
                checked={roster.noRepeat}
                disabled={spinning}
                onChange={(e) =>
                  setRoster((r) => ({ ...r, noRepeat: e.target.checked }))
                }
              />
              <span>Không gọi lại người đã chọn</span>
            </label>
            <button
              className="picker-setting-button"
              aria-pressed={roster.sound}
              onClick={() => {
                if (roster.sound) audio.current?.close();
                setRoster((r) => ({ ...r, sound: !r.sound }));
              }}
            >
              {roster.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
              <span>Âm thanh {roster.sound ? "bật" : "tắt"}</span>
            </button>
          </div>
          <div className="picker-history">
            <div>
              <h4>ĐÃ ĐƯỢC GỌI</h4>
              <button
                disabled={spinning || !roster.drawn.length}
                onClick={resetRound}
              >
                <RotateCcw size={14} /> Vòng mới
              </button>
            </div>
            {roster.drawn.length ? (
              <ol>
                {roster.drawn
                  .slice(-4)
                  .reverse()
                  .map((person, i) => (
                    <li key={`${person}-${i}`}>
                      <span>{String(person + 1).padStart(2, "0")}</span>
                      <b>{roster.names[person]}</b>
                      {i === 0 && <Check size={15} />}
                    </li>
                  ))}
              </ol>
            ) : (
              <p>Mỗi lượt gọi là một cơ hội chia sẻ.</p>
            )}
          </div>
          <p className="picker-local-note">
            Danh sách chỉ được lưu trong trình duyệt trên máy này. Quay tên và
            âm thanh dùng được offline.
          </p>
          {storageWarning && (
            <p role="status" className="picker-message">
              {storageWarning}
            </p>
          )}
        </aside>
      </div>
    </Modal>
  );
}
