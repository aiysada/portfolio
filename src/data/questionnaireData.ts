import {
  ProductCategory,
  VinylType,
  VinylSurface,
  StickerType,
  CncMaterial,
  PlastwoodThickness,
  MetalFinish,
  BeachFlagType,
  BeachFlagSize,
  BeachFlagBase,
  PrintResolution,
} from "@/types/questionnaire";

export interface ProductOption {
  id: ProductCategory;
  titleLao: string;
  titleEn: string;
  subtitle: string;
  badge?: string;
  recommended?: boolean;
  features: string[];
}

export const PRODUCT_OPTIONS: ProductOption[] = [
  {
    id: "vinyl",
    titleLao: "ພິມໄວນິວ",
    titleEn: "Vinyl Printing",
    subtitle: "ປ້າຍໂຄສະນາ, ປ້າຍໜ້າຮ້ານ, ປ້າຍງານEvent, ທົນແດດທົນຝົນ",
    badge: "ຍອດນິຍົມ",
    recommended: true,
    features: ["ລາຄາປະຢັດ", "ຕິດຕັ້ງງ່າຍ", "ມີທັງຫຼັງຂາວ ແລະ ຫຼັງດຳກັນແສງ"],
  },
  {
    id: "sticker",
    titleLao: "ພິມສະຕິກເກີ",
    titleEn: "Sticker Printing",
    subtitle: "ສະຕິກເກີຕິດສິນຄ້າ, ຕິດແກ້ວ, ຕິດລົດ, ຕົບແຕ່ງພາຍໃນ-ນອກ",
    badge: "ຄົມຊັດສູງ",
    features: ["ມີຜິວເຫຼື້ອມ, ດ້ານ, ໃສ, ມົວ", "ກັນນ້ຳ 100%", "ໄດຄັດໄດ້ຕາມໃຈມັກ"],
  },
  {
    id: "cnc",
    titleLao: "ຕັດຕົວໜັງສືນູນ CNC / Laser",
    titleEn: "CNC & Laser Cutting",
    subtitle: "ຕົວໜັງສືນູນ 3D, ໂລໂກ້ໜ້າຮ້ານ, ພາສວູດ, ອາຄີລິກ, ສະແຕນເລດ",
    badge: "ພຣີມຽມ 3D",
    features: ["ພາສວູດ, ອາຄີລິກ, ໂລຫະ", "ຕັດລະອຽດດ້ວຍລະບົບຄອມພິວເຕີ", "ສາມາດຕິດໄຟ LED ໄດ້"],
  },
  {
    id: "beach_flag",
    titleLao: "ປ້າຍຜ້າທຸງຊາຍຫາດ",
    titleEn: "Beach Flag",
    subtitle: "ທຸງໂຄສະນາຕັ້ງພື້ນ, ໂດດເດັ່ນເຫັນແຕ່ໄກ, ພັບເກັບເຄື່ອນຍ້າຍສະດວກ",
    badge: "ສວຍເດັ່ນ",
    features: ["ຜ້າພິມສອງດ້ານສີສົດ", "ເສົາແຂງແຮງປ້ອງກັນລົມ", "ມີຖານຫຼາຍແບບໃຫ້ເລືອກ"],
  },
];

// Vinyl Types
export interface VinylTypeOption {
  id: VinylType;
  titleLao: string;
  description: string;
  badge?: string;
  recommended?: boolean;
}

export const VINYL_TYPES: VinylTypeOption[] = [
  {
    id: "standard",
    titleLao: "ໄວນິວທຳມະດາ",
    description: "ຜ້າໄຍໄນລອນມາດຕະຖານ ລາຄາປະຢັດ ເໝາະກັບປ້າຍໂຄສະນາທົ່ວໄປ ແລະ ງານ Event",
    badge: "ແນະນຳ",
    recommended: true,
  },
  {
    id: "korean",
    titleLao: "ໄວນິວເກົາຫຼີ",
    description: "ເນື້ອຜ້າໜາພິເສດ ຜິວລຽບລະອຽດ ເສັ້ນໄຍແໜ້ນ ທົນທານຕໍ່ແຮງດຶງ ແລະ ແສງແດດໄດ້ຍາວນານ",
    badge: "ຄຸນນະພາບສູງ",
  },
];

