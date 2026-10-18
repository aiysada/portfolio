export interface NavItem {
  title: string;
  href: string;
  description?: string;
  isBadge?: boolean;
  badgeText?: string;
  isHighlight?: boolean;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    title: "ໜ້າຫຼັກ",
    href: "/",
  },
  {
    title: "ຜົນງານປ້າຍ",
    href: "/portfolio",
  },
  {
    title: "ສິນຄ້າ & ບໍລິການ",
    href: "/services",
  },
  {
    title: "ຄຳນວນລາຄາປ້າຍ",
    href: "/calculator",
    isBadge: true,
    badgeText: "ເຄື່ອງມື",
    isHighlight: true,
  },
  {
    title: "ກ່ຽວກັບພວກເຮົາ",
    href: "/about",
  },
  {
    title: "ຕິດຕໍ່ພວກເຮົາ",
    href: "/contact",
  },
];

export const OWNER_NAV_ITEM: NavItem = {
  title: "ຈັດການລະບົບ (Owner)",
  href: "/owner",
};

export const FOOTER_NAV_GROUPS = [
  {
    title: "ເມນູຫຼັກ",
    items: [
      { title: "ໜ້າຫຼັກ (Home)", href: "/" },
      { title: "ຜົນງານປ້າຍ (Portfolio)", href: "/portfolio" },
      { title: "ສິນຄ້າ & ບໍລິການ (Services)", href: "/services" },
      { title: "ຄຳນວນລາຄາປ້າຍ (Calculator)", href: "/calculator" },
    ],
  },
  {
    title: "ກ່ຽວກັບ ແລະ ຊ່ວຍເຫຼືອ",
    items: [
      { title: "ກ່ຽວກັບ Indie Sign (About)", href: "/about" },
      { title: "ຕິດຕໍ່ພວກເຮົາ (Contact)", href: "/contact" },
      { title: "ລະບົບຈັດການ (Owner Settings)", href: "/owner" },
    ],
  },
];
