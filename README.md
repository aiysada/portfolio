# Indie Sign — ເວັບໄຊທຸລະກິດອອກແບບ ແລະ ຜະລິດປ້າຍຄົບວົງຈອນ

> **"ຄົບທຸກວຽກປ້າຍ ອອກແບບ ຜະລິດ ແລະຕິດຕັ້ງ"**  
> *All-in-one Signage Work: Design, Production, and Installation*

ເວັບໄຊທຸລະກິດປ້າຍໂຄສະນາຄົບວົງຈອນ (Client-Side React SPA) ທີ່ອອກແບບມາສະເພາະເພື່ອຕອບໂຈດການນຳສະເໜີຜົນງານ, ລະບົບຄຳນວນລາຄາປ້າຍອັດຕະໂນມັດ, ການສ້າງເອກະສານທາງການ (ໃບສະເໜີລາຄາ, ໃບແຈ້ງໜີ້, ໃບເສັດຮັບເງິນ PDF), ລະບົບບັນທຶກປະຫວັດເອກະສານ (Quote History), ແລະ ລະບົບຈັດການຫຼັງບ້ານສຳລັບເຈົ້າຂອງຮ້ານ (Owner Settings) ໂດຍບໍ່ຕ້ອງເພິ່ງພາ Server ຖານຂໍ້ມູນພາຍນອກ.

---

