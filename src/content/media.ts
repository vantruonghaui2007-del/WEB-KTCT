export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  credit: string;
  license: string;
  group?: "ton-giao" | "tin-nguong";
}
const items: [string, string, MediaItem["group"]][] = [
  ["pagoda", "Chùa", "ton-giao"],
  ["church", "Nhà thờ", "ton-giao"],
  ["caodai", "Thánh thất", "ton-giao"],
  ["mosque", "Thánh đường", "ton-giao"],
  ["altar", "Bàn thờ tổ tiên", "tin-nguong"],
  ["communal", "Đình", "tin-nguong"],
  ["temple", "Đền", "tin-nguong"],
  ["protestant", "Nhà thờ Tin Lành", "ton-giao"],
  ["hoahao", "Không gian Phật giáo Hòa Hảo", "ton-giao"],
  ["vesak", "Hoa sen và bánh xe pháp — minh họa chủ đề Vesak", undefined],
];
export const media: MediaItem[] = items.map(([id, alt, group]) => ({
  id,
  alt,
  group,
  src: `media/${id}.webp`,
  credit:
    "Minh họa gốc được tạo cho bài thuyết trình Nhóm 7; không phải ảnh tư liệu.",
  license: "CC0 1.0",
}));
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
export const findMedia = (id: string) => media.find((m) => m.id === id)!;
export const videoCredit =
  "Video minh họa gốc · Nhóm 7 · CC0 1.0 · Nội dung: tài liệu nhóm. Không phải phim tư liệu; không có âm thanh.";
