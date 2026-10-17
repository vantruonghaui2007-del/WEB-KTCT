import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { asset, videoCredit } from "../content/media";

const watchUrl = "https://www.youtube.com/watch?v=pOSayvlZES4";
const embedUrl =
  "https://www.youtube-nocookie.com/embed/pOSayvlZES4?autoplay=1&rel=0";

export function IntroVideo() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const onlineAgain = () => setOnline(true);
    const offlineNow = () => {
      setOnline(false);
      setStarted(false);
    };
    addEventListener("online", onlineAgain);
    addEventListener("offline", offlineNow);
    return () => {
      removeEventListener("online", onlineAgain);
      removeEventListener("offline", offlineNow);
    };
  }, []);

  return (
    <div className="intro-video">
      <div className="intro-video-frame">
        {started && online ? (
          <iframe
            src={embedUrl}
            title="Chủ tịch nước Lương Cường dự khai mạc Đại lễ Vesak 2025 — VNA"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={asset("media/video-poster.webp")}
              alt="Tư liệu Lễ Phật đản tại Sa Đéc năm 2008; không phải hình ảnh Vesak 2025"
            />
            {online && (
              <button
                className="intro-video-play"
                onClick={() => setStarted(true)}
                aria-label="Phát video Vesak 2025 của VNA"
              >
                <Play /> Phát video của VNA
              </button>
            )}
          </>
        )}
      </div>
      {!online && (
        <p className="intro-video-status" role="status">
          Bạn đang ngoại tuyến. Ảnh tư liệu vẫn có sẵn; video của VNA cần kết
          nối Internet.
        </p>
      )}
      <p className="media-credit">
        {videoCredit}{" "}
        <a href={watchUrl} target="_blank" rel="noreferrer">
          Mở video gốc trên YouTube
        </a>
      </p>
    </div>
  );
}