export interface VinylSurfaceOption {
  id: VinylSurface;
  titleLao: string;
  description: string;
  recommended?: boolean;
}

export const VINYL_SURFACES_STANDARD: VinylSurfaceOption[] = [
  {
    id: "white_back",
    titleLao: "ຫຼັງຂາວ (White Back)",
    description: "ດ້ານຫຼັງສີຂາວມາດຕະຖານ ໃຫ້ແສງຜ່ານໄດ້ປານກາງ ສີສັນສົດໃສ ເໝາະກັບປ້າຍໂຄສະນາທົ່ວໄປ",
    recommended: true,
  },
  {
    id: "black_back",
    titleLao: "ຫຼັງດຳ (Black Back)",
    description: "ດ້ານຫຼັງເຄືອບດຳ ກັນແສງຊອດຜ່ານ 100% ຕິດຊ້ອນໂຄງເກົ່າຫຼືແດດສ່ອງດ້ານຫຼັງແລ້ວຮູບບໍ່ມົວ",
  },
  {
    id: "translucent",
    titleLao: "ໂປ່ງແສງ (Translucent)",
    description: "ເນື້ອຜ້າກະຈາຍແສງໄດ້ດີ ເໝາະສຳລັບໃສ່ຕູ້ໄຟ ຫຼື ກ່ອງໄຟ Lightbox ໃຫ້ແສງສະຫວ່າງສະໝໍ່າສະເໝີ",
  },
];

export const VINYL_SURFACES_KOREAN: VinylSurfaceOption[] = [
  {
    id: "white_back",
    titleLao: "ຫຼັງຂາວ (White Back)",
    description: "ເນື້ອເກົາຫຼີພິເສດສີຂາວລຽບນຽນ ສີພິມຍຶດເກາະແໜ້ນ ສົດໃສທົນແດດໄດ້ດີຫຼາຍ",
    recommended: true,
  },
  {
    id: "black_back",
    titleLao: "ຫຼັງດຳ (Black Back)",
    description: "ເນື້ອເກົາຫຼີຫຼັງດຳກັນແສງພຣີມຽມ ຜ້າໜາພິເສດ ບໍ່ເຫັນເງົາໂຄງເຫຼັກດ້ານຫຼັງ 100%",
  },
];

// Sticker Types
export interface StickerTypeOption {
  id: StickerType;
  titleLao: string;
  description: string;
  badge?: string;
  recommended?: boolean;
}

