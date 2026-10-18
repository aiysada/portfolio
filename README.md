# Indie Sign — ເວັບໄຊທຸລະກິດອອກແບບ ແລະ ຜະລິດປ້າຍຄົບວົງຈອນ

> **"ຄົບທຸກວຽກປ້າຍ ອອກແບບ ຜະລິດ ແລະຕິດຕັ້ງ"**  
> *All-in-one Signage Work: Design, Production, and Installation*

ຍິນດີຕ້ອນຮັບສູ່ລະບົບ **Indie Sign** ເວັບໄຊທຸລະກິດປ້າຍໂຄສະນາຄົບວົງຈອນ (Client-side Web Application) ທີ່ອອກແບບມາສະເພາະເພື່ອຕອບໂຈດການນຳສະເໜີຜົນງານ, ການຄຳນວນລາຄາປ້າຍ, ແລະ ການອອກເອກະສານທາງການ.

---

## 🌐 ເສັ້ນທາງໜ້າເວັບຫຼັກ (Application Routes)

- `/` — **ໜ້າຫຼັກ (Home)**: Hero banner, ສະຫຼຸບ 6 ໝວດໝູ່ບໍລິການ, 4 ຜົນງານເດັ່ນ, ເຫດຜົນທີ່ຄວນເລືອກ Indie Sign, ແລະ ປຸ່ມ CTA.
- `/portfolio` — **ຄັງຜົນງານປ້າຍ (Portfolio)**: ແຍກຕາມໝວດໝູ່ (ປ້າຍໄຟ, ໄວນິວ, ອະຄຣີລິກ 3D, ໂລໂກ້, ນາມບັດ, ອື່ນໆ) ພ້ອມລະບົບ Lightbox Preview ທີ່ຮອງຮັບຄີບອດ.
- `/services` — **ສິນຄ້າ & ບໍລິການ (Services)**: ແຄັດຕາລັອກບໍລິການພ້ອມລາຄາເລີ່ມຕົ້ນມາດຕະຖານ (ໄວນິວຫຼັງດຳ 130,000 ກີບ/m², ໄວນິວຫຼັງຂາວ 120,000 ກີບ/m², ສະຕິກເກີ 250,000 ກີບ/m²).
- `/calculator` — **ລະບົບຄຳນວນລາຄາ (Price Calculator)**: ໜ້າ Placeholder ແນະນຳ 5 ຂັ້ນຕອນການຄຳນວນລາຄາປ້າຍອັດຕະໂນມັດ.
- `/about` — **ກ່ຽວກັບພວກເຮົາ (About)**: ອະທິບາຍຈຸດສຸມດ້ານງານປ້າຍ ແລະ ງານພິມ ໂດຍບໍ່ມີການປອມແປງຂໍ້ມູນສະຖິຕິ.
- `/contact` — **ຕິດຕໍ່ພວກເຮົາ (Contact)**: ຊ່ອງທາງ WhatsApp ທາງການ (+856 20 5856 3868), ປຸ່ມກົດໂທອອກ, ແລະ ຟອມສອບຖາມທີ່ເຊື່ອມຕໍ່ WhatsApp ໂດຍກົງ.
- `/owner` — **ລະບົບຈັດການຮ້ານ (Owner Settings)**: ໜ້າ Placeholder ສຳລັບລະບົບຈັດການລາຄາ ແລະ ສຳຮອງຂໍ້ມູນໃນຂັ້ນຕອນຖັດໄປ.
- `*` — **404 Not Found**: ໜ້າແຈ້ງເຕືອນເມື່ອບໍ່ພົບໜ້າເວັບຕາມແບບ Indie Sign.

---

## 🛠 ເທັກໂນໂລຢີຫຼັກ (Tech Stack)

- **React 19** + **Vite 8**: ພັດທະນາເວັບໄຊແບບ Client-Side Single Page Application (SPA).
- **TypeScript**: ຮອງຮັບ Type Safety ຄົບຖ້ວນ.
- **Tailwind CSS v4**: ລະບົບ Styling ທີ່ທັນສະໄໝ ພ້ອມໂທນສີຫຼັກສີສົ້ມ (Brand Orange `#f97316`) ແລະ ໂໝດມືດ (Deep Charcoal).
- **shadcn/ui**: ຊຸດ Reusable UI Components.
- **React Router v7**: ຈັດການເສັ້ນທາງໜ້າເວັບ (Navigation & Routing).
- **Lucide React**: ໄອຄອນຄຸນນະພາບສູງ.
- **Font**: **Noto Sans Lao** ປັບແຕ່ງ `line-height` 1.6+ ປ້ອງກັນສະຫຼະ ແລະ ວັນນະຍຸດຕົກຫຼົ່ນ.

---

## 📝 ວິທີການແກ້ໄຂຂໍ້ມູນຜົນງານ, ລາຄາ ແລະ ຂໍ້ມູນຮ້ານ (How to Edit Data)

