import { useState } from "react";
import { asset, videoCredit } from "../content/media";
export function IntroVideo() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="intro-video">
      {failed ? (
        <div role="alert">
          Không thể phát video trên trình duyệt này.{" "}
          <a href={asset("media/mo-dau.mp4")} download>
            Tải video MP4 để mở bằng trình phát trên máy
          </a>
          .
        </div>
      ) : (
        <video
          controls
          playsInline
          preload="metadata"
          poster={asset("media/video-poster.webp")}
          onError={() => setFailed(true)}
          aria-label="Video mở đầu: Đa dạng niềm tin, dài 48 giây"
        >
          <source src={asset("media/mo-dau.mp4")} type="video/mp4" />
          <track
            kind="captions"
            src={asset("media/mo-dau.vtt")}
            srcLang="vi"
            label="Tiếng Việt"
            default
          />
        </video>
      )}
      <p className="media-credit">{videoCredit}</p>
    </div>
  );
}