export const STICKER_TYPES: StickerTypeOption[] = [
  {
    id: "glossy_white",
    titleLao: "ຂາວເຫຼື້ອມ (Glossy White)",
    description: "ຜິວເຫຼື້ອມເງົາ ຫຼິ້ນແສງໄດ້ດີ ສີສັນໂດດເດັ່ນ ມີມິຕິ ເໝາະສຳລັບສະຕິກເກີສິນຄ້າ ແລະ ປ້າຍທົ່ວໄປ",
    badge: "ແນະນຳ",
    recommended: true,
  },
  {
    id: "matte_white",
    titleLao: "ຂາວດ້ານ (Matte White)",
    description: "ຜິວດ້ານນຽນ ບໍ່ສະທ້ອນແສງ ໃຫ້ຄວາມຮູ້ສຶກພຣີມຽມ ອ່ານຕົວໜັງສືງ່າຍພາຍໃຕ້ແສງໄຟແຮງ",
  },
  {
    id: "clear",
    titleLao: "ໃສ (Clear Transparent)",
    description: "ເນື້ອໃສມອງເຫັນພື້ນຫຼັງ ເໝາະສຳລັບຕິດກະຈົກຮ້ານ, ຕິດແກ້ວເຄື່ອງດື່ມ ຫຼື ໂລໂກ້ທີ່ຕ້ອງການໂຊພື້ນຜິວ",
  },
  {
    id: "frosted",
    titleLao: "ມົວ (Frosted / Sandblast)",
    description: "ເນື້ອຝ້າຂຸ່ນຄ້າຍແກ້ວກັດຊາຍ ເພີ່ມຄວາມເປັນສ່ວນຕົວ ໃຫ້ຄວາມຫຼູຫຼາ ນິຍົມຕິດຫ້ອງປະຊຸມ ແລະ ຮ້ານກາເຟ",
  },
  {
    id: "reflective",
    titleLao: "ສະທ້ອນແສງ (Reflective)",
    description: "ສະທ້ອນແສງເມື່ອຖືກໄຟລົດ ຫຼື ແສງສ່ອງໃນຕອນກາງຄືນ ເໝາະກັບປ້າຍຈະລາຈອນ, ປ້າຍເຕືອນ, ປ້າຍທາງເຂົ້າ",
  },
  {
    id: "translucent",
    titleLao: "ໂປ່ງແສງ (Backlit Translucent)",
    description: "ເນື້ອກະຈາຍແສງໄດ້ສະໝໍ່າສະເໝີ ເໝາະສຳລັບຕິດໜ້າຕູ້ໄຟ, ປ້າຍກ່ອງໄຟອະຄີລິກ",
  },
  {
    id: "c2",
    titleLao: "C2 (One Way Vision / ຊີທູ)",
    description: "ສະຕິກເກີມອງເຫັນທາງດຽວ ຄົນຂ້າງນອກເຫັນຮູບໂຄສະນາ ຄົນຂ້າງໃນແນມເຫັນອອກໄປຂ້າງນອກໄດ້ ນິຍົມຕິດແກ້ວລົດ ແລະ ໜ້າຮ້ານ",
  },
];

// CNC / Laser Materials
export interface CncMaterialOption {
  id: CncMaterial;
  titleLao: string;
  titleEn: string;
  description: string;
  badge?: string;
  hasSpecialOptions?: boolean;
}

export const CNC_MATERIALS: CncMaterialOption[] = [
  {
    id: "plastwood",
    titleLao: "ພາສວູດ (PVC Foam Board)",
    titleEn: "Plastwood",
    description: "ນ້ຳໜັກເບົາ ກັນນ້ຳ ປວກບໍ່ກິນ ຕັດໄດ້ຄົມຊັດ ເໝາະສຳລັບຕົວໜັງສືນູນ ແລະ ໂລໂກ້ພາຍໃນ-ນອກ",
    badge: "ຍອດນິຍົມ",
    hasSpecialOptions: true,
  },
  {
    id: "acrylic",
    titleLao: "ອາຄີລິກ (Acrylic)",
    titleEn: "Acrylic",
    description: "ຜິວເງົາງາມ ລຽບນຽນ ມີຫຼາຍສີໃຫ້ເລືອກ ໂປ່ງແສງໄດ້ດີ ນິຍົມເຮັດປ້າຍໄຟ ແລະ ຕົວໜັງສືນູນພຣີມຽມ",
    badge: "ພຣີມຽມ",
  },
  {
    id: "steel",
    titleLao: "ເຫຼັກ (Steel / Metal)",
    titleEn: "Steel",
    description: "ແຂງແຮງ ທົນທານສູງ ໃຫ້ຄວາມຮູ້ສຶກແຂງແກ່ນ ມີທັງຜິວເຫຼື້ອມ ແລະ ຜິວແຮລາຍ (Hairline)",
    hasSpecialOptions: true,
  },
  {
    id: "stainless",
    titleLao: "ສະແຕນເລດ (Stainless Steel)",
    titleEn: "Stainless Steel",
    description: "ບໍ່ເປັນຂີ້ໝ້ຽງ 100% ຫຼູຫຼາ ທົນທານຕໍ່ສະພາບອາກາດສູງສຸດ ນິຍົມເຮັດປ້າຍບໍລິສັດໃຫຍ່",
    badge: "ທົນທານສູງສຸດ",
    hasSpecialOptions: true,
  },
  {
    id: "zinc",
    titleLao: "ຊິ້ງ / ສັງກະສີ (Zinc)",
    titleEn: "Zinc Sheet",
    description: "ວັດສະດຸໂລຫະສຳລັບງານພົ່ນສີ ຕັດຂຶ້ນຮູບໂຄງປ້າຍໄດ້ງ່າຍ ລາຄາຍ່ອມເຍົາ",
  },
  {
    id: "metal_sheet",
    titleLao: "ແຜ່ນໂລຫະ (Sheet Metal)",
    titleEn: "Metal Sheet",
    description: "ແຜ່ນໂລຫະລວມ ສຳລັບງານໂຄງສ້າງ ແລະ ງານປ້າຍພິເສດຕາມແບບ",
  },
  {
    id: "plate",
    titleLao: "ແຜ່ນໂຕ່ນ (Composite / Plate)",
    titleEn: "Composite Plate",
    description: "ແຜ່ນອາລູມີນຽມຄອມໂພສິດ ລຽບຕຶງ ນ້ຳໜັກເບົາ ທົນແດດ ບໍ່ເປັນຄື້ນ ນິຍົມຮອງພື້ນປ້າຍ",
  },
  {
    id: "wood",
    titleLao: "ໄມ້ (Natural / Plywood)",
    titleEn: "Wood",
    description: "ວັດສະດຸໄມ້ແທ້ ຫຼື ໄມ້ອັດ ສຳລັບງານສະໄຕລ໌ມິນິມອນ ຮ້ານກາເຟ ໃຫ້ຄວາມຮູ້ສຶກອົບອຸ່ນ ແລະ ທຳມະຊາດ",
  },
];

