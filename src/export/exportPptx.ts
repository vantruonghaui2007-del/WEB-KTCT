import type { Slide } from "../content/types";
import { sources } from "../content/sources";
import { asset } from "../content/media";
import { buildPptxModel } from "./pptxModel";
async function imageData(path: string) {
  try {
    const r = await fetch(asset(path));
    if (!r.ok) return undefined;
    const blob = await r.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}
export async function exportPptx(
  deck: Slide[],
  opts?: { now?: Date },
): Promise<Blob> {
  const { default: PptxGenJS } = await import("pptxgenjs");
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Nhóm 7";
  pptx.subject = "Chủ nghĩa xã hội khoa học";
  pptx.title = "Chủ đề 7: Đặc điểm của tôn giáo ở Việt Nam";
  pptx.theme = { headFontFace: "Arial", bodyFontFace: "Arial" };
  const model = buildPptxModel(deck, sources, opts?.now);
  const images = await Promise.all(
    model.map((s) => (s.imagePath ? imageData(s.imagePath) : undefined)),
  );
  for (const [i, m] of model.entries()) {
    const s = pptx.addSlide();
    s.background = { color: "F6F1E7" };
    s.addText("NHÓM 7  /  CHỦ NGHĨA XÃ HỘI KHOA HỌC", {
      x: 0.55,
      y: 0.3,
      w: 11.5,
      h: 0.25,
      fontFace: "Arial",
      fontSize: 10,
      color: "766753",
      charSpacing: 1.5,
    });
    s.addText(m.title, {
      x: 0.55,
      y: 0.85,
      w: 12.2,
      h: 1.15,
      fontFace: "Arial",
      fontSize: m.title.length > 62 ? 27 : 32,
      bold: true,
      color: "9E2A2B",
      margin: 0,
      breakLine: false,
      fit: "shrink",
    });
    const image = images[i];
    const width = image ? 8.2 : 12.1;
    const total = m.bullets.join("").length;
    const fontSize = total > 750 ? 17 : total > 550 ? 19 : 22;
    s.addText(
      m.bullets.map((text) => ({
        text,
        options: { breakLine: true, bullet: { indent: fontSize }, hanging: 4 },
      })),
      {
        x: 0.55,
        y: 2.15,
        w: width,
        h: 3.85,
        fontFace: "Arial",
        fontSize,
        color: "1F1B16",
        margin: 0,
        paraSpaceAfter: 16,
        fit: "shrink",
        valign: "top",
      },
    );
    if (image) {
      s.addImage({ data: image, x: 9.05, y: 2.35, w: 3.7, h: 2.78 });
      s.addText("Minh họa gốc · Nhóm 7 · CC0 1.0\nKhông phải ảnh tư liệu", {
        x: 9.05,
        y: 5.25,
        w: 3.7,
        h: 0.55,
        fontSize: 9,
        color: "6C6053",
        margin: 0,
      });
    }
    s.addText(m.sourceLine, {
      x: 0.55,
      y: 6.25,
      w: 12.2,
      h: 0.65,
      fontSize: 8,
      color: "62594C",
      margin: 0,
      fit: "shrink",
    });
    s.addShape(pptx.ShapeType.line, {
      x: 0.55,
      y: 7.02,
      w: 12.2,
      h: 0,
      line: { color: "B08D57", width: 0.5 },
    });
    s.addText(m.footer, {
      x: 0.55,
      y: 7.12,
      w: 12.2,
      h: 0.18,
      fontSize: 9,
      color: "766753",
      margin: 0,
    });
    s.addNotes(m.notes);
  }
  return (await pptx.write({ outputType: "blob" })) as Blob;
}
export function downloadPptx(
  blob: Blob,
  fileName = "Nhom7_Chu_de_7_Ton_giao_VN.pptx",
) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
