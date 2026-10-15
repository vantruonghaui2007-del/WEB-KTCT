import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Grid2X2,
  Monitor,
  Download,
  Maximize,
  HelpCircle,
  MousePointer2,
  PenLine,
  Focus,
  ZoomIn,
  Moon,
  Sun,
  Hand,
  Trash2,
  Loader2,
  Check,
  Palette,
} from "lucide-react";
import { slides } from "./content/slides";
import { sectionLabels } from "./content/types";
import type { MediaItem } from "./content/media";
import { useDeck, fragmentCount } from "./deck/useDeck";
import { Stage } from "./deck/Stage";
import { SlideView } from "./deck/SlideView";
import { ProgressRail } from "./deck/ProgressRail";
import { Overview } from "./deck/Overview";
import { Modal } from "./widgets/Modal";
import { ImageStage } from "./media/ImageStage";
import { IntroVideo } from "./media/IntroVideo";
import { useTool, type Tool } from "./tools/useTool";
import { ToolLayer } from "./tools/ToolLayer";
import { createSync } from "./presenter/sync";
import { PresenterView } from "./presenter/PresenterView";
import { GestureControl } from "./gesture/GestureControl";
export default function App() {
  const presenter = new URLSearchParams(location.search).has("presenter");
  const reduced = useReducedMotion();
  const [offlineReady, setOfflineReady] = useState(false);
  const [showOfflineBadge, setShowOfflineBadge] = useState(true);
  const [showRotateTip, setShowRotateTip] = useState(true);

  useEffect(() => {
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      let alive = true;
      const timeout = setTimeout(() => {
        if (alive) setOfflineReady(true);
      }, 2500);

      navigator.serviceWorker.ready
        .then(() => {
          if (alive) setOfflineReady(true);
        })
        .catch(() => {
          if (alive) setOfflineReady(true);
        })
        .finally(() => clearTimeout(timeout));

      return () => {
        alive = false;
        clearTimeout(timeout);
      };
    } else {
      setOfflineReady(true);
    }
  }, []);

  useEffect(() => {
    if (offlineReady) {
      const t = setTimeout(() => setShowOfflineBadge(false), 3500);
      return () => clearTimeout(t);
    }
  }, [offlineReady]);
  const [media, setMedia] = useState<MediaItem | null>(null),
    [video, setVideo] = useState(false),
    [help, setHelp] = useState(false),
    [gesture, setGesture] = useState(false),
    [exporting, setExporting] = useState(false),
    [notice, setNotice] = useState(""),
    [clearToken, setClearToken] = useState(0),
    [color, setColor] = useState("#9e2a2b"),
    [showTools, setShowTools] = useState(true),
    [connected, setConnected] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("nhom7-theme");
    return saved === "light" ? "light" : "dark";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.className = `theme-${theme} ${theme === "dark" ? "dark" : ""}`;
    localStorage.setItem("nhom7-theme", theme);
  }, [theme]);
  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);
  const tool = useTool();
  const channel = useRef<ReturnType<typeof createSync> | null>(null);
  const exportLock = useRef(false);
  const doExport = useCallback(async () => {
    if (exportLock.current) return;
    exportLock.current = true;
    setExporting(true);
    setNotice("Đang tạo 20 slide PowerPoint kèm ghi chú…");
    try {
      const { exportPptx, downloadPptx } = await import("./export/exportPptx");
      downloadPptx(await exportPptx(slides));
      setNotice("Đã tạo PowerPoint: 20 slide, ảnh và ghi chú.");
    } catch {
      setNotice(
        "Chưa xuất được PowerPoint. Hãy thử lại; bản trình chiếu vẫn hoạt động.",
      );
    } finally {
      exportLock.current = false;
      setExporting(false);
    }
  }, []);
  const full = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else
      void document.documentElement
        .requestFullscreen()
        .catch(() =>
          setNotice(
            "Trình duyệt chưa cho phép toàn màn hình. Bạn có thể dùng F11.",
          ),
        );
  };
  const openPresenter = () => {
    const url = new URL(location.href);
    url.searchParams.set("presenter", "");
    const win = window.open(
      url.toString(),
      "ktct-presenter",
      "popup,width=1440,height=960",
    );
    if (!win)
      setNotice(
        "Trình duyệt chặn cửa sổ mới. Hãy cho phép cửa sổ bật lên để mở chế độ người trình bày.",
      );
  };
  const sendTool = (t: Tool) => {
    if (presenter) channel.current?.send({ type: "tool", tool: t });
    else tool.set(t);
  };
  const deck = useDeck(slides, {
    enabled: !media && !video && !help,
    onChange: (p) => {
      channel.current?.send({ type: presenter ? "nav" : "state", pos: p });
    },
    onAction: (a) => {
      if (a === "presenter") openPresenter();
      else if (a === "export") void doExport();
      else if (a === "fullscreen") full();
      else if (a === "help") setHelp(true);
      else if (a === "gesture") setGesture((v) => !v);
      else if (a === "clear") setClearToken((v) => v + 1);
      else if (a === "escape") {
        tool.reset();
        setGesture(false);
      } else if (
        ["laser", "spotlight", "pen", "magnifier", "blackout"].includes(a)
      )
        sendTool(a as Tool);
    },
  });
  const live = useRef({ deck, tool });
  live.current = { deck, tool };
  useEffect(() => {
    const sync = createSync("ktct-chu-de-7", (m) => {
      if (!presenter && m.type === "hello")
        sync.send({ type: "state", pos: live.current.deck.pos });
      if (!presenter && m.type === "nav") {
        live.current.deck.go(m.pos, false);
        sync.send({ type: "state", pos: m.pos });
      }
      if (!presenter && m.type === "tool") live.current.tool.set(m.tool);
      if (presenter && m.type === "state") {
        live.current.deck.go(m.pos, false);
        setConnected(true);
      }
    });
    channel.current = sync;
    if (presenter) sync.send({ type: "hello" });
    else sync.send({ type: "state", pos: live.current.deck.pos });
    return () => {
      sync.close();
      channel.current = null;
    };
  }, [presenter]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 6500);
    return () => clearTimeout(t);
  }, [notice]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const move = () => {
      setShowTools(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowTools(false), 2500);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "t" || e.key === "T") {
        toggleTheme();
      }
    };
    addEventListener("pointermove", move);
    addEventListener("keydown", handleKey);
    move();
    return () => {
      clearTimeout(timer);
      removeEventListener("pointermove", move);
      removeEventListener("keydown", handleKey);
    };
  }, [toggleTheme]);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length !== 1) return;
      if (media || video || help || live.current.deck.overview) return;

      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const dt = Date.now() - startTime;

      if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.2 && dt < 800) {
        if (dx < 0) {
          live.current.deck.next();
        } else {
          live.current.deck.prev();
        }
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [media, video, help]);
  const s = slides[deck.pos.slide];
  const go = (n: number) => {
    deck.go({ slide: n, step: 0 });
    tool.reset();
  };
  const prevSection = useRef(s.section);
  const changedSection = prevSection.current !== s.section;
  useEffect(() => {
    prevSection.current = s.section;
  }, [s.section]);
  const toolsList: [Tool, typeof MousePointer2, string, string][] = [
    ["laser", MousePointer2, "Laser", "L"],
    ["spotlight", Focus, "Đèn soi", "S"],
    ["pen", PenLine, "Bút vẽ", "D"],
    ["magnifier", ZoomIn, "Kính lúp", "Z"],
    ["blackout", Moon, "Màn đen", "B"],
  ];
  return (
    <>
      {presenter ? (
        <PresenterView
          pos={deck.pos}
          onPrev={deck.prev}
          onNext={deck.next}
          onOverview={deck.toggleOverview}
          onTool={sendTool}
          onExport={() => void doExport()}
          connected={connected}
        />
      ) : (
        <main className="audience">
          <Stage>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                className={`slide-transition ${changedSection ? "section-transition" : ""}`}
                key={s.id}
                initial={{
                  opacity: 0,
                  x: reduced ? 0 : changedSection ? 0 : 35,
                  scale: reduced ? 1 : changedSection ? 0.985 : 1,
                }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: reduced ? 0 : -18 }}
                transition={{
                  duration: reduced ? 0.12 : 0.22,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <SlideView
                  slide={s}
                  step={deck.pos.step}
                  onGo={go}
                  onMedia={setMedia}
                  onVideo={() => setVideo(true)}
                  onNext={deck.next}
                />
              </motion.div>
            </AnimatePresence>
            <ToolLayer
              tool={tool.tool}
              slide={s}
              step={deck.pos.step}
              clearToken={clearToken}
              color={color}
            />
          </Stage>
          <ProgressRail current={deck.pos.slide} onGo={go} />
          <div className={`control-dock ${showTools ? "awake" : ""}`}>
            <div className="dock-nav">
              <button
                className="icon-button"
                aria-label="Ý trước (PageUp)"
                onClick={deck.prev}
                disabled={deck.pos.slide === 0 && deck.pos.step === 0}
              >
                <ArrowLeft size={19} />
              </button>
              <button
                className="slide-counter"
                aria-label="Mở tổng quan (O)"
                onClick={deck.toggleOverview}
              >
                <b>{s.id}</b>
                <span>/ 20</span>
              </button>
              <button
                className="icon-button"
                aria-label="Ý tiếp (PageDown)"
                onClick={deck.next}
                disabled={
                  deck.pos.slide === 19 && deck.pos.step === fragmentCount(s)
                }
              >
                <ArrowRight size={19} />
              </button>
            </div>
            <span className="dock-divider" />
            <button
              className="icon-button"
              aria-label="Tổng quan (O)"
              title="Tổng quan · O"
              onClick={deck.toggleOverview}
            >
              <Grid2X2 size={19} />
            </button>
            <div className="dock-tools">
              {toolsList.map(([t, Icon, label, key]) => (
                <button
                  key={t}
                  className={`icon-button ${tool.tool === t ? "active" : ""}`}
                  aria-label={`${label} (${key})`}
                  aria-pressed={tool.tool === t}
                  title={`${label} · ${key}`}
                  onClick={() => tool.set(t)}
                >
                  <Icon size={19} />
                </button>
              ))}
            </div>
            {tool.tool === "pen" && (
              <>
                <button
                  className="icon-button"
                  aria-label="Đổi màu bút"
                  title="Đổi màu bút"
                  style={{ color }}
                  onClick={() =>
                    setColor((c) =>
                      c === "#9e2a2b"
                        ? "#b08d57"
                        : c === "#b08d57"
                          ? "#ffffff"
                          : "#9e2a2b",
                    )
                  }
                >
                  <Palette size={19} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Xóa nét vẽ (C)"
                  onClick={() => setClearToken((v) => v + 1)}
                >
                  <Trash2 size={19} />
                </button>
              </>
            )}
            <span className="dock-divider" />
            <button
              className="icon-button"
              aria-label="Người trình bày (P)"
              title="Người trình bày · P"
              onClick={openPresenter}
            >
              <Monitor size={19} />
            </button>
            <button
              className="icon-button"
              aria-label="Xuất PowerPoint (E)"
              title="Xuất PowerPoint · E"
              disabled={exporting}
              onClick={() => void doExport()}
            >
              {exporting ? (
                <Loader2 className="spinning" size={19} />
              ) : (
                <Download size={19} />
              )}
            </button>
            <button
              className="icon-button optional-tool"
              aria-label="Điều khiển cử chỉ (G)"
              title="Cử chỉ · G"
              onClick={() => setGesture((v) => !v)}
            >
              <Hand size={19} />
            </button>
            <button
              className="icon-button theme-toggle-btn"
              aria-label={
                theme === "dark"
                  ? "Chuyển sang giao diện sáng (T)"
                  : "Chuyển sang giao diện tối (T)"
              }
              title={
                theme === "dark" ? "Giao diện sáng · T" : "Giao diện tối · T"
              }
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button
              className="icon-button"
              aria-label="Toàn màn hình (F)"
              title="Toàn màn hình · F"
              onClick={full}
            >
              <Maximize size={19} />
            </button>
            <button
              className="icon-button"
              aria-label="Hướng dẫn phím tắt"
              title="Hướng dẫn · ?"
              onClick={() => setHelp(true)}
            >
              <HelpCircle size={19} />
            </button>
          </div>
          {showRotateTip && (
            <aside className="mobile-rotate-tip" role="status">
              <span>📱 Xoay ngang màn hình để xem bài giảng lớn & rõ nét hơn</span>
              <button
                type="button"
                onClick={() => setShowRotateTip(false)}
                aria-label="Đóng gợi ý xoay màn hình"
              >
                ✕
              </button>
            </aside>
          )}
          <button
            type="button"
            className="mobile-touch-nav mobile-touch-prev"
            aria-label="Ý trước"
            onClick={deck.prev}
            disabled={deck.pos.slide === 0 && deck.pos.step === 0}
          >
            <ArrowLeft size={22} />
          </button>
          <button
            type="button"
            className="mobile-touch-nav mobile-touch-next"
            aria-label="Ý tiếp"
            onClick={deck.next}
            disabled={
              deck.pos.slide === 19 && deck.pos.step === fragmentCount(s)
            }
          >
            <ArrowRight size={22} />
          </button>
          {showOfflineBadge && (
            <span className="offline-badge">
              {offlineReady
                ? "✓ Đã lưu để dùng offline"
                : import.meta.env.PROD
                  ? "Đang chuẩn bị bản offline…"
                  : "Bản phát triển"}
            </span>
          )}
          <div className="section-indicator" aria-live="polite">
            {sectionLabels[s.section]} · {deck.pos.step}/{fragmentCount(s)}
          </div>
        </main>
      )}
      {deck.overview && (
        <Overview
          current={deck.pos.slide}
          onGo={go}
          onClose={deck.closeOverview}
        />
      )}
      {media && (
        <Modal
          title={media.alt}
          onClose={() => setMedia(null)}
          className="media-modal"
        >
          <ImageStage item={media} />
        </Modal>
      )}
      {video && (
        <Modal
          title="Đa dạng niềm tin — Gắn bó cộng đồng"
          onClose={() => setVideo(false)}
          className="video-modal"
        >
          <IntroVideo />
        </Modal>
      )}
      {help && (
        <Modal
          title="Sẵn sàng cho buổi thuyết trình"
          onClose={() => setHelp(false)}
          className="help-modal"
        >
          <p className="modal-description">
            Di chuột để hiện thanh công cụ. Mở cửa sổ người trình bày và kéo
            sang màn hình laptop; cửa sổ chính dành cho máy chiếu.
          </p>
          <div className="shortcut-grid">
            {[
              ["→ / PageDown / Space", "Mở ý tiếp hoặc chuyển slide"],
              ["← / PageUp", "Quay lại ý trước"],
              ["Home / End", "Về đầu / cuối bài"],
              ["O", "Tổng quan 20 màn hình"],
              ["P", "Ghi chú & đồng hồ trình bày"],
              ["F", "Bật / tắt toàn màn hình"],
              ["L / S", "Laser / đèn soi"],
              ["D / C", "Bút vẽ / xóa nét vẽ"],
              ["Z / B", "Kính lúp / màn đen"],
              ["E", "Xuất PowerPoint kèm ghi chú"],
              ["G", "Điều khiển bằng bàn tay"],
              ["Escape", "Tắt công cụ / đóng hộp thoại"],
              ["1 / 2", "Chọn đáp án hoặc phân loại ảnh"],
              ["+ / − / 0", "Zoom / đặt lại ảnh khi ảnh được chọn"],
            ].map(([k, l]) => (
              <div key={k}>
                <kbd>{k}</kbd>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <p className="help-note">
            <Check size={18} /> Ảnh, video, phông chữ và nhận diện cử chỉ đều
            được lưu tại máy. Hãy mở bài một lần và chờ lưu offline trước buổi
            trình bày.
          </p>
        </Modal>
      )}
      {gesture && !presenter && (
        <GestureControl
          onNext={deck.next}
          onPrev={deck.prev}
          onClose={() => setGesture(false)}
        />
      )}
      <div className="status-toast" role="status" aria-live="polite">
        {notice}
      </div>
    </>
  );
}