export const PLASTWOOD_THICKNESSES: { value: PlastwoodThickness; label: string }[] = [
  { value: "5mm", label: "5 mm (ບາງ ເບົາ ເໝາະກັບຕົວໜັງສືຂະໜາດນ້ອຍ)" },
  { value: "10mm", label: "10 mm (ຂະໜາດມາດຕະຖານ ມິຕິກຳລັງດີ)" },
  { value: "15mm", label: "15 mm (ນູນເດັ່ນ ຊັດເຈນ)" },
  { value: "18mm", label: "18 mm (ນູນໜາ ພຣີມຽມ)" },
  { value: "20mm", label: "20 mm (ໜາພິເສດ ມິຕິ 3D ຊັດເຈນສູງ)" },
];

export const METAL_FINISHES: { value: MetalFinish; label: string; desc: string }[] = [
  { value: "glossy", label: "ຜິວເຫຼື້ອມ (Mirror Glossy)", desc: "ສະທ້ອນເງົາຄືແວ່ນ ຫຼູຫຼາ ສະດຸດຕາ" },
  { value: "hairline", label: "ຜິວແຮລາຍ (Hairline / Brushed)", desc: "ລາຍເສັ້ນຂັດລະອຽດ ບໍ່ເປັນຮອຍນິ້ວມື່ອງ່າຍ ທັນສະໄໝ" },
];

// Beach Flag Options
export interface BeachFlagTypeOption {
  id: BeachFlagType;
  titleLao: string;
  description: string;
  badge?: string;
  recommended?: boolean;
}

export const BEACH_FLAG_TYPES: BeachFlagTypeOption[] = [
  {
    id: "wing",
    titleLao: "ທຸງປີກນົກ (Feather / Wing)",
    description: "ຊົງປີກນົກຍອດນິຍົມ ຊາຍທຸງຕຶງຕະຫຼອດເວລາ ເຫັນຂໍ້ຄວາມຊັດເຈນທຸກມຸມມອງ",
    badge: "ແນະນຳ",
    recommended: true,
  },
  {
    id: "teardrop",
    titleLao: "ທຸງຢອດນ້ຳ (Teardrop)",
    description: "ຊົງຢອດນ້ຳໂຄ້ງມົນ ຜ້າຕຶງສວຍງາມ ທົນລົມໄດ້ດີເລີດ ບໍ່ພັບສະບັດ",
  },
  {
    id: "feather",
    titleLao: "ທຸງທີ່ເຫຼື່ອມ / ຊົງສີ່ຫຼ່ຽມ (Square Feather)",
    description: "ຊົງມຸມສີ່ຫຼ່ຽມ ເພີ່ມພື້ນທີ່ສະແດງໂລໂກ້ ແລະ ຂໍ້ຄວາມໄດ້ກວ້າງຂວາງເຕັມຕາ",
  },
];

