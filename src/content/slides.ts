import type { Slide } from "./types";

// One content model feeds the live deck, presenter notes, and PowerPoint export.
export const slides: Slide[] = [
  {
    id: "01",
    section: "mo-dau",
    layout: "title",
    title: "Chủ đề 7: Đặc điểm của tôn giáo ở Việt Nam",
    points: [
      "Môn: Chủ nghĩa xã hội khoa học",
      "Nhóm thực hiện: Nhóm 7",
      "Thông điệp: Nhiều niềm tin cùng hiện diện; đời sống tôn giáo gắn với cộng đồng và dân tộc.",
    ],
    notes:
      "Lời dẫn: Tôn giáo vừa là niềm tin tinh thần, vừa gắn với văn hóa và đời sống cộng đồng. Bài trình bày tập trung vào năm đặc điểm của tôn giáo ở Việt Nam, sau đó liên hệ chính sách và quan hệ dân tộc – tôn giáo. Các con số và ví dụ được ghi kèm nguồn, thời điểm để người nghe hiểu đúng phạm vi của chúng.",
    sourceIds: ["tai-lieu-nhom"],
  },
  {
    id: "02",
    section: "mo-dau",
    layout: "roadmap",
    title: "Hôm nay chúng ta tìm hiểu gì?",
    points: [
      "Thành viên: Nguyễn Văn Vân Trường; Lê Trung Việt; Nguyễn Quang Minh; Phùng Văn Vinh; Trịnh Hải Anh; Trần Quốc Việt; Nguyễn Anh Tuấn; Đỗ Anh Tú; Nguyễn Hữu Vũ; Vũ Đức Trung; Đỗ Minh Tuấn.",
      "Lộ trình: Khái niệm → Năm đặc điểm → Chính sách và liên hệ → Ôn tập.",
    ],
    notes:
      "Phần khái niệm giúp thống nhất cách dùng từ. Trọng tâm của bài là năm đặc điểm, được lần lượt phân tích qua ý nghĩa, nguyên nhân, biểu hiện và ví dụ. Cuối bài, nhóm liên hệ chính sách hiện hành và cùng củng cố kiến thức bằng bảy câu hỏi.",
    sourceIds: ["tai-lieu-nhom"],
  },
  {
    id: "03",
    section: "mo-dau",
    layout: "prompt",
    title: "Tôn giáo hiện diện như thế nào trong đời sống Việt Nam?",
    points: [
      "Bạn nhận ra những không gian, nghi lễ hay sinh hoạt cộng đồng nào qua các hình ảnh?",
      "Gợi ý: chùa, nhà thờ, thánh thất, thánh đường, bàn thờ gia tiên, đình và đền.",
      "Một hình thức tín ngưỡng không đồng nghĩa với việc người thực hành theo một tôn giáo.",
    ],
    notes:
      "Mở video tư liệu Vesak do Thông tấn xã Việt Nam đăng tải nếu có kết nối Internet. Video ghi lại một sự kiện Phật giáo có giao lưu quốc tế, không đại diện cho toàn bộ các tôn giáo ở Việt Nam. Khi mạng không khả dụng, dùng poster ảnh tư liệu đã lưu trong website rồi chuyển sang hoạt động nhận diện hình ảnh. Đời sống tín ngưỡng, chẳng hạn thờ cúng tổ tiên, cần được phân biệt với tư cách tín đồ của một tôn giáo.",
    sourceIds: ["vna-video", "luat-hien-hanh"],
    mediaIds: [
      "pagoda",
      "church",
      "caodai",
      "mosque",
      "altar",
      "communal",
      "temple",
    ],
  },
  {
    id: "04",
    section: "khai-niem",
    layout: "concepts",
    title: "Ba khái niệm cần phân biệt",
    points: [],
    notes:
      "Tín ngưỡng thường gắn với phong tục và nghi lễ của cộng đồng; thờ cúng tổ tiên là một ví dụ quen thuộc. Tôn giáo thường có hệ thống giáo lý, giáo luật, lễ nghi và tổ chức. Tín đồ là người tin, theo một tôn giáo và được tổ chức đó thừa nhận. Tham quan một cơ sở tôn giáo hoặc dự một lễ hội không tự động làm một người trở thành tín đồ. Đây là diễn giải ngắn gọn theo Điều 2 của Luật Tín ngưỡng, tôn giáo hiện hành tại tháng 10/2026.",
    sourceIds: ["luat-hien-hanh"],
    concepts: [
      {
        term: "Tín ngưỡng",
        definition:
          "Là niềm tin được thể hiện qua phong tục, nghi lễ truyền thống, như thờ cúng tổ tiên, nhằm đem lại sự bình an về tinh thần.",
      },
      {
        term: "Tôn giáo",
        definition:
          "Là hệ thống niềm tin có giáo lý, giáo luật, nghi lễ và tổ chức riêng, tạo nên đời sống tinh thần chung cho cộng đồng.",
      },
      {
        term: "Tín đồ",
        definition:
          "Là người tin theo một tôn giáo và được tổ chức tôn giáo đó thừa nhận.",
      },
    ],
  },
  {
    id: "05",
    section: "dac-diem-1",
    layout: "feature-map",
    title: "Năm đặc điểm nổi bật",
    points: [
      "1. Việt Nam là quốc gia có nhiều tôn giáo.",
      "2. Tôn giáo đa dạng, đan xen và có truyền thống chung sống hòa bình.",
      "3. Tín đồ phần lớn là nhân dân lao động, gắn bó với dân tộc.",
      "4. Chức sắc có vị trí quan trọng và ảnh hưởng đối với tín đồ.",
      "5. Các tôn giáo có quan hệ với tổ chức, cá nhân tôn giáo ở nước ngoài.",
    ],
    notes:
      "Năm ý này là khung phân tích của mục 9.2.1 trong đề cương. Chúng liên hệ với nhau: lịch sử giao lưu tạo nên bức tranh nhiều tôn giáo; các cộng đồng cùng sinh hoạt trong xã hội; tín đồ và chức sắc tham gia đời sống chung; một số hoạt động mở rộng ra quốc tế. Đây là những nhận định khái quát, vì vậy không nên suy rộng thành kết luận giống nhau cho mọi cá nhân hay mọi thời kỳ.",
    sourceIds: ["tai-lieu-nhom"],
  },
  {
    id: "06",
    section: "dac-diem-1",
    layout: "points",
    title: "Đặc điểm 1: Việt Nam có nhiều tôn giáo",
    points: [
      "Phật giáo, Công giáo, Tin Lành và Hồi giáo là những tôn giáo du nhập tiêu biểu.",
      "Cao Đài và Phật giáo Hòa Hảo là những tôn giáo hình thành tại Việt Nam.",
      "Mỗi tôn giáo có lịch sử, giáo lý, nghi lễ và tổ chức riêng.",
    ],
    notes:
      "Sự phong phú này hình thành qua nhiều lớp lịch sử: Việt Nam nằm trên những tuyến giao lưu văn hóa trong khu vực; hoạt động giao thương, di cư và tiếp xúc xã hội đưa các tôn giáo từ bên ngoài đến vào những thời kỳ khác nhau. Đồng thời, những điều kiện văn hóa – xã hội trong nước cũng tạo môi trường cho một số tôn giáo nội sinh hình thành. Các cộng đồng hiện diện trong những địa bàn và truyền thống khác nhau. Ý nghĩa của đặc điểm này là cần nhận diện đúng sự khác biệt thay vì xem đời sống tôn giáo như một khối đồng nhất.",
    sourceIds: ["tai-lieu-nhom"],
    mediaIds: ["pagoda", "church", "protestant", "mosque", "caodai", "hoahao"],
  },
  {
    id: "07",
    section: "dac-diem-1",
    layout: "stats",
    title: "Đặc điểm 1: Quy mô qua một mốc thống kê",
    points: [
      "Bức tranh tôn giáo qua số liệu TTXVN/VietnamPlus công bố ngày 15/8/2025:",
      "Các chỉ tiêu mô tả số tôn giáo, số tổ chức, tín đồ và cơ sở thờ tự.",
      "43 là số tổ chức thuộc 16 tôn giáo, không phải 43 tôn giáo.",
    ],
    notes:
      "Bài TTXVN/VietnamPlus ngày 15/8/2025 nêu 43 tổ chức thuộc 16 tôn giáo, trên 27,7 triệu tín đồ, trên 61.000 chức sắc và gần 30.000 cơ sở thờ tự. Bốn số hiện trên màn hình là các chỉ tiêu cùng được dẫn trong bài báo ở cùng mốc công bố. Đây là số liệu được nguồn báo chí dẫn tại thời điểm đăng, không phải kết quả một cuộc điều tra dân số riêng trong tháng 10/2026. Một tôn giáo có thể có nhiều tổ chức; vì thế cần đọc riêng hai chỉ tiêu 16 và 43.",
    sourceIds: ["vnplus-thong-ke-2025"],
    stats: [
      { value: 16, label: "tôn giáo" },
      { value: 43, label: "tổ chức" },
      {
        value: 27.7,
        decimals: 1,
        prefix: "Trên ",
        suffix: " triệu",
        label: "tín đồ",
      },
      { value: 30000, prefix: "Gần ", label: "cơ sở thờ tự" },
    ],
    asOf: "2025-08-15",
  },
  {
    id: "08",
    section: "dac-diem-2",
    layout: "points",
    title: "Đặc điểm 2: Đa dạng, đan xen và giao thoa",
    points: [
      "Đa dạng: Các tôn giáo khác nhau về nguồn gốc, giáo lý, nghi lễ và cách tổ chức.",
      "Đan xen: Nhiều cộng đồng cùng cư trú, làm việc và tham gia đời sống xã hội.",
      "Giao thoa văn hóa: Phong tục địa phương tạo sắc thái Việt cho sinh hoạt tôn giáo.",
    ],
    notes:
      "Tính đa dạng bắt nguồn từ lịch sử hình thành và phát triển không đồng nhất của các tôn giáo. Tính đan xen thể hiện khi tín đồ và cộng đồng khác nhau cùng sống trên một địa bàn, cùng học tập, lao động và tham gia hoạt động xã hội. Giao thoa văn hóa có thể thấy trong cách cộng đồng tổ chức lễ hội, sử dụng tiếng Việt hoặc thực hành phong tục địa phương. Chẳng hạn, một gia đình có thể duy trì việc tưởng nhớ tổ tiên trong khi một số thành viên đồng thời theo Phật giáo; hai thực hành có liên hệ trong đời sống nhưng không vì thế mà đồng nhất về khái niệm hay giáo lý.",
    sourceIds: ["tai-lieu-nhom", "luat-hien-hanh"],
  },
  {
    id: "09",
    section: "dac-diem-2",
    layout: "quote",
    title: "Chung sống hòa bình, tôn trọng khác biệt",
    points: [
      "Các cộng đồng tôn giáo cùng chung sống, tôn trọng niềm tin của nhau.",
      "Tôn trọng niềm tin; Không kỳ thị; Đối thoại khi khác biệt.",
      "Đây là nét khái quát; lịch sử vẫn có bất đồng.",
    ],
    notes:
      "Đề cương dùng cụm “chung sống hòa bình và không có xung đột, chiến tranh tôn giáo” để nêu nét chung của đời sống tôn giáo ở Việt Nam. Nên trình bày đây là một khái quát, không phải kết luận rằng lịch sử không có bất đồng, va chạm hay vấn đề xã hội liên quan đến tôn giáo. Trong thực tế, các cộng đồng có thể khác nhau về quan niệm và lợi ích; tôn trọng quyền tự do tín ngưỡng, đối thoại và giải quyết bất đồng theo pháp luật giúp duy trì hòa hợp.",
    sourceIds: ["tai-lieu-nhom", "luat-hien-hanh"],
  },
  {
    id: "10",
    section: "dac-diem-3",
    layout: "points",
    title: "Đặc điểm 3: Tín đồ gắn bó với đời sống dân tộc",
    points: [
      "Tín đồ có nhiều nghề nghiệp, hoàn cảnh sống khác nhau; phần lớn thuộc nhân dân lao động.",
      "Đề cương nhấn mạnh lòng yêu nước và tinh thần dân tộc của tín đồ.",
      "“Tốt đời, đẹp đạo” gắn thực hành niềm tin với trách nhiệm đối với cộng đồng.",
    ],
    notes:
      "Đặc điểm này mô tả thành phần xã hội và mối gắn bó của tín đồ với đời sống đất nước. Phần lớn tín đồ sinh sống bằng lao động trong nhiều ngành nghề; bên cạnh đó, tín đồ cũng có những thành phần xã hội khác. Đề cương nêu lòng yêu nước, tinh thần dân tộc và ước vọng sống “tốt đời, đẹp đạo” như những nét khái quát. Không nên biến nhận định này thành khuôn mẫu cho mọi cá nhân. Ý nghĩa thực tiễn là tạo điều kiện để người có niềm tin tham gia bình đẳng vào hoạt động xã hội và trách nhiệm công dân.",
    sourceIds: ["tai-lieu-nhom"],
  },
  {
    id: "11",
    section: "dac-diem-3",
    layout: "points",
    title: "Từ niềm tin đến đóng góp cộng đồng",
    points: [
      "Hoạt động xã hội gồm cứu trợ thiên tai, học bổng, chăm sóc người yếu thế và khám chữa bệnh.",
      "VNA dẫn báo cáo năm 2025 của Giáo hội Phật giáo Việt Nam: chi hơn 2.161 tỷ đồng cho từ thiện, an sinh.",
      "Đây là ví dụ của Phật giáo; giá trị nhân ái trở thành nguồn lực tương trợ cộng đồng.",
    ],
    notes:
      "VietnamPlus/TTXVN ngày 20/1/2026 dẫn báo cáo tổng kết hoạt động Phật sự năm 2025 của Giáo hội Phật giáo Việt Nam: hệ thống Ban Từ thiện xã hội và các đơn vị địa phương đã chi hơn 2.161 tỷ đồng cho từ thiện, an sinh xã hội. Bản tin nêu các hoạt động như cứu trợ khẩn cấp, cấp học bổng, xây nhà, khám bệnh và phát thuốc. Đây là khoản chi được báo cáo cho hoạt động của Giáo hội Phật giáo trong năm 2025, không phải con số đại diện cho mọi tôn giáo hay mọi tín đồ. Dẫn chứng cho thấy tổ chức tôn giáo và tín đồ có thể tham gia hỗ trợ xã hội; quyền tự do tôn giáo vẫn được bảo đảm độc lập với mức đóng góp của từng người.",
    sourceIds: ["vnplus-phat-giao-tu-thien-2025", "luat-hien-hanh"],
  },
  {
    id: "12",
    section: "dac-diem-4",
    layout: "concepts",
    title: "Đặc điểm 4: Phân biệt ba vai trò trong tổ chức",
    points: [],
    notes:
      "Điều 2 Luật Tín ngưỡng, tôn giáo hiện hành phân biệt các khái niệm này theo phẩm vị, chức vụ và nếp sống tu hành. Có thể hiểu ngắn gọn: chức sắc gắn với phẩm vị; chức việc gắn với chức vụ; nhà tu hành gắn với việc thường xuyên thực hành nếp sống riêng theo giáo lý, giáo luật. Một người có thể đồng thời đảm nhiệm hơn một vai trò trong một số truyền thống, nhưng ba thuật ngữ không đồng nghĩa. Không nên gọi mọi chức sắc của mọi tôn giáo là “tu sĩ”; chẳng hạn, khái niệm xuất gia phù hợp với một số truyền thống tu hành nhưng không áp dụng giống nhau cho mọi tôn giáo.",
    sourceIds: ["luat-hien-hanh"],
    concepts: [
      {
        term: "Chức sắc",
        definition:
          "Là tín đồ được phong phẩm hoặc suy cử để giữ một phẩm vị trong tổ chức tôn giáo.",
      },
      {
        term: "Chức việc",
        definition:
          "Là người được bổ nhiệm, bầu cử hoặc suy cử để đảm nhiệm một chức vụ trong tổ chức.",
      },
      {
        term: "Nhà tu hành",
        definition:
          "Là tín đồ thường xuyên thực hành nếp sống riêng theo giáo lý, giáo luật của tôn giáo mình.",
      },
    ],
  },
  {
    id: "13",
    section: "dac-diem-4",
    layout: "points",
    title: "Vì sao chức sắc có ảnh hưởng với tín đồ?",
    points: [
      "Chức sắc hướng dẫn giáo lý, nghi lễ và chăm lo đời sống tinh thần.",
      "Uy tín giúp kết nối tín đồ, tổ chức sinh hoạt và vận động cộng đồng.",
      "Vai trò, thẩm quyền cụ thể khác nhau theo cơ cấu của từng tôn giáo.",
    ],
    notes:
      "Đề cương mô tả chức sắc truyền bá và thực hành giáo lý, giáo luật, lễ nghi; quản lý tổ chức theo nhiệm vụ được giao; đồng thời chăm lo đời sống tâm linh của tín đồ. Vì có vị trí trong giáo hội và được tín đồ tín nhiệm, chức sắc có thể kết nối thành viên, hướng dẫn sinh hoạt và vận động tham gia hoạt động cộng đồng. Ví dụ, một nhà sư có thể chủ trì nghi lễ Phật giáo và hướng dẫn Phật tử tại chùa; đó là vai trò trong truyền thống Phật giáo, không phải hình mẫu cho mọi chức sắc. Thẩm quyền thực tế tùy thuộc hiến chương và cơ cấu từng tổ chức.",
    sourceIds: ["tai-lieu-nhom", "luat-hien-hanh"],
  },
  {
    id: "14",
    section: "dac-diem-5",
    layout: "points",
    title: "Đặc điểm 5: Quan hệ với tổ chức tôn giáo quốc tế",
    points: [
      "Tôn giáo du nhập và tôn giáo hình thành trong nước đều có liên hệ ở nước ngoài.",
      "Giao lưu có thể gồm hội nghị, trao đổi học thuật, đào tạo và hoạt động nghi lễ.",
      "Hợp tác mở rộng hiểu biết; hoạt động cần tôn trọng pháp luật và chủ quyền quốc gia.",
    ],
    notes:
      "Đề cương nêu các tôn giáo ở Việt Nam, kể cả tôn giáo nội sinh, đều có quan hệ với tổ chức hoặc cá nhân tôn giáo ở nước ngoài hay tổ chức quốc tế. Những quan hệ ấy có thể hình thành qua giao lưu, hội nghị, nghiên cứu, đào tạo, thăm viếng hoặc cùng tổ chức sự kiện. Mức độ và hình thức không giống nhau ở mọi tôn giáo. Giao lưu giúp chia sẻ kinh nghiệm và tăng hiểu biết giữa các cộng đồng; việc tổ chức hoạt động phải đồng thời tôn trọng quyền tự do tôn giáo, quy định pháp luật và độc lập, chủ quyền quốc gia.",
    sourceIds: ["tai-lieu-nhom", "luat-hien-hanh"],
  },
  {
    id: "15",
    section: "dac-diem-5",
    layout: "stats",
    title: "Minh chứng giao lưu: Đại lễ Vesak 2025",
    points: [
      "Đại lễ Vesak Liên Hợp Quốc diễn ra tại TP. Hồ Chí Minh từ ngày 6 đến 8/5/2025.",
      "Hơn 2.700 đại biểu tham dự; đại biểu quốc tế đến từ 85 quốc gia và vùng lãnh thổ.",
      "Đây là ví dụ về giao lưu Phật giáo, không đại diện cho mọi tôn giáo.",
    ],
    notes:
      "TTXVN/VietnamPlus đưa tin ngày 6/5/2025 rằng Đại lễ Vesak Liên Hợp Quốc diễn ra từ ngày 6 đến 8/5 tại TP. Hồ Chí Minh, với chủ đề về đoàn kết, bao dung, nhân phẩm con người, hòa bình và phát triển bền vững. Bản tin và phóng sự ảnh của VNA ghi nhận đại biểu từ 85 quốc gia, vùng lãnh thổ; báo chí dẫn quy mô hơn 2.700 đại biểu tham dự. Đây là ví dụ cụ thể cho hoạt động giao lưu quốc tế của Phật giáo Việt Nam. Không dùng quy mô một sự kiện để suy ra mọi tôn giáo có quan hệ quốc tế giống nhau. Ảnh hiển thị là tư liệu Lễ Phật đản tại Sa Đéc năm 2008, không phải ảnh Vesak 2025; video ở slide mở đầu liên kết tới bản tin khai mạc Vesak 2025 của VNA.",
    sourceIds: ["vnplus-vesak-2025", "vna-vesak-photos"],
    stats: [
      { value: 2700, prefix: "Hơn ", label: "đại biểu" },
      { value: 85, label: "quốc gia và vùng lãnh thổ" },
    ],
    asOf: "2025-05-06",
    mediaIds: ["vesak"],
  },
  {
    id: "16",
    section: "chinh-sach",
    layout: "points",
    title: "Chính sách: bảo đảm quyền, giữ bình đẳng",
    points: [
      "Mỗi người có quyền theo hoặc không theo tôn giáo và được sinh hoạt theo pháp luật.",
      "Các tôn giáo bình đẳng trước pháp luật; không kỳ thị, ép buộc hay cản trở vì niềm tin.",
      "Bảo vệ hoạt động hợp pháp và xử lý hành vi vi phạm cụ thể, không quy chụp cộng đồng.",
    ],
    notes:
      "Chính sách được trình bày cần đặt quyền tự do tín ngưỡng, tôn giáo ở trung tâm: mỗi người được lựa chọn theo, không theo, đổi hoặc từ bỏ tôn giáo; các tổ chức hoạt động trong khuôn khổ pháp luật và bình đẳng trước pháp luật. Nhà nước nghiêm cấm phân biệt đối xử, ép buộc và lợi dụng tín ngưỡng, tôn giáo để vi phạm pháp luật. Khi liên hệ một vụ việc, cần phân biệt hành vi cụ thể của cá nhân với quyền và niềm tin hợp pháp của cả cộng đồng. Tại tháng 10/2026, căn cứ là Luật 02/2016/QH14 theo Văn bản hợp nhất 74/VBHN-VPQH năm 2025.",
    sourceIds: ["luat-hien-hanh", "tai-lieu-nhom"],
  },
  {
    id: "17",
    section: "chinh-sach",
    layout: "points",
    title: "Cần đọc đúng mốc hiệu lực pháp luật",
    points: [
      "Tháng 10/2026: Luật 02/2016/QH14, theo nội dung hợp nhất năm 2025, đang có hiệu lực.",
      "Luật Tín ngưỡng, tôn giáo số 07/2026/QH16 được ban hành ngày 23/4/2026.",
      "Luật mới có hiệu lực từ 1/1/2027; ban hành chưa đồng nghĩa đã áp dụng.",
    ],
    notes:
      "Công báo Chính phủ ghi Luật số 07/2026/QH16 được ban hành ngày 23/4/2026 và có hiệu lực từ 1/1/2027. Vì vậy, với thời điểm trình bày tháng 10/2026, căn cứ hiện hành là Luật số 02/2016/QH14 theo Văn bản hợp nhất số 74/VBHN-VPQH ban hành ngày 15/8/2025, phản ánh các sửa đổi có hiệu lực đến thời điểm đó. Sau ngày 1/1/2027, người trình bày cần cập nhật trích dẫn và số điều theo luật mới. Đồng hồ đếm ngược trên màn hình dùng giờ Việt Nam và tự đổi trạng thái theo ngày mở trang.",
    sourceIds: ["luat-hien-hanh", "luat-2026", "bdttg-luat-2026"],
  },
  {
    id: "18",
    section: "chinh-sach",
    layout: "points",
    title: "Liên hệ: dân tộc, tôn giáo và đoàn kết",
    points: [
      "Nhiều dân tộc và tôn giáo cùng sinh sống trong cộng đồng quốc gia thống nhất.",
      "Tín ngưỡng, phong tục và tôn giáo góp phần tạo nên đời sống văn hóa của cộng đồng.",
      "Tôn trọng quyền và khác biệt giúp củng cố đoàn kết mà không đồng nhất mọi người.",
    ],
    notes:
      "Quan hệ dân tộc – tôn giáo cần được nhìn nhận cụ thể: một người thuộc về cộng đồng dân tộc, gia đình và quốc gia, đồng thời có thể có hoặc không có niềm tin tôn giáo. Không mặc định tất cả thành viên một dân tộc cùng theo một tôn giáo. Tín ngưỡng và phong tục truyền thống góp phần định hình đời sống cộng đồng; các tôn giáo cũng tạo mạng lưới sinh hoạt và tương trợ. Tôn trọng quyền tự do tín ngưỡng, bình đẳng giữa các dân tộc và đối thoại giúp bảo vệ đoàn kết. Những hành vi vi phạm cần được xem xét dựa trên chứng cứ và quy định pháp luật, không suy diễn từ bản sắc dân tộc hay tôn giáo.",
    sourceIds: ["tai-lieu-nhom", "luat-hien-hanh"],
  },
  {
    id: "19",
    section: "on-tap",
    layout: "quiz",
    title: "Cùng nhau củng cố kiến thức",
    points: [],
    notes:
      "Tổ chức trò chơi theo từng câu: chọn một phương án rồi xác nhận để hiện phản hồi và giải thích. Câu 1 phân biệt số tôn giáo với số tổ chức ở mốc TTXVN 15/8/2025; Câu 2 nhận diện đặc điểm thứ nhất; Câu 3 nhắc lại khái quát của đề cương nhưng không tuyệt đối hóa lịch sử; Câu 4 nêu thành phần xã hội theo nhận định khái quát; Câu 5 phân biệt vai trò của chức sắc; Câu 6 bao quát quan hệ quốc tế của cả tôn giáo du nhập và nội sinh; Câu 7 phân biệt quyền tự do tôn giáo với hành vi lợi dụng quyền để vi phạm pháp luật.",
    sourceIds: ["tai-lieu-nhom", "vnplus-thong-ke-2025", "luat-hien-hanh"],
    quiz: [
      {
        question:
          "Theo nội dung thuyết trình, hiện nay Việt Nam có bao nhiêu tôn giáo được Nhà nước chính thức công nhận và cấp phép hoạt động?",
        options: [
          { key: "A", text: "12 tôn giáo" },
          { key: "B", text: "16 tôn giáo" },
          { key: "C", text: "20 tôn giáo" },
          { key: "D", text: "43 tôn giáo" },
        ],
        answer: "B",
        explanation:
          "Mốc TTXVN ngày 15/8/2025 nêu 16 tôn giáo và 43 tổ chức thuộc các tôn giáo đó; hai chỉ tiêu này không đồng nghĩa.",
      },
      {
        question: "Việt Nam có đặc điểm gì nổi bật về số lượng tôn giáo?",
        options: [
          { key: "A", text: "Chỉ có một tôn giáo chính thức." },
          { key: "B", text: "Là quốc gia có nhiều tôn giáo." },
          { key: "C", text: "Chỉ có các tôn giáo du nhập từ nước ngoài." },
          {
            key: "D",
            text: "Không có các tổ chức tôn giáo được công nhận.",
          },
        ],
        answer: "B",
        explanation:
          "Việt Nam có cả tôn giáo du nhập và các tôn giáo hình thành trong nước.",
      },
      {
        question:
          "Các tôn giáo ở Việt Nam có mối quan hệ với nhau như thế nào?",
        options: [
          {
            key: "A",
            text: "Thường xuyên xảy ra xung đột và chiến tranh tôn giáo.",
          },
          {
            key: "B",
            text: "Mỗi tôn giáo hoạt động tách biệt hoàn toàn với xã hội.",
          },
          {
            key: "C",
            text: "Đa dạng, đan xen, chung sống hòa bình và không có xung đột, chiến tranh tôn giáo.",
          },
          { key: "D", text: "Chỉ có thể cùng tồn tại khi có chung nguồn gốc." },
        ],
        answer: "C",
        explanation:
          "Đây là khái quát của đề cương về truyền thống chung sống hòa bình, không có nghĩa mọi giai đoạn lịch sử đều không xuất hiện bất đồng.",
      },
      {
        question:
          "Tín đồ các tôn giáo ở Việt Nam phần lớn thuộc thành phần nào?",
        options: [
          {
            key: "A",
            text: "Nhân dân lao động, có lòng yêu nước và tinh thần dân tộc.",
          },
          {
            key: "B",
            text: "Chỉ gồm những người làm công tác tôn giáo chuyên nghiệp.",
          },
          { key: "C", text: "Chủ yếu là người nước ngoài." },
          {
            key: "D",
            text: "Chỉ gồm những người hoạt động trong lĩnh vực chính trị.",
          },
        ],
        answer: "A",
        explanation:
          "Đề cương nêu đây là đặc điểm chung; tín đồ có nhiều nghề nghiệp và hoàn cảnh khác nhau.",
      },
      {
        question: "Hàng ngũ chức sắc các tôn giáo có vai trò gì?",
        options: [
          { key: "A", text: "Chỉ tham gia các hoạt động kinh tế." },
          { key: "B", text: "Không có ảnh hưởng đến đời sống tín đồ." },
          { key: "C", text: "Chỉ thực hiện các hoạt động từ thiện xã hội." },
          {
            key: "D",
            text: "Có vai trò, vị trí quan trọng trong giáo hội và có uy tín, ảnh hưởng với tín đồ.",
          },
        ],
        answer: "D",
        explanation:
          "Chức sắc hướng dẫn sinh hoạt tôn giáo và có ảnh hưởng với tín đồ; nhiệm vụ cụ thể tùy từng tổ chức.",
      },
      {
        question: "Các tôn giáo ở Việt Nam có đặc điểm gì về quan hệ quốc tế?",
        options: [
          {
            key: "A",
            text: "Chỉ các tôn giáo du nhập từ nước ngoài mới có quan hệ quốc tế.",
          },
          {
            key: "B",
            text: "Các tôn giáo ở Việt Nam đều có quan hệ với các tổ chức, cá nhân tôn giáo ở nước ngoài.",
          },
          {
            key: "C",
            text: "Các tôn giáo ở Việt Nam không có quan hệ với tổ chức tôn giáo quốc tế.",
          },
          {
            key: "D",
            text: "Chỉ các tôn giáo có đông tín đồ mới được phép giao lưu quốc tế.",
          },
        ],
        answer: "B",
        explanation:
          "Đặc điểm khái quát bao gồm cả tôn giáo du nhập và nội sinh; hình thức, mức độ liên hệ không giống nhau.",
      },
      {
        question:
          "Nhà nước Việt Nam kiên quyết đấu tranh với hành vi nào sau đây trong vấn đề tôn giáo?",
        options: [
          { key: "A", text: "Hoạt động từ thiện của các giáo hội." },
          { key: "B", text: "Việc chức sắc giảng dạy giáo lý cho tín đồ." },
          {
            key: "C",
            text: "Lợi dụng tự do tôn giáo để can thiệp nội bộ, chống phá đất nước.",
          },
          {
            key: "D",
            text: "Giao lưu quốc tế của các tổ chức tôn giáo.",
          },
        ],
        answer: "C",
        explanation:
          "Cần bảo đảm quyền tự do tôn giáo và xử lý hành vi vi phạm pháp luật cụ thể, không quy chụp cộng đồng.",
      },
    ],
  },
  {
    id: "20",
    section: "on-tap",
    layout: "closing",
    title: "Kết luận và cảm ơn",
    points: [
      "Năm đặc điểm cho thấy đời sống tôn giáo Việt Nam phong phú, gắn với cộng đồng và có liên hệ quốc tế.",
      "Tôn trọng quyền và khác biệt giúp phát huy đóng góp xã hội, củng cố đoàn kết.",
      "Xin cảm ơn thầy/cô và các bạn đã theo dõi.",
    ],
    notes:
      "Lời kết: Năm đặc điểm giúp chúng ta hiểu đời sống tôn giáo Việt Nam trong lịch sử và hiện tại. Sự đa dạng đặt ra yêu cầu bảo đảm bình đẳng, tôn trọng quyền tự do tín ngưỡng và tạo điều kiện để các cộng đồng tham gia đời sống xã hội. Đoàn kết được củng cố khi mọi người cùng đóng góp mà vẫn tôn trọng những khác biệt về niềm tin. Mời lớp trao đổi câu hỏi hoặc chia sẻ một ví dụ về hoạt động cộng đồng mà các bạn biết.",
    sourceIds: ["tai-lieu-nhom", "luat-hien-hanh"],
  },
];