ເນື່ອງຈາກລະບົບເຮັດວຽກແບບ Client-side ໂດຍບໍ່ມີຖານຂໍ້ມູນພາຍນອກ ເຈົ້າຂອງຮ້ານສາມາດແກ້ໄຂຂໍ້ມູນໄດ້ງ່າຍໆຜ່ານໄຟລ໌ໂຄງການ:

1. **ການແກ້ໄຂ / ເພີ່ມຜົນງານປ້າຍ (Portfolio Items):**
   - ໄຟລ໌ຂໍ້ມູນ: `src/data/portfolioData.ts`
   - ຮູບພາບຜົນງານ: ວາງໄຟລ໌ຮູບໃໝ່ໄວ້ທີ່ `public/images/portfolio/` (ຮອງຮັບ .webp, .jpg, .png, .svg)
   - ສາມາດກຳນົດ: ຊື່ປ້າຍ, ໝວດໝູ່, ຂະໜາດ, ວັດສະດຸ, ແລະ ສະຖານະ `featured: true/false`.

2. **ການແກ້ໄຂລາຄາ ແລະ ລາຍການບໍລິການ (Services & Prices):**
   - ໄຟລ໌ຂໍ້ມູນ: `src/data/servicesData.ts`
   - ສາມາດປັບປຸງ: ລາຄາເລີ່ມຕົ້ນ `startingPrice` (ຕົວຢ່າງ: 130000), ຫົວໜ່ວຍ `unit`, ແລະ ລາຍລະອຽດ `features`.

3. **ການແກ້ໄຂຂໍ້ມູນຕິດຕໍ່ຮ້ານ (Contact & Business Info):**
   - ໄຟລ໌ຂໍ້ມູນ: `src/constants/business.ts`
   - ເບີໂທ WhatsApp ປັດຈຸບັນ: `+8562058563868`
   - ສາມາດເພີ່ມ URL Facebook Page ຫຼື Messenger ໄດ້ໃນຕົວປ່ຽນ `facebookUrl`.

---

## 📁 ໂຄງສ້າງໂຟນເດີໂຄງການ (Project Structure)

```text
portfolio/
├── public/
│   ├── images/
│   │   └── portfolio/        # ໂຟນເດີຮູບພາບຜົນງານປ້າຍ
│   └── fonts/               # ໂຟນເດີຟອນຕ໌ທ້ອງຖິ່ນ
├── src/
│   ├── assets/              # Logo SVG ແລະ Asset ຫຼັກ
│   ├── components/
│   │   ├── common/          # PageContainer, SectionHeading, PortfolioLightbox,
│   │   │                    # LoadingState, EmptyState, ErrorState, ConfirmationDialog,
│   │   │                    # StatusIndicator, FloatingWhatsAppButton
│   │   ├── layout/          # Header (SiteHeader), Footer (SiteFooter), ThemeToggle
│   │   └── ui/              # Button, Badge, Card, Input, NumberInput, Select,
│   │                        # Checkbox, RadioGroup, Label, FormMessage
│   ├── constants/           # business.ts, navigation.ts, theme.ts
│   ├── data/                # portfolioData.ts, servicesData.ts, defaultProducts.ts, businessInfo.ts
│   ├── hooks/               # useTheme.tsx, useLocalStorage.ts
│   ├── layouts/             # MainLayout.tsx (ຮວມ Header + Outlet + Footer + WhatsApp)
│   ├── lib/                 # utils.ts, storage.ts, formatters.ts, calculator.ts
│   ├── pages/               # HomePage, PortfolioPage, ServicesPage, CalculatorPage,
│   │                        # AboutPage, ContactPage, OwnerPage, NotFoundPage
│   ├── routes/              # index.tsx (React Router config)
│   ├── styles/              # globals.css (Tailwind v4 tokens & Lao typography)
│   └── types/               # index.ts, signage.ts, quote.ts, settings.ts
├── components.json          # ການຕັ້ງຄ່າ shadcn/ui
├── index.html               # ໂຄງສ້າງ HTML ຫຼັກ
├── package.json             # ລາຍການ Dependencies & Scripts
├── tsconfig.json            # ການຕັ້ງຄ່າ TypeScript
├── vite.config.ts           # ການຕັ້ງຄ່າ Vite & Plugins
└── README.md                # ຄູ່ມືແນະນຳໂຄງການ
```

---

## 🚀 ຄຳສັ່ງໃນການຕິດຕັ້ງ ແລະ ໃຊ້ງານ (Commands)

### 1. ການຕິດຕັ້ງ Dependencies
```bash
npm install
```

### 2. ເປີດໃຊ້ງານ Development Server (ໂໝດພັດທະນາ)
```bash
npm run dev
```
ຫຼັງຈາກນັ້ນ, ເປີດ Browser ໄປທີ່: `http://localhost:5173`

### 3. ກວດສອບ TypeScript (Typecheck)
```bash
npm run typecheck
```

### 4. ສ້າງ Production Build
```bash
npm run build
```

### 5. ທົດລອງເປີດ Production Preview
```bash
npm run preview
```

---

© 2026 Indie Sign. All rights reserved.
