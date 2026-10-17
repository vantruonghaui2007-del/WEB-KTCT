import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Globe2,
  HeartHandshake,
  Flower2,
  Users,
  Scale,
  Quote,
} from "lucide-react";
import type { Slide } from "../content/types";
import { sectionLabels } from "../content/types";
import { SourceChip } from "../widgets/SourceChip";
import { CountUp, formatStat } from "../widgets/CountUp";
import { FlipCard } from "../widgets/FlipCard";
import { FeatureMap } from "../widgets/FeatureMap";
import { Quiz } from "../widgets/Quiz";
import { SortGame } from "../media/SortGame";
import { Gallery } from "../media/Gallery";
import { SafeImage } from "../media/ImageStage";
import { findMedia, type MediaItem } from "../content/media";
import { lawLabel, todayVN, dataAgeLabel, lawStatus } from "../legal/status";
import { AmbientBackground } from "../widgets/AmbientBackground";
interface Props {
  slide: Slide;
  step: number;
  mode?: "audience" | "thumb";
  onGo?: (n: number) => void;
  onMedia?: (m: MediaItem) => void;
  onVideo?: () => void;
  onNext?: () => void;
}
function Drum() {
  return (
    <svg className="drum" viewBox="0 0 600 600" fill="none" aria-hidden="true">
      <circle cx="300" cy="300" r="285" />
      <circle cx="300" cy="300" r="266" strokeDasharray="2 9" strokeWidth="9" />
      <circle cx="300" cy="300" r="245" />
      <circle cx="300" cy="300" r="214" />
      <circle cx="300" cy="300" r="180" />
      {Array.from({ length: 24 }, (_, i) => (
        <path
          key={i}
          d="M300 55l15 33-15 8-15-8z"
          transform={`rotate(${i * 15} 300 300)`}
        />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d="M300 120l20 120-20 60-20-60z"
          transform={`rotate(${i * 30} 300 300)`}
        />
      ))}
    </svg>
  );
}
export function SlideView({
  slide: s,
  step,
  mode = "audience",
  onGo,
  onMedia,
  onVideo,
  onNext,
}: Props) {
  const reduced = useReducedMotion();
  const interactive = mode === "audience";
  const reveal = (p: string, i: number) => (
    <motion.div
      className="point"
      key={p}
      initial={false}
      animate={{
        opacity: step > i ? 1 : 0,
        y: step > i ? 0 : reduced ? 0 : 18,
      }}
      transition={{ duration: reduced ? 0.12 : 0.3 }}
      aria-hidden={step <= i}
    >
      <span className="point-number">{String(i + 1).padStart(2, "0")}</span>
      <p>{p}</p>
    </motion.div>
  );
  const icon =
    [Flower2, Globe2, HeartHandshake, Users, Globe2][
      Math.max(0, +s.section.slice(-1) - 1)
    ] || Scale;
  const Icon = icon;
  return (
    <article
      className={`slide slide-${s.layout} section-${s.section} ${mode === "thumb" ? "thumbnail" : ""}`}
      data-slide={s.id}
      onClick={(event) => {
        if (!interactive) return;
        const target = event.target;
        if (
          target instanceof Element &&
          target.closest(
            "button,a,video,input,textarea,select,[role='button'],[data-no-advance]",
          )
        )
          return;
        onNext?.();
      }}
    >
      {mode === "audience" && <AmbientBackground />}
      <div className="slide-topline">
        <div className="brand-mark">
          7
          <span>
            NHÓM BẢY
            <br />
            <b>CHỦ NGHĨA XÃ HỘI KHOA HỌC</b>
          </span>
        </div>
        <span className="section-label">
          {sectionLabels[s.section]}
          <span className="top-dot" />
          CHỦ ĐỀ 07
        </span>
      </div>
      <Drum />
      {s.layout === "title" ? (
        <div className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="short-rule" />
              CHỦ ĐỀ 07 · KHÁM PHÁ & KẾT NỐI
            </span>
            <h1 aria-label={s.title}>
              <span>Đặc điểm của</span>
              <strong>tôn giáo</strong>
              <span>
                ở Việt Nam<span className="red-period">.</span>
              </span>
              <span className="sr-only">Chủ đề 7: </span>
            </h1>
            <div className="hero-message">
              {s.points[2].replace("Thông điệp: ", "")}
            </div>
            <div className="hero-actions">
              <button
                className="primary"
                onClick={() => onGo?.(1)}
                disabled={!interactive}
              >
                Bắt đầu trình bày <ArrowRight size={23} />
              </button>
              <button
                className="text-button"
                onClick={onVideo}
                disabled={!interactive}
              >
                <Play size={19} /> Xem video tư liệu VNA
              </button>
            </div>
            <div className="hero-meta">
              <span>20 màn hình</span>
              <i />5 đặc điểm
              <i />
              <span>Nhóm thực hiện: Nhóm 7</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-image-frame">
              <SafeImage item={findMedia("pagoda")} />
              <span className="art-caption">
                ĐA DẠNG NIỀM TIN
                <br />
                <b>Gắn bó cộng đồng.</b>
              </span>
            </div>
            <span className="vertical-caption">
              VĂN HÓA · NIỀM TIN · CON NGƯỜI
            </span>
            <div className="hero-seal">
              VN<span>CHỦ ĐỀ 07</span>
            </div>
            <button
              className="art-disclosure"
              onClick={() => onMedia?.(findMedia("pagoda"))}
              disabled={!interactive}
            >
              Ảnh tư liệu thật · xem thông tin ghi công
            </button>
          </div>
        </div>
      ) : s.layout === "closing" ? (
        <div className="closing-content">
          <span className="eyebrow">NHÓM 7 · CHỦ ĐỀ 07</span>
          <h1 aria-label={s.title}>
            Kết luận
            <br />
            <em>và cảm ơn</em>
          </h1>
          <div className="closing-points">{s.points.map(reveal)}</div>
          <button
            className="primary"
            onClick={() => onGo?.(4)}
            disabled={!interactive}
          >
            Nhìn lại năm đặc điểm <ArrowRight size={22} />
          </button>
          <span className="closing-flower" aria-hidden="true">
            <Flower2 size={220} strokeWidth={0.8} />
          </span>
        </div>
      ) : (
        <>
          <div className="slide-heading">
            <span className="eyebrow">
              {s.id === "19"
                ? "CÙNG NHAU ÔN TẬP"
                : `CHỦ ĐỀ 07 / ${sectionLabels[s.section].toLocaleUpperCase("vi")}`}
            </span>
            <h1>{s.title}</h1>
            <span className="heading-rule" />
          </div>
          <div className={`slide-body body-${s.layout}`}>
            {s.layout === "roadmap" && (
              <div className="roadmap-layout">
                <div
                  className={`member-panel ${step > 0 ? "visible-fragment" : ""}`}
                  aria-hidden={step === 0}
                >
                  <span className="eyebrow">NHỮNG NGƯỜI ĐỒNG HÀNH</span>
                  <div className="member-list">
                    {s.points[0]
                      .split("Thành viên: ")[1]
                      .split("; ")
                      .map((n, i) => (
                        <div key={n}>
                          <span>{String(i + 1).padStart(2, "0")}</span>
                          <b>{n}</b>
                        </div>
                      ))}
                  </div>
                  <p className="member-note">Nhóm 7 · 11 thành viên</p>
                </div>
                <div
                  className={`roadmap-list ${step > 1 ? "visible-fragment" : ""}`}
                  aria-hidden={step < 2}
                >
                  <span className="eyebrow">LỘ TRÌNH HÔM NAY</span>
                  {s.points[1]
                    .replace("Lộ trình: ", "")
                    .replace(/\.$/, "")
                    .split(" → ")
                    .map((p, i) => (
                      <button
                        key={p}
                        onClick={() => onGo?.([3, 4, 15, 17, 18][i])}
                        disabled={!interactive || step < 2}
                      >
                        <span>0{i + 1}</span>
                        <b>{p}</b>
                        <ArrowRight />
                      </button>
                    ))}
                </div>
              </div>
            )}
            {s.layout === "prompt" && (
              <>
                <div className="prompt-question">
                  {step > 0 && <p>{s.points[0]}</p>}
                  <button
                    className="video-pill"
                    onClick={onVideo}
                    disabled={!interactive}
                  >
                    <Play size={18} /> Video tư liệu Vesak 2025 · VNA
                  </button>
                </div>
                {step > 1 && interactive ? (
                  <SortGame conclusion={s.points[2]} />
                ) : step > 1 ? (
                  <p>{s.points[1]}</p>
                ) : (
                  <div className="prompt-wait">
                    <Flower2 />
                    <span>
                      Nhấn tiếp để cùng khám phá những hình ảnh quen thuộc.
                    </span>
                  </div>
                )}
                {step > 2 && <p className="prompt-note">{s.points[2]}</p>}
              </>
            )}
            {s.layout === "concepts" && (
              <div className="concept-grid">
                {s.concepts!.map((c, i) => (
                  <FlipCard
                    key={c.term}
                    concept={c}
                    index={i}
                    interactive={interactive}
                  />
                ))}
              </div>
            )}
            {s.layout === "feature-map" && (
              <FeatureMap points={s.points} step={step} onGo={onGo} />
            )}
            {s.layout === "points" &&
              (s.id === "06" ? (
                <div className="gallery-layout">
                  <div className="gallery-points">{s.points.map(reveal)}</div>
                  <Gallery
                    ids={s.mediaIds!}
                    onOpen={interactive ? onMedia : undefined}
                  />
                </div>
              ) : s.id === "17" ? (
                <>
                  <div className="law-timeline">
                    <div>
                      <b>2016</b>
                      <span>Luật 02/2016/QH14</span>
                    </div>
                    <i />
                    <div>
                      <b>23.04.2026</b>
                      <span>Ban hành Luật 07/2026/QH16</span>
                    </div>
                    <i />
                    <div>
                      <b>01.01.2027</b>
                      <span>Luật mới có hiệu lực</span>
                    </div>
                  </div>
                  <div className={`legal-badge ${lawStatus().phase}`}>
                    <Scale size={25} />
                    {lawLabel()}
                    <small>
                      Hôm nay: {todayVN().split("-").reverse().join("/")} · giờ
                      Việt Nam
                    </small>
                  </div>
                  <div className="law-points">{s.points.map(reveal)}</div>
                </>
              ) : (
                <div className="standard-layout">
                  <div className="points-list">{s.points.map(reveal)}</div>
                  <div className="side-motif">
                    <Icon strokeWidth={0.7} />
                    <span>
                      {s.section.startsWith("dac-diem")
                        ? "ĐẶC ĐIỂM"
                        : "GÓC NHÌN"}
                    </span>
                    <b>
                      {s.section.startsWith("dac-diem")
                        ? `0${s.section.slice(-1)}`
                        : s.id}
                    </b>
                    <div className="motif-rule" />
                  </div>
                </div>
              ))}
            {s.layout === "stats" && (
              <div
                className={`stats-layout ${s.id === "15" ? "vesak-layout" : ""}`}
              >
                <div className="stats-main">
                  <span className="data-age">{dataAgeLabel(s.asOf!)}</span>
                  {step > 0 && <p className="stat-intro">{s.points[0]}</p>}
                  <div className="stats-grid">
                    {step > 1 &&
                      s.stats!.map((st) => (
                        <div className="stat-card" key={st.label}>
                          {interactive ? (
                            <CountUp {...st} />
                          ) : (
                            <span>{formatStat(st)}</span>
                          )}
                          <b>{st.label}</b>
                        </div>
                      ))}
                  </div>
                  {step > 2 && <p className="stat-context">{s.points[2]}</p>}
                </div>
                {s.id === "15" && (
                  <button
                    className="vesak-art"
                    onClick={() => onMedia?.(findMedia("vesak"))}
                    disabled={!interactive}
                  >
                    <SafeImage item={findMedia("vesak")} />
                    <span>
                      Tư liệu Lễ Phật đản Sa Đéc, 2008 · Không phải ảnh Vesak
                      2025
                    </span>
                  </button>
                )}
              </div>
            )}
            {s.layout === "quote" && (
              <div className="quote-layout">
                {step > 0 && (
                  <motion.div
                    className="quote-hero-card"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38 }}
                  >
                    <div className="quote-icon-badge">
                      <Quote className="quote-mark" />
                    </div>
                    <blockquote>{s.points[0]}</blockquote>
                    <div className="quote-tagline">
                      <span className="quote-badge-pill">ĐẶC ĐIỂM CHỦ ĐẠO</span>
                      <span className="quote-sep" />
                      <span className="quote-source-label">
                        Tài liệu học tập chính thức · Tôn trọng khác biệt
                      </span>
                    </div>
                  </motion.div>
                )}
                {step > 1 && (
                  <motion.div
                    className="values-grid"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42 }}
                  >
                    {s.points[1]
                      .replace("Giá trị cần phát huy: ", "")
                      .replace(/\.$/, "")
                      .split("; ")
                      .map((p, i) => (
                        <div
                          key={p}
                          className={`value-card value-card-${i + 1}`}
                        >
                          <div className="value-header">
                            <span className="value-num">0{i + 1}</span>
                            <span className="value-pill">GIÁ TRỊ</span>
                          </div>
                          <p className="value-text">{p}</p>
                        </div>
                      ))}
                  </motion.div>
                )}
                {step > 2 && (
                  <motion.div
                    className="caution-note"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <span className="caution-badge">LƯU Ý KHOA HỌC</span>
                    <p>{s.points[2]}</p>
                  </motion.div>
                )}
              </div>
            )}
            {s.layout === "quiz" && (
              <Quiz
                items={s.quiz!}
                step={step}
                interactive={interactive}
                onNext={onNext}
                onRestart={() => onGo?.(18)}
              />
            )}
          </div>
        </>
      )}
      <div className="slide-footer">
        <span className="footer-topic">
          NHÓM 7 <i /> ĐẶC ĐIỂM CỦA TÔN GIÁO Ở VIỆT NAM
        </span>
        <SourceChip ids={s.sourceIds} />
        <span className="page-number">
          {s.id}
          <small>/ 20</small>
        </span>
      </div>
      {s.layout !== "title" && step === 0 && s.points.length > 0 && (
        <button
          className="fragment-start"
          onClick={onNext}
          disabled={!interactive}
        >
          Nhấn → để mở từng ý
        </button>
      )}
    </article>
  );
}
