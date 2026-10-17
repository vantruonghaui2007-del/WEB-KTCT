import type { Source } from "./types";

export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  credit: string;
  license: string;
  sourceUrl: string;
  group?: "ton-giao" | "tin-nguong";
}

type MediaRecord = Omit<MediaItem, "src">;
const records: MediaRecord[] = [
  {
    id: "pagoda",
    alt: "Chùa Một Cột ở Hà Nội",
    credit: "Jean-Etienne Minh-Duy Poirrier",
    license: "CC BY-SA 2.0; ảnh được thu nhỏ và chuyển sang WebP",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:One_Pillar_Pagoda.jpg",
    group: "ton-giao",
  },
  {
    id: "church",
    alt: "Nhà thờ Đức Bà Sài Gòn",
    credit: "Amore Mio",
    license: "CC BY-SA 4.0; ảnh được thu nhỏ và chuyển sang WebP",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Notre_Dame_Cathedral_in_Ho_Chi_Minh_City.JPG",
    group: "ton-giao",
  },
  {
    id: "caodai",
    alt: "Tòa Thánh Cao Đài Tây Ninh",
    credit: "Dominik Tefert",
    license: "Public domain; ảnh được thu nhỏ và chuyển sang WebP",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cao_Dai_Temple_Tay_Ninh.JPG",
    group: "ton-giao",
  },
  {
    id: "mosque",
    alt: "Thánh đường Hồi giáo Jamia Al Muslimin ở Thành phố Hồ Chí Minh",
    credit: "MOHAMEDFAAZIL",
    license: "CC0 1.0; ảnh được thu nhỏ và chuyển sang WebP",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Saigon-central-mosque.jpg",
    group: "ton-giao",
  },
  {
    id: "altar",
    alt: "Bàn thờ gia tiên trong một gia đình Việt Nam",
    credit: "Donald Trung",
    license: "CC BY-SA 4.0; ảnh được thu nhỏ và chuyển sang WebP",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Personal_in-home_altar_for_deceased_family_members_in_Viet_Nam.jpg",
    group: "tin-nguong",
  },
  {
    id: "communal",
    alt: "Không gian bên trong đình Quan Lạn",
    credit: "Phó Nháy",
    license: "Public domain; ảnh được thu nhỏ và chuyển sang WebP",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Quan_L%E1%BA%A1n_communal_house_interior.JPG",
    group: "tin-nguong",
  },
  {
    id: "temple",
    alt: "Đền Ngọc Sơn ở Hà Nội",
    credit: "Jakub Hałun",
    license: "CC BY 4.0; ảnh được thu nhỏ và chuyển sang WebP",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Temple_of_the_Jade_Mountain,_Hanoi,_Vietnam,_20240204_1311_5751.jpg",
    group: "tin-nguong",
  },
  {
    id: "protestant",
    alt: "Nhà thờ Tin Lành tại Hội An",
    credit: "Steffen Schmitz (Carschten)",
    license: "CC BY-SA 4.0; ảnh được thu nhỏ và chuyển sang WebP",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:H%E1%BB%99i_An,_Evangelical_Church,_2020-01_CN-04.jpg",
    group: "ton-giao",
  },
  {
    id: "hoahao",
    alt: "An Hòa tự, cơ sở Phật giáo Hòa Hảo ở An Giang",
    credit: "Mrfly911",
    license: "CC0 1.0; ảnh được thu nhỏ và chuyển sang WebP",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:An_H%C3%B2a_t%E1%BB%B1_Ph%E1%BA%ADt_gi%C3%A1o_H%C3%B2a_H%E1%BA%A3o.jpg",
    group: "ton-giao",
  },
  {
    id: "vesak",
    alt: "Lễ Phật đản tại Sa Đéc năm 2008, tư liệu về sinh hoạt Phật giáo; không phải ảnh Vesak 2025",
    credit: "Petertan",
    license: "CC BY-SA 3.0; ảnh được thu nhỏ và chuyển sang WebP",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Dai_le_vesak_sa_dec.JPG",
  },
  {
    id: "monk",
    alt: "Nhà sư tham gia một buổi lễ Phật giáo ở Huế",
    credit: "mrbold_flickr",
    license: "CC BY 2.0; ảnh được thu nhỏ và chuyển sang WebP",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Buddhist_Monk_Service_Hue_Vietnam.jpeg",
    group: "ton-giao",
  },
];

export const media: MediaItem[] = records.map((record) => ({
  ...record,
  src: `media/${record.id}.webp`,
}));
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
export const findMedia = (id: string) => media.find((m) => m.id === id)!;

export const mediaSources: Source[] = media.map((item) => ({
  id: `image-${item.id}`,
  label: `Ảnh: ${item.alt} · ${item.credit} · ${item.license}`,
  url: item.sourceUrl,
}));

export const videoCredit =
  "Video: Chủ tịch nước Lương Cường dự khai mạc Đại lễ Phật đản Liên Hợp Quốc – Vesak 2025 · VNA · phát qua YouTube; cần kết nối Internet.";