export interface BeachFlagSizeSpec {
  size: BeachFlagSize;
  clothDimension: string;
  poleHeight: string;
  recommendedFor: string;
}

export const BEACH_FLAG_SIZES: BeachFlagSizeSpec[] = [
  { size: "S", clothDimension: "50 × 200 cm", poleHeight: "280 cm", recommendedFor: "ໜ້າຮ້ານ, ພາຍໃນອາຄານ, ບູດສະແດງສິນຄ້າ" },
  { size: "M", clothDimension: "60 × 240 cm", poleHeight: "340 cm", recommendedFor: "ທາງຍ່າງ, ແຄມຖະໜົນ, ງານEvent ທົ່ວໄປ" },
  { size: "L", clothDimension: "70 × 340 cm", poleHeight: "450 cm", recommendedFor: "ລານກາງແຈ້ງ, ປ້າຍທາງເຂົ້າ, ເຫັນແຕ່ໄກ 100 ແມັດ" },
  { size: "XL", clothDimension: "80 × 410 cm", poleHeight: "550 cm", recommendedFor: "ງານມະຫະກຳກາງແຈ້ງ, ປ້ຳນ້ຳມັນ, ໂດດເດັ່ນສູງສຸດ" },
];

export interface BeachFlagBaseOption {
  id: BeachFlagBase;
  titleLao: string;
  description: string;
  badge?: string;
}

export const BEACH_FLAG_BASES: BeachFlagBaseOption[] = [
  {
    id: "water_tank",
    titleLao: "ຖານຖັງນ້ຳ (Square Water Tank)",
    description: "ຖານພລາສຕິກສີ່ຫຼ່ຽມເຕີມນ້ຳໄດ້ 10-15 ລິດ ແຂງແຮງ ຮັບລົມແຮງໄດ້ດີ",
    badge: "ແນະນຳ",
  },
  {
    id: "water_weight",
    titleLao: "ຖັງນ້ຳເພີ່ມນ້ຳໜັກຖານ (Water Weight Bag)",
    description: "ຖົງຢາງວົງແຫວນເຕີມນ້ຳ ສຳລັບວາງທັບເສີມນ້ຳໜັກເທິງຖານເຫຼັກ",
  },
  {
    id: "x_round",
    titleLao: "ຖານໂຕ X ແບບເຫຼັກກົມ (Cross Base Round Tube)",
    description: "ຂາພັບເຫຼັກທໍ່ກົມ ນ້ຳໜັກເບົາ ພັບເກັບສະດວກ ເໝາະງານພາຍໃນອາຄານ",
  },
  {
    id: "x_flat",
    titleLao: "ຖານໂຕ X ແບບເຫຼັກແປ (Cross Base Flat Plate)",
    description: "ຂາພັບເຫຼັກແຜ່ນແປ ແໜ້ນໜາ ຕັ້ງຮາບກັບພື້ນໄດ້ລຽບນຽນ ບໍ່ສະດຸດຂາ",
  },
];

// Print Resolutions
export interface PrintResolutionOption {
  id: PrintResolution;
  titleLao: string;
  description: string;
  badge?: string;
  recommended?: boolean;
}