## 🛠 1. ເທັກໂນໂລຢີຫຼັກ (Tech Stack)

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) (Client-Side Single Page Application)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict Type-checking)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Variables
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) (Route-level Code Splitting & Suspense)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) + [DOMPurify](https://github.com/cure53/DOMPurify) (ຮອງຮັບພາສາລາວ ແລະ ສະຫຼະວັນນະຍຸດ 100%)
- **Typography**: `Noto Sans Lao` & `Plus Jakarta Sans` (ປັບແຕ່ງ `line-height` 1.6+ ປ້ອງກັນສະຫຼະຕົກຫຼົ່ນ)
- **Local Storage**: LocalStorage Architecture ພ້ອມ Schema Versioning, Hash PIN Encryption, ແລະ JSON Backup & Restore

---

## 📁 2. ໂຄງສ້າງໂຟນເດີໂຄງການ (Project Structure)

```text
portfolio/
├── public/
│   ├── _redirects               # SPA routing rewrite ສຳລັບ Cloudflare Pages & Netlify
│   ├── 404.html                 # SPA routing fallback ສຳລັບ GitHub Pages
│   ├── favicon.ico              # Favicon ຫຼັກຂອງເວັບໄຊ
│   ├── robots.txt               # Crawler directives (ອະນຸຍາດໜ້າທົ່ວໄປ, ປິດກັ້ນ /owner)
│   ├── sitemap.xml              # XML Sitemap ບັນຈຸສະເພາະໜ້າສາທາລະນະ
│   ├── site.webmanifest         # PWA Web App Manifest
│   └── images/
│       └── portfolio/           # ຮູບພາບຕົວຢ່າງຜົນງານປ້າຍ (.svg, .webp, .jpg)
├── src/
│   ├── components/
│   │   ├── calculator/          # ລະບົບຄຳນວນລາຄາ, ຟອມປ້ອນຂະໜາດ, ຕາຕະລາງສິນຄ້າ, Dialog ບັນທຶກ
│   │   ├── common/              # SeoManager, PageLoadingFallback, PageContainer, BrandLogo
│   │   ├── documents/           # ແມ່ແບບເອກະສານ Quotation, Invoice, Receipt (PDF)
│   │   ├── layout/              # Header, Footer, ThemeToggle
│   │   ├── owner/               # ລະບົບ Owner Settings: 10 Sections (ສິນຄ້າ, ວັດສະດຸ, ປະຫວັດ, SEO...)
│   │   └── ui/                  # Reusable UI primitives (Button, Badge, Card, Dialog...)
│   ├── constants/               # ຂໍ້ມູນຕິດຕໍ່ຮ້ານ, ລາຍການເມນູ, ໂທນສີ
│   ├── context/                 # OwnerSettingsContext (ສູນກາງຈັດການ State ທົ່ວລະບົບ)
│   ├── data/                    # portfolioData.ts (ຄັງຜົນງານ), servicesData.ts
│   ├── hooks/                   # useQuoteCalculator, useTheme
│   ├── layouts/                 # MainLayout.tsx (Header + Outlet + Footer + WhatsApp)
│   ├── lib/                     # pdfGenerator, settingsStorage, documentNumbering, crypto
│   ├── pages/                   # HomePage, ServicesPage, PortfolioPage, CalculatorPage...
│   ├── routes/                  # index.tsx (Code-split route configuration)
│   ├── styles/                  # globals.css (Tailwind tokens, Lao fonts, reduced motion)
│   └── types/                   # TypeScript interfaces (ownerSettings, quoteHistory, documents)
├── vercel.json                  # SPA routing configuration ສຳລັບ Vercel
├── vite.config.ts               # Vite build, manualChunks code-splitting, chunk optimization
└── package.json                 # Scripts & dependencies
```

---

## 💻 3. ຄວາມຕ້ອງການຂອງລະບົບ (System Requirements)

- **Node.js**: ເວີຊັນ `18.x` ຫຼື `20.x` ຂຶ້ນໄປ
- **Package Manager**: `npm` (ເວີຊັນ 9+ ຂຶ້ນໄປ)
- **Web Browser**: Chrome, Edge, Safari, Firefox ລຸ້ນປັດຈຸບັນ

---

## 🚀 4. ຄຳສັ່ງຕິດຕັ້ງ ແລະ ພັດທະນາ (Development Commands)

### 1) ຕິດຕັ້ງ Dependencies
```bash
npm install
```

### 2) ເປີດໃຊ້ງານ Development Server (ໂໝດພັດທະນາ)
```bash
npm run dev
```
ລະບົບຈະເປີດທີ່: `http://localhost:5173`

### 3) ກວດສອບ TypeScript Typecheck
```bash
npm run typecheck
```

### 4) ສັ່ງ Run Unit Tests
```bash
npm test
```

### 5) ສ້າງ Production Build
```bash
npm run build
```
ຜົນການ Build ຈະຖືກບັນທຶກໄວ້ໃນໂຟນເດີ `dist/` ພ້ອມແຍກ Chunks ຂະໜາດນ້ອຍເພື່ອຄວາມໄວສູງສຸດ.

### 6) ທົດລອງເປີດ Production Preview
```bash
npm run preview
```

---

## 🌐 5. ເສັ້ນທາງໜ້າເວັບຫຼັກ (Application Routes)

| Route | ຊື່ໜ້າ | ລາຍລະອຽດ | ສະຖານະ SEO |
|---|---|---|---|
| `/` | **ໜ້າຫຼັກ (Home)** | Hero banner, ສະຫຼຸບ 6 ໝວດໝູ່ບໍລິການ, 4 ຜົນງານເດັ່ນ, CTA | `index, follow` |
| `/services` | **ສິນຄ້າ & ບໍລິການ** | ລາຍການປ້າຍທຸກປະເພດ ພ້ອມລາຄາເລີ່ມຕົ້ນມາດຕະຖານ | `index, follow` |
| `/portfolio` | **ຄັງຜົນງານປ້າຍ** | ແຍກໝວດໝູ່ ພ້ອມລະບົບ Lightbox Preview ຮອງຮັບຄີບອດ | `index, follow` |
| `/calculator` | **ລະບົບຄຳນວນລາຄາ** | ຄຳນວນລາຄາອັດຕະໂນມັດ, ສ້າງ PDF ໃບສະເໜີ/ໃບແຈ້ງໜີ້/ໃບເສັດ | `index, follow` |
| `/about` | **ກ່ຽວກັບພວກເຮົາ** | ປະຫວັດ ແລະ ມາດຕະຖານງານຜະລິດປ້າຍຂອງ Indie Sign | `index, follow` |
| `/contact` | **ຕິດຕໍ່ພວກເຮົາ** | ຊ່ອງທາງ WhatsApp, ເບີໂທສອບຖາມ, ຟອມຕິດຕໍ່ດ່ວນ | `index, follow` |
| `/owner` | **ລະບົບຈັດການຮ້ານ** | ຈັດການລາຄາ, ຂໍ້ມູນຮ້ານ, SEO, ປະຫວັດໃບສະເໜີ, PIN Gate | `noindex, nofollow` |
| `*` | **404 Not Found** | ໜ້າແຈ້ງເຕືອນເມື່ອບໍ່ພົບໜ້າ ພ້ອມປຸ່ມກັບໜ້າຫຼັກ ແລະ ຄຳນວນລາຄາ | `noindex` |

---

## 🖼 6. ວິທີເພີ່ມຮູບພາບຜົນງານປ້າຍ (Portfolio Images)

1. ນຳໄຟລ໌ຮູບພາບປ້າຍ (ແນະນຳຂະໜາດອັດຕາສ່ວນ 4:3, ຟໍແມັດ `.webp`, `.jpg`, ຫຼື `.png`, ຂະໜາດໄຟລ໌ບໍ່ເກີນ 500KB) ໄປວາງໄວ້ໃນໂຟນເດີ:
   ```text
   public/images/portfolio/
   ```
2. ເປີດໄຟລ໌ `src/data/portfolioData.ts` ແລ້ວເພີ່ມລາຍການໃໝ່:
   ```ts
   {
     id: "sign-project-01",
     titleLao: "ປ້າຍກ່ອງໄຟ LED ໜ້າຮ້ານກາເຟ",
     category: "lightbox", // lightbox | acrylic | vinyl | neon | logo | print | others
     image: "/images/portfolio/your-image-name.webp",
     altTextLao: "ຕົວຢ່າງປ້າຍກ່ອງໄຟ LED ຂະໜາດ 3x1 ແມັດ",
     dimensions: "3.00 × 1.00 ແມັດ",
     materialLao: "ໂຄງອາລູມິນຽມ, ແຜ່ນອະຄຣີລິກ, ໄຟ LED Samsung",
     descriptionLao: "ປ້າຍກ່ອງໄຟກັນນ້ຳ ແສງສະຫວ່າງສະໝ່ຳສະເໝີ ປະຢັດໄຟຟ້າ",
     isSample: false, // ໃສ່ false ຖ້າເປັນງານຈິງຂອງລູກຄ້າ
   }
   ```

---

## 🎨 7. ວິທີປ່ຽນ Logo ແລະ ຂໍ້ມູນທຸລະກິດ

### ການປ່ຽນ Logo:
- ໂລໂກ້ຫຼັກຂອງເວັບໄຊຖືກສະແດງຜ່ານ Component `src/components/common/BrandLogo.tsx`.
- ຫາກທ່ານມີໄຟລ໌ໂລໂກ້ຮ້ານແບບຮູບພາບ (PNG/SVG), ສາມາດນຳໄປວາງໄວ້ທີ່ `public/images/logo.svg` ຫຼື ອັບໂຫຼດ URL ໂລໂກ້ໃນໜ້າ **Owner Settings > ຂໍ້ມູນທຸລະກິດ**.

### ການປ່ຽນຂໍ້ມູນຕິດຕໍ່ຮ້ານ:
- ທ່ານສາມາດແກ້ໄຂໄດ້ 2 ຊ່ອງທາງ:
  1. **ຜ່ານໜ້າເວັບໂດຍກົງ**: ເຂົ້າໄປທີ່ເມນູ **Owner Settings (`/owner`)** > ເລືອກຫົວຂໍ້ **"ຂໍ້ມູນທຸລະກິດ"** ແລ້ວແກ້ໄຂຊື່ຮ້ານ, ເບີໂທ, ທີ່ຢູ່, ເລກບັນຊີທະນາຄານ, ແລະ QR Code.
  2. **ຜ່ານໄຟລ໌ Code ເລີ່ມຕົ້ນ**: ແກ້ໄຂຄ່າເລີ່ມຕົ້ນໃນ `src/constants/business.ts`.

---

## 🔍 8. ການຕັ້ງຄ່າ SEO, Google Search Console ແລະ Analytics

ລະບົບມີ Component `SeoManager` ທີ່ຄອຍອັບເດດ Title, Meta Description, Keywords, Open Graph, ແລະ Canonical Tag ແບບອັດຕະໂນມັດທຸກຄັ້ງທີ່ມີການປ່ຽນໜ້າ.

### 1) ການຕັ້ງຄ່າ Production Domain:
- ເຂົ້າໄປທີ່ **Owner Settings > SEO & Analytics**.
- ໃນຊ່ອງ **Production Domain**, ໃສ່ URL ເວັບໄຊຈິງຂອງທ່ານ ເຊັ່ນ: `https://indiesign.la` (ຫ້າມໃສ່ localhost).
- ເມື່ອກຳນົດແລ້ວ, ລະບົບຈະສ້າງ Canonical URL ແລະ Open Graph Preview ເວລາແຊຣ໌ລິ້ງລົງ Facebook / WhatsApp ໃຫ້ໂດຍອັດຕະໂນມັດ.
- **ສຳຄັນ**: ກ່ອນ Deploy ຂຶ້ນ Hosting ຈິງ ໃຫ້ນຳ URL ນີ້ໄປປ່ຽນແທນ Placeholder ໃນໄຟລ໌:
  - `public/robots.txt`
  - `public/sitemap.xml`

### 2) ການຢືນຢັນ Google Search Console:
1. ເຂົ້າໄປທີ່ [Google Search Console](https://search.google.com/search-console) ແລ້ວກົດເພີ່ມ Property ເວັບໄຊຂອງທ່ານ.
2. ເລືອກວິທີຢືນຢັນແບບ **HTML Tag**.
3. ຄັດລອກລະຫັດ Verification Tag ມາໃສ່ໃນຊ່ອງ **Google Search Console Verification Tag** ໃນໜ້າ Owner Settings ແລ້ວກົດບັນທຶກ.
4. ເມື່ອຢືນຢັນສຳເລັດ, ໃຫ້ໄປທີ່ເມນູ **Sitemaps** ໃນ Search Console ແລ້ວພິມ `sitemap.xml` ກົດ Submit.

### 3) ການຕິດຕັ້ງ Google Analytics 4 (GA4):
- ລະບົບຮອງຮັບ Google Analytics 4 ແບບປອດໄພ.
- ພຽງແຕ່ນຳເອົາ **Measurement ID** (ຮູບແບບ `G-XXXXXXXXXX`) ມາໃສ່ໃນໜ້າ Owner Settings.
- **ຄວາມປອດໄພ**: ລະບົບຈະໂຫຼດ script ສະເພາະເມື່ອມີ ID ທີ່ຖືກຕ້ອງເທົ່ານັ້ນ, ບໍ່ມີການສົ່ງຂໍ້ມູນໃບສະເໜີລາຄາ ຫຼື ຂໍ້ມູນລູກຄ້າໄປຍັງ Google Analytics.

---

## 🚀 9. ຄູ່ມືການ Deploy ຂຶ້ນ Free Static Hosting

ເວັບໄຊນີ້ຖືກສ້າງດ້ວຍ React SPA ຈຶ່ງສາມາດ Deploy ຂຶ້ນ Static Hosting ຟຣີໄດ້ຢ່າງງ່າຍດາຍ:

### ທາງເລືອກທີ 1: Vercel (ແນະນຳສູງສຸດ)
1. ນຳໂຄງການຂຶ້ນ GitHub Repository.
2. ເຂົ້າສູ່ລະບົບ [vercel.com](https://vercel.com) ແລ້ວກົດ **Add New > Project**.
3. ເລືອກ Repository ນີ້:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. ກົດ **Deploy** — ໄຟລ໌ `vercel.json` ທີ່ກຽມໄວ້ແລ້ວຈະຈັດການ Routing SPA ແລະ Caching ໃຫ້ອັດຕະໂນມັດ.

### ທາງເລືອກທີ 2: Cloudflare Pages
1. ເຂົ້າສູ່ລະບົບ [dash.cloudflare.com](https://dash.cloudflare.com) > **Workers & Pages**.
2. ກົດ **Create Application > Pages > Connect to Git**.
3. ຕັ້ງຄ່າ Build Settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. ໄຟລ໌ `public/_redirects` ຈະຖືກ copy ໄປຍັງ `dist/_redirects` ເພື່ອປ້ອງກັນບັນຫາ Page Refresh 404.

### ທາງເລືອກທີ 3: Netlify
1. ເຂົ້າສູ່ລະບົບ [netlify.com](https://netlify.com) > **Add new site > Import an existing project**.
2. ເຊື່ອມຕໍ່ Git Repo:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. ໄຟລ໌ `_redirects` ຈະຮອງຮັບການ Refresh ທຸກໜ້າໂດຍອັດຕະໂນມັດ.

---

## ⚠️ 10. ຂໍ້ຄວນລະວັງ ແລະ ຂໍ້ຈຳກັດຂອງລະບົບ (Disclosures & Limitations)

### 1) ຂໍ້ຈຳກັດຂອງ LocalStorage:
- ຂໍ້ມູນການຕັ້ງຄ່າລາຄາ, ຂໍ້ມູນຮ້ານ, ແລະ ປະຫວັດໃບສະເໜີລາຄາ **ຖືກບັນທຶກຢູ່ໃນ Web Browser ເຄື່ອງທີ່ທ່ານກຳລັງໃຊ້ງານເທົ່ານັ້ນ**.
- ເວັບໄຊແບບ Static Site ບໍ່ມີລະບົບ Sync ຖານຂໍ້ມູນກາງຂ້າມເຄື່ອງ. ຫາກທ່ານປ່ຽນໄປໃຊ້ Browser ອື່ນ ຫຼື ເຄື່ອງອື່ນ ຂໍ້ມູນຈະບໍ່ຕາມໄປດ້ວຍ.
- **ວິທີແກ້ໄຂ**: ໃຫ້ໃຊ້ຟັງຊັນ **"ສຳຮອງຂໍ້ມູນ (Export JSON Backup)"** ໃນໜ້າ Owner Settings ເພື່ອນຳໄຟລ໌ backup ໄປ Restore ໃສ່ເຄື່ອງອື່ນໄດ້ທັນທີ.

### 2) ຂໍ້ຈຳກັດຂອງລະຫັດ PIN (Owner PIN):
- ລະຫັດ PIN ໃນໜ້າ `/owner` ເປັນລະບົບປ້ອງກັນລະດັບ **Front-end UI Gate** ເພື່ອປ້ອງກັນບໍ່ໃຫ້ລູກຄ້າທົ່ວໄປເປີດເບິ່ງລາຄາຕົ້ນທຶນ ຫຼື ແກ້ໄຂລາຄາໂດຍບັງເອີນເທົ່ານັ້ນ.
- ເນື່ອງຈາກບໍ່ມີ Server Backend, ຜູ້ທີ່ມີຄວາມຮູ້ດ້ານໄອທີອາດສາມາດກວດເບິ່ງ LocalStorage ຜ່ານ Browser DevTools ໄດ້. ຫ້າມບັນທຶກລະຫັດຜ່ານບັນຊີທະນາຄານ ຫຼື ຂໍ້ມູນລັບສຸດຍອດລົງໃນລະບົບນີ້.

---

## 🛠 11. ການແກ້ໄຂບັນຫາທີ່ພົບເລື້ອຍ (Troubleshooting)

1. **ເປີດໜ້າ `/services` ຫຼື `/calculator` ແລ້ວກົດ Refresh ແລ້ວຂຶ້ນ 404 Not Found លើ Hosting:**
   - ກວດສອບໃຫ້ແນ່ໃຈວ່າໄຟລ໌ `public/_redirects` (ສຳລັບ Cloudflare/Netlify) ຫຼື `vercel.json` (ສຳລັບ Vercel) ຖືກ Commit ລົງໃນ Git Repo.
2. **ດາວໂຫຼດ PDF ແລ້ວສະຫຼະພາສາລາວຊ້ອນກັນ ຫຼື ຕົກຫຼົ່ນ:**
   - ລະບົບໃຊ້ DOM-to-Canvas rendering ຜ່ານຟອນຕ໌ `Noto Sans Lao`. ໃຫ້ກວດສອບວ່າອິນເຕີເນັດສາມາດໂຫຼດຟອນຕ໌ Google Fonts ໄດ້ປົກກະຕິ.
3. **ກົດບັນທຶກການຕັ້ງຄ່າແລ້ວຂໍ້ມູນຫາຍຫຼັງຈາກ Clear Cache:**
   - ການ Clear Browser History & Cache ທີ່ເລືອກລຶບ "Cookies and site data" ຈະລຶບ LocalStorage ໄປພ້ອມ. ແນະນຳໃຫ້ດາວໂຫຼດ JSON Backup ເກັບໄວ້ສະເໝີ.

---

© 2026 Indie Sign. ສິດທິທັງໝົດເປັນຂອງ Indie Sign.
