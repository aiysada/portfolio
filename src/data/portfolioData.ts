export type PortfolioCategory =
  | "all"
  | "lighted"
  | "vinyl"
  | "acrylic"
  | "graphic"
  | "print"
  | "other";

export interface PortfolioCategoryMeta {
  id: PortfolioCategory;
  nameLao: string;
  nameEn: string;
}

export interface PortfolioItem {
  id: string;
  category: Exclude<PortfolioCategory, "all">;
  titleLao: string;
  titleEn: string;
  descriptionLao: string;
  image: string;
  altTextLao: string;
  featured: boolean;
  isSample: boolean; // Indicates clearly that this is a sample entry
  dimensions?: string;
  materials?: string;
}

export const PORTFOLIO_CATEGORIES: PortfolioCategoryMeta[] = [
  { id: "all", nameLao: "ທັງໝົດ", nameEn: "All" },
  { id: "lighted", nameLao: "ປ້າຍໄຟ & ກ່ອງໄຟ", nameEn: "Lighted Signs" },
  { id: "vinyl", nameLao: "ໄວນິວ & ສະຕິກເກີ", nameEn: "Vinyl & Stickers" },
  { id: "acrylic", nameLao: "ປ້າຍອະຄຣີລິກ & 3D", nameEn: "Acrylic Signs" },
  { id: "graphic", nameLao: "ໂລໂກ້ & ກຣາຟິກ", nameEn: "Logos & Design" },
  { id: "print", nameLao: "ນາມບັດ & ງານພິມ", nameEn: "Cards & Print" },
  { id: "other", nameLao: "ປ້າຍອື່ນໆ", nameEn: "Other Signage" },
];

/**
 * Portfolio Data Source:
 * You can edit items here or add new photos in /public/images/portfolio/
 */
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "port-lightbox-01",
    category: "lighted",
    titleLao: "ປ້າຍກ່ອງໄຟ LED ອາລູມີນຽມ",
    titleEn: "Aluminum LED Lightbox",
    descriptionLao: "ປ້າຍກ່ອງໄຟ LED ຂອບອາລູມີນຽມ ໜ້າອະຄຣີລິກພິມຢູວີ ກະຈາຍແສງສະໝ່ຳສະເໝີ ປະຢັດໄຟ (ຕົວຢ່າງຮູບແບບປ້າຍ).",
    image: "/images/portfolio/lightbox-sample.svg",
    altTextLao: "ຕົວຢ່າງປ້າຍກ່ອງໄຟ LED ຮ້ານກາເຟ",
    featured: true,
    isSample: true,
    dimensions: "120 × 80 ຊມ",
    materials: "ຂອບອາລູມີນຽມ, ແຜ່ນອະຄຣີລິກ, ໂມດູນ LED IP67",
  },
  {
    id: "port-acrylic-3d-01",
    category: "acrylic",
    titleLao: "ປ້າຍຕົວອັກສອນສະແຕນເລດ 3D ໄຟອອກຫຼັງ",
    titleEn: "Stainless Steel 3D Backlit Letters",
    descriptionLao: "ຕົວອັກສອນໂລຫະສະແຕນເລດ 304 ທອງເງົາ ຕິດຂອບ 3D ພ້ອມໄຟ LED Warm White ອອກຫຼັງ ຫຼູຫຼາ (ຕົວຢ່າງຮູບແບບປ້າຍ).",
    image: "/images/portfolio/acrylic-letters-sample.svg",
    altTextLao: "ຕົວຢ່າງປ້າຍຕົວອັກສອນສະແຕນເລດ 3D ທອງເງົາ",
    featured: true,
    isSample: true,
    dimensions: "240 × 60 ຊມ",
    materials: "ສະແຕນເລດ 304 Mirror Gold, LED Warm White",
  },
  {
    id: "port-vinyl-billboard-01",
    category: "vinyl",
    titleLao: "ປ້າຍບິລບອດໄວນິວຫຼັງດຳກາງແຈ້ງ",
    titleEn: "Outdoor Black-back Vinyl Billboard",
    descriptionLao: "ງານພິມໄວນິວຫຼັງດຳທຶບແສງ 130,000 ກີບ/m² ຂຶ້ນໂຄງສ້າງເຫຼັກກາງແຈ້ງ ທົນແດດ ທົນລົມພາຍຸ (ຕົວຢ່າງຮູບແບບປ້າຍ).",
    image: "/images/portfolio/vinyl-banner-sample.svg",
    altTextLao: "ຕົວຢ່າງປ້າຍໂຄງສ້າງເຫຼັກກາງແຈ້ງ ຜ້າໃບໄວນິວ",
    featured: true,
    isSample: true,
    dimensions: "600 × 300 ຊມ",
    materials: "ຜ້າໃບໄວນິວຫຼັງດຳ 510g, ໂຄງສ້າງເຫຼັກກາວານາຍ",
  },
  {
    id: "port-neon-flex-01",
    category: "lighted",
    titleLao: "ປ້າຍໄຟນີອອນດັດ LED ຮ້ານກາເຟ",
    titleEn: "LED Neon Flex Custom Sign",
    descriptionLao: "ໄຟນີອອນດັດຊິລິໂຄນສີສົ້ມ ແລະ ສີເຫຼືອງ ດັດເປັນໂລໂກ້ ແລະ ຂໍ້ຄວາມເທິງອະຄຣີລິກໃສ (ຕົວຢ່າງຮູບແບບປ້າຍ).",
    image: "/images/portfolio/neon-sign-sample.svg",
    altTextLao: "ຕົວຢ່າງປ້າຍໄຟນີອອນດັດ Neon Flex",
    featured: true,
    isSample: true,
    dimensions: "80 × 50 ຊມ",
    materials: "Silicone Neon Flex 12V, ອະຄຣີລິກໃສ 5mm",
  },
  {
    id: "port-logo-design-01",
    category: "graphic",
    titleLao: "ອອກແບບໂລໂກ້ & ລະບົບເອກະລັກແບຣນ",
    titleEn: "Brand Identity & Logo Design",
    descriptionLao: "ງານອອກແບບໂລໂກ້ Vector ພ້ອມແບບຈຳລອງ 3D Mockup ສຳລັບທຸລະກິດໃໝ່ (ຕົວຢ່າງຮູບແບບງານອອກແບບ).",
    image: "/images/portfolio/logo-branding-sample.svg",
    altTextLao: "ຕົວຢ່າງງານອອກແບບໂລໂກ້ ແລະ ເອກະລັກແບຣນ",
    featured: false,
    isSample: true,
    dimensions: "Vector Graphics (AI/PDF)",
    materials: "Digital Design Files",
  },
  {
    id: "port-business-card-01",
    category: "print",
    titleLao: "ງານພິມນາມບັດພຣີມຽມ & ໃບປິວ",
    titleEn: "Premium Business Cards & Flyers",
    descriptionLao: "ນາມບັດເຈ້ຍໜາ 300g ພິມ 4 ສີ 2 ໜ້າ ເຄືອບຟິມ Soft-touch ດ້ານ ແລະ ເຄືອບເງົາສະເພາະຈຸດ (ຕົວຢ່າງຮູບແບບງານພິມ).",
    image: "/images/portfolio/business-card-sample.svg",
    altTextLao: "ຕົວຢ່າງງານພິມນາມບັດ Indie Sign",
    featured: false,
    isSample: true,
    dimensions: "9 × 5.4 ຊມ (ມາດຕະຖານ)",
    materials: "Art Card 300gsm, Matte Laminate",
  },
];
