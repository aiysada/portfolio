export type ServiceCategory =
  | "vinyl-sticker"
  | "lightbox"
  | "acrylic-letter"
  | "graphic-design"
  | "print-small"
  | "installation";

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  titleLao: string;
  titleEn: string;
  descriptionLao: string;
  startingPrice: number;
  unit: string;
  priceNote?: string;
  features: string[];
  popular?: boolean;
}

export interface ServiceCategoryMeta {
  id: ServiceCategory;
  nameLao: string;
  nameEn: string;
  descriptionLao: string;
  iconName: string;
}

export const SERVICE_CATEGORIES: ServiceCategoryMeta[] = [
  {
    id: "vinyl-sticker",
    nameLao: "ງານພິມໄວນິວ & ສະຕິກເກີ",
    nameEn: "Vinyl & Sticker Printing",
    descriptionLao: "ພິມໄວນິວຄົມຊັດສູງ ທົນແດດ ທົນຝົນ ພ້ອມສະຕິກເກີຕິດລົດ, ຕິດກະຈົກ ແລະ ສະຕິກເກີໄດຄັດ",
    iconName: "Printer",
  },
  {
    id: "lightbox",
    nameLao: "ປ້າຍກ່ອງໄຟ & ປ້າຍໄຟ LED",
    nameEn: "Lightboxes & Illuminated Signs",
    descriptionLao: "ກ່ອງໄຟໂຄງອາລູມີນຽມແຂງແຮງ, ປ້າຍໄຟນີອອນດັດ Neon Flex ແລະ ລະບົບໂມດູນ LED ປະຢັດໄຟ",
    iconName: "Lightbulb",
  },
  {
    id: "acrylic-letter",
    nameLao: "ປ້າຍອະຄຣີລິກ & ຕົວອັກສອນ 3D",
    nameEn: "Acrylic & Dimensional Lettering",
    descriptionLao: "ຕົວອັກສອນໂລຫະສະແຕນເລດ 3 ມິຕິ, ອະຄຣີລິກເລເຊີຄັດ ແລະ ປ້າຍຫ້ອງການມາດຕະຖານ",
    iconName: "Layers",
  },
  {
    id: "graphic-design",
    nameLao: "ອອກແບບໂລໂກ້ & ກຣາຟິກ",
    nameEn: "Logo & Graphic Design",
    descriptionLao: "ບໍລິການອອກແບບໂລໂກ້, ອອກແບບແບບປ້າຍ 2D/3D ແລະ ພາບຈຳລອງກ່ອນຕິດຕັ້ງຕົວຈິງ",
    iconName: "PenTool",
  },
  {
    id: "print-small",
    nameLao: "ນາມບັດ & ງານພິມຂະໜາດນ້ອຍ",
    nameEn: "Business Cards & Small-format Print",
    descriptionLao: "ພິມນາມບັດພຣີມຽມ, ໃບປິວ, ໂບຣຊົວ, ເມນູຮ້ານອາຫານ ແລະ ສະຕິກເກີສິນຄ້າ",
    iconName: "FileSpreadsheet",
  },
  {
    id: "installation",
    nameLao: "ບໍລິການຕິດຕັ້ງ & ໂຄງສ້າງ",
    nameEn: "Sign Installation & Steel Works",
    descriptionLao: "ງານເຊື່ອມໂຄງສ້າງເຫຼັກ, ຕິດແຜ່ນຄອມໂພສິດ, ແລະ ຕິດຕັ້ງປ້າຍອາຄານສູງຢ່າງປອດໄພ",
    iconName: "Wrench",
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  // Vinyl & Stickers (Exact prices required by Prompt: 130,000, 120,000, 250,000)
  {
    id: "srv-vinyl-black-back",
    category: "vinyl-sticker",
    titleLao: "ພິມໄວນິວຫຼັງດຳ (Black-back Vinyl)",
    titleEn: "Black-back Vinyl Banner",
    descriptionLao: "ຜ້າໃບໄວນິວດ້ານຫຼັງສີດຳ ທຶບແສງ 100% ປ້ອງກັນແສງແດດຊອດຜ່ານ ສີຄົມຊັດ ເໝາະສຳລັບປ້າຍກາງແຈ້ງ ແລະ ບິລບອດ.",
    startingPrice: 130000,
    unit: "ຕາຕະລາງແມັດ (m²)",
    priceNote: "ລາຄາເລີ່ມຕົ້ນ / ອາດມີການປ່ຽນແປງຕາມຂະໜາດ ແລະ ວຽກພັບຂອບຕອກຕາໄກ່",
    features: [
      "ທຶບແສງ 100% ບໍ່ໂປ່ງແສງ",
      "ນ້ຳໝຶກ Outdoor ທົນແດດ ທົນຝົນ",
      "ຮອງຮັບງານຂະໜາດໃຫຍ່ທຸກຂະໜາດ",
      "ພັບຂອບຕອກຕາໄກ່ພ້ອມແຂວນ",
    ],
    popular: true,
  },
  {
    id: "srv-vinyl-white-back",
    category: "vinyl-sticker",
    titleLao: "ພິມໄວນິວຫຼັງຂາວ (White-back Vinyl)",
    titleEn: "White-back Vinyl Banner",
    descriptionLao: "ຜ້າໃບໄວນິວມາດຕະຖານ ດ້ານຫຼັງສີຂາວ ເໝາະສຳລັບປ້າຍໂຄສະນາທົ່ວໄປ, ປ້າຍໂປຣໂມຊັ່ນ, ແລະ ປ້າຍງານອີເວັ້ນຕ່າງໆ.",
    startingPrice: 120000,
    unit: "ຕາຕະລາງແມັດ (m²)",
    priceNote: "ລາຄາເລີ່ມຕົ້ນ / ອາດມີການປ່ຽນແປງຕາມປະລິມານ ແລະ ວຽກຕິດຕັ້ງ",
    features: [
      "ເນື້ອຜ້າໃບໜາແໜ້ນ ມາດຕະຖານ",
      "ສີສັນສົດໃສ ຄົມຊັດ",
      "ນ້ຳໜັກເບົາ ຕິດຕັ້ງງ່າຍ",
      "ລາຄາປະຢັດ ຄຸ້ມຄ່າຕໍ່ການລົງທຶນ",
    ],
  },
  {
    id: "srv-sticker-print",
    category: "vinyl-sticker",
    titleLao: "ງານພິມສະຕິກເກີ (Sticker Printing)",
    titleEn: "High-resolution Sticker Print",
    descriptionLao: "ສະຕິກເກີ PVC ຂາວເງົາ/ຂາວດ້ານ, ສະຕິກເກີຊີທຣູ (See-through), ຕິດກະຈົກ ພ້ອມງານເຄືອບຟິມກັນຮອຍ UV.",
    startingPrice: 250000,
    unit: "ຕາຕະລາງແມັດ (m²)",
    priceNote: "ລາຄາເລີ່ມຕົ້ນ / ລວມເຄືອບຟິມກັນຮອຍ (ບໍ່ລວມຄ່າໄດຄັດລະອຽດ)",
    features: [
      "ຄວາມລະອຽດສູງ High-Resolution",
      "ເຄືອບຟິມເງົາ ຫຼື ຟິມດ້ານກັນຮອຍ",
      "ກາວຕິດແໜ້ນ ບໍ່ທຳລາຍພື້ນຜິວ",
      "ຮອງຮັບສະຕິກເກີຕິດກະຈົກ ແລະ ລົດ",
    ],
    popular: true,
  },

  // Lightbox & Illuminated Signs
  {
    id: "srv-led-lightbox",
    category: "lightbox",
    titleLao: "ປ້າຍກ່ອງໄຟ LED (Light Box)",
    titleEn: "LED Aluminum Lightbox",
    descriptionLao: "ປ້າຍກ່ອງໄຟໂຄງອາລູມີນຽມ ຫຼື ເຫຼັກຊຸບສັງກະສີ ໜ້າອະຄຣີລິກ/ຜ້າໃບໂປ່ງແສງ ພ້ອມໄຟ LED Module ກັນນ້ຳ.",
    startingPrice: 650000,
    unit: "ຕາຕະລາງແມັດ (m²)",
    priceNote: "ລາຄາເລີ່ມຕົ້ນຂຶ້ນກັບລະບົບໄຟ ແລະ ຮູບແບບ 1 ໜ້າ ຫຼື 2 ໜ້າ",
    features: [
      "ໂຄງອາລູມີນຽມຄຸນນະພາບສູງ ບໍ່ຂຶ້ນໝ້ຽງ",
      "ໄຟ LED Module ກັນນ້ຳ IP67 ປະຢັດໄຟ",
      "ກະຈາຍແສງສະໝ່ຳສະເໝີ ທົ່ວທຸກມຸມ",
      "ເລືອກໄດ້ທັງແບບ 1 ໜ້າ ແລະ 2 ໜ້າ",
    ],
    popular: true,
  },
  {
    id: "srv-neon-flex",
    category: "lightbox",
    titleLao: "ປ້າຍໄຟນີອອນດັດ (Neon Flex)",
    titleEn: "LED Neon Flex Custom Sign",
    descriptionLao: "ໄຟນີອອນດັດສີສັນຫຼາກຫຼາຍ ດັດເປັນຕົວອັກສອນ ຫຼື ຮູບພາບຕາມແບບ ຕິດເທິງແຜ່ນອະຄຣີລິກໃສ ຕົກແຕ່ງຮ້ານຢ່າງໂດດເດັ່ນ.",
    startingPrice: 350000,
    unit: "ແມັດ (m)",
    priceNote: "ຄິດໄລ່ຕາມຄວາມຍາວເສັ້ນໄຟ ແລະ ຄວາມລະອຽດຂອງການດັດ",
    features: [
      "ສາຍໄຟ Silicone Neon ຄຸນນະພາບສູງ",
      "ສີສັນສະຫວ່າງນຽນ ບໍ່ແຍງຕາ",
      "ປະຢັດໄຟ ແລະ ບໍ່ຮ້ອນ",
      "ຕິດເທິງອະຄຣີລິກໃສຕັດເລເຊີຕາມແບບ",
    ],
  },

  // Acrylic & Dimensional Lettering
  {
    id: "srv-stainless-letter",
    category: "acrylic-letter",
    titleLao: "ປ້າຍຕົວອັກສອນສະແຕນເລດ 3D",
    titleEn: "Stainless Steel 3D Letters",
    descriptionLao: "ຕົວອັກສອນດຶງຂອບ 3 ມິຕິ ໂລຫະສະແຕນເລດເກຣດ 304 ທອງເງົາ (Mirror Gold), ເງິນລາຍເສັ້ນ (Hairline Silver) ຫຼູຫຼາ ທົນທານ.",
    startingPrice: 850000,
    unit: "ຕາຕະລາງແມັດ (m²)",
    priceNote: "ລາຄາເລີ່ມຕົ້ນ / ຂຶ້ນກັບຄວາມສູງຕົວໜັງສື ແລະ ການເຊື່ອງໄຟອອກຫຼັງ",
    features: [
      "ສະແຕນເລດເກຣດ 304 ແທ້ 100% ບໍ່ຂຶ້ນໝ້ຽງ",
      "ເຊື່ອມປະກອບຂອບ 3D ປານີດ",
      "ຮອງຮັບໄຟ LED ອອກຫຼັງ (Halo-lit)",
      "ສ້າງພາບລັກຫຼູຫຼາ ແລະ ເປັນມືອາຊີບ",
    ],
    popular: true,
  },
  {
    id: "srv-acrylic-sign",
    category: "acrylic-letter",
    titleLao: "ປ້າຍອະຄຣີລິກເລເຊີ (Acrylic Sign)",
    titleEn: "Laser-cut Acrylic Signboard",
    descriptionLao: "ແຜ່ນອະຄຣີລິກຕັດເລເຊີຄວາມໜາ 3mm - 10mm ຕິດສະຕິກເກີໄດຄັດ ຫຼື ພິມ UV ຄົມຊັດ ພ້ອມໝຸດລອຍສະແຕນເລດ.",
    startingPrice: 450000,
    unit: "ຕາຕະລາງແມັດ (m²)",
    priceNote: "ລາຄາເລີ່ມຕົ້ນ / ຂຶ້ນກັບຄວາມໜາຂອງອະຄຣີລິກ ແລະ ຂະໜາດ",
    features: [
      "ອະຄຣີລິກເກຣດ A ໃສຄືແກ້ວ ຫຼື ສີຕ່າງໆ",
      "ຕັດຂອບດ້ວຍເລເຊີລຽບນຽນ",
      "ພ້ອມໝຸດລອຍສະແຕນເລດຕິດຝາ",
      "ເໝາະສຳລັບປ້າຍຫ້ອງ, ປ້າຍບໍລິສັດ",
    ],
  },

  // Graphic Design
  {
    id: "srv-graphic-design",
    category: "graphic-design",
    titleLao: "ອອກແບບໂລໂກ້ & ແບບຈຳລອງປ້າຍ",
    titleEn: "Logo & Signage Graphic Design",
    descriptionLao: "ບໍລິການອອກແບບໂລໂກ້ທຸລະກິດໃໝ່, ອອກແບບປ້າຍ 2D/3D Mockup ໃຫ້ເຫັນພາບສະເໝືອນຈິງເທິງອາຄານກ່ອນຜະລິດ.",
    startingPrice: 300000,
    unit: "ຜົນງານ / ໂຄງການ",
    priceNote: "ແກ້ໄຂແບບໄດ້ຕາມເງື່ອນໄຂ / ຟຣີເມື່ອສັ່ງຜະລິດປ້າຍຕາມຍອດຂັ້ນຕ່ຳ",
    features: [
      "ອອກແບບໂດຍທີມງານກຣາຟິກມືອາຊີບ",
      "ສະແດງພາບຈຳລອງ 3D Mockup",
      "ສົ່ງມອບໄຟລ໌ Vector (AI, PDF) ຄົບຊຸດ",
      "ປັບຂະໜາດໃຫ້ເໝາະສົມກັບໜ້າວຽກຕົວຈິງ",
    ],
  },

  // Business Cards & Small Format Print
  {
    id: "srv-business-cards",
    category: "print-small",
    titleLao: "ນາມບັດ & ງານພິມຂະໜາດນ້ອຍ",
    titleEn: "Business Cards & Small Prints",
    descriptionLao: "ພິມນາມບັດເຈ້ຍໜາ 300g ພ້ອມເຄືອບເງົາ/ດ້ານ, ໃບປິວໂຄສະນາ, ໂບຣຊົວ, ແລະ ເມນູຮ້ານອາຫານ.",
    startingPrice: 80000,
    unit: "ກ່ອງ (100 ໃບ)",
    priceNote: "ລາຄາເລີ່ມຕົ້ນຕໍ່ກ່ອງເມື່ອສັ່ງ 3 ກ່ອງຂຶ້ນໄປ",
    features: [
      "ເຈ້ຍ Art Card 300gsm ຄຸນນະພາບສູງ",
      "ພິມ 4 ສີ ຄົມຊັດ 2 ໜ້າ",
      "ເຄືອບ Laminate ດ້ານ ຫຼື ເງົາ",
      "ບັນຈຸກ່ອງພລາສຕິກໃສຢ່າງດີ",
    ],
  },

  // Installation & Steel structure
  {
    id: "srv-installation",
    category: "installation",
    titleLao: "ຕິດຕັ້ງປ້າຍ & ໂຄງສ້າງເຫຼັກ",
    titleEn: "Sign Installation & Steel Works",
    descriptionLao: "ບໍລິການວັດແທກໜ້າວຽກ, ເຊື່ອມໂຄງສ້າງເຫຼັກ, ຕິດແຜ່ນອາລູມີນຽມຄອມໂພສິດ, ແລະ ຕິດຕັ້ງປ້າຍທຸກຂະໜາດ.",
    startingPrice: 200000,
    unit: "ຈຸດ / ຕາຕະລາງແມັດ",
    priceNote: "ປະເມີນລາຄາຕາມລະດັບຄວາມສູງ, ສະຖານທີ່ ແລະ ຄວາມຍາກງ່າຍຂອງໜ້າວຽກ",
    features: [
      "ທີມງານຊ່າງຕິດຕັ້ງມືອາຊີບ",
      "ອຸປະກອນຍຶດແໜ້ນໜາ ມາດຕະຖານຄວາມປອດໄພ",
      "ຮັບປະກັນໂຄງສ້າງ ແລະ ລະບົບໄຟ",
      "ບໍລິການກວດເຊັກ ແລະ ສ້ອມແປງປ້າຍເກົ່າ",
    ],
  },
];