export const PRINT_RESOLUTIONS: PrintResolutionOption[] = [
  {
    id: "standard",
    titleLao: "ພິມຈັກທຳມະດາ (Standard Eco)",
    description: "ຄວາມລະອຽດມາດຕະຖານ ລາຄາປະຢັດ ເໝາະກັບປ້າຍຂະໜາດໃຫຍ່ທີ່ແນມເບິ່ງຈາກໄລຍະໄກ 3 ແມັດຂຶ້ນໄປ",
  },
  {
    id: "fine",
    titleLao: "ພິມຈັກລະອຽດ (High Resolution)",
    description: "ຫົວພິມຄວາມລະອຽດສູງ 1440 DPI ເມັດສີລະອຽດ ອ່ານຕົວໜັງສືນ້ອຍໆໄດ້ຊັດເຈນ ເໝາະກັບງານໄລຍະໃກ້",
    badge: "ແນະນຳ",
    recommended: true,
  },
  {
    id: "uv",
    titleLao: "ພິມ UV (UV Outdoor Printing)",
    description: "ລະບົບສີ UV ອົບແຫ້ງດ້ວຍແສງ ທົນແດດທົນຝົນ 3-5 ປີ ສີບໍ່ຈາງ ຜິວນູນສວຍງາມ ແລະ ເປັນມິດຕໍ່ສິ່ງແວດລ້ອມ",
    badge: "ຄຸນນະພາບສູງສຸດ",
  },
];

// Vinyl Finishing
export interface FinishingOption {
  id: string;
  titleLao: string;
  description: string;
}

export const VINYL_FINISHING_OPTIONS: FinishingOption[] = [
  {
    id: "eyelets",
    titleLao: "ເຈາະຕາໄກ່ (Eyelets)",
    description: "ຕອກຮູຕາໄກ່ໂລຫະຮອບຂອບປ້າຍ ສຳລັບຮ້ອຍເຊືອກ ຫຼື ສາຍຮັດເຄເບິລໄທ້ (Cable Tie) ມັດຕິດຕັ້ງໄດ້ສະດວກ",
  },
  {
    id: "margin",
    titleLao: "ຈົ່ງດຶງໂຄງ (Margin For Stretch)",
    description: "ຈົ່ງຂອບຜ້າຂາວໄວ້ປະມານ 5-10 cm ອ້ອມຮອບ ເພື່ອໃຫ້ຊ່າງດຶງຍຶດໃສ່ກັບໂຄງເຫຼັກໄດ້ແໜ້ນຕຶງ",
  },
  {
    id: "hemming",
    titleLao: "ພັບຂອບ (Hemmed Edges)",
    description: "ພັບແຄມຜ້າ ແລະ ຕິດກາວຄວາມຮ້ອນອ້ອມຮອບ ເພີ່ມຄວາມໜາແໜ້ນ ປ້ອງກັນຜ້າຂາດຈາກແຮງລົມ",
  },
];

export const STICKER_FINISHING_OPTIONS: FinishingOption[] = [
  {
    id: "diecut",
    titleLao: "ໄດຄັດ (Kiss-Cut / ໄດຄັດຕາມຮູບຊົງ)",
    description: "ຕັດຕາມຂອບໂລໂກ້ຫຼືຮູບຊົງຕ່າງໆ ແຕ່ຍັງຕິດຢູ່ແຜ່ນຮອງ ລອກອອກມານຳໃຊ້ໄດ້ງ່າຍສະດວກ",
  },
  {
    id: "no_diecut",
    titleLao: "ບໍ່ໄດຄັດ (Square Cut / ຕັດເປັນແຜ່ນສີ່ຫຼ່ຽມ)",
    description: "ຕັດເປັນແຜ່ນມ້ວນ ຫຼື ແຜ່ນສີ່ຫຼ່ຽມຕາມຂະໜາດໃຫຍ່ ເໝາະສຳລັບນຳໄປຕັດຕິດຕັ້ງເອງໜ້າວຽກ",
  },
  {
    id: "through_cut",
    titleLao: "ໄດຄັດຂາດ (Die-Cut Through / ຕັດຂາດເປັນຊິ້ນໆ)",
    description: "ຕັດທະລຸທັງສະຕິກເກີ ແລະ ແຜ່ນຮອງ ເປັນຊິ້ນດ່ຽວໆ ເໝາະສຳລັບແຈກເປັນຂອງແຖມ ຫຼື ຂາຍເປັນຊິ້ນ",
  },
];
