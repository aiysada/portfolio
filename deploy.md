# ຂັ້ນຕອນການ Deploy (Cloudflare Pages, Netlify & Vercel)

---

## ⚡ 1. Deploy ຂຶ້ນ Cloudflare Pages (ແນະນຳທີ່ສຸດສຳລັບຜູ້ໃຊ້ໃນລາວ ⭐⭐⭐⭐⭐)
> **ຂໍ້ດີ:** ໂດເມນຟຣີ `*.pages.dev` ບໍ່ຖືກບລັອກໃນລາວ (Unitel, LTC, ETL ເຂົ້າໄດ້ 100%), ຄວາມໄວສູງ, Bandwidth ຟຣີບໍ່ຈຳກັດ.

### ວິທີທີ 1: ເຊື່ອມຕໍ່ຜ່ານ GitHub (Auto-Deploy ທຸກຄັ້ງທີ່ Push)
1. ເຂົ້າສູ່ລະບົບ [dash.cloudflare.com](https://dash.cloudflare.com).
2. ເມນູດ້ານຊ້າຍ: ເລືອກ **Workers & Pages**.
3. ກົດປຸ່ມ **Create application** > ເລືອກແທັບ **Pages** > ກົດ **Connect to Git**.
4. ເລືອກ GitHub Account ແລະ ເລືອກ Repository `portfolio`.
5. ຕັ້ງຄ່າ **Set up builds and deployments**:
   - **Project name**: `indiesign` (ຈະໄດ້ URL: `https://indiesign.pages.dev`)
   - **Production branch**: `main`
   - **Framework preset**: ເລືອກ `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - *(ແນະນຳ)* ຄລິກ **Environment variables (advanced)** > ເພີ່ມ:
     - Variable name: `NODE_VERSION`
     - Value: `20`
6. ກົດ **Save and Deploy**.
7. ໄຟລ໌ `_redirects` ທີ່ເຮົາຕັ້ງຄ່າໄວ້ຈະຈັດການ SPA Routing ໃຫ້ອັດຕະໂນມັດ (Refresh ບໍ່ຕິດ 404).

### ວິທີທີ 2: Deploy ດ້ວຍ Wrangler CLI ໂດຍກົງ
```bash
npm run build
npx wrangler pages deploy dist --project-name=indiesign
```

---

## 🌐 2. Deploy ຂຶ້ນ Netlify

### ທາງເລືອກທີ 1: Git Push (Auto-Deploy)
```bash
git add .
git commit -m "Update deployment"
git pull --no-rebase
git push origin main
```

### ທາງເລືອກທີ 2: Deploy ດ້ວຍ Netlify CLI
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### ການຕັ້ງຄ່າເທິງ Netlify Dashboard:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- ລະບົບຈະອ່ານຄ່າຈາກ [netlify.toml](file:///Users/dev/Desktop/DEV/portfolio/netlify.toml) ອັດຕະໂນມັດ.

---

## 🔺 3. Deploy ຂຶ້ນ Vercel

### ທາງເລືອກທີ 1: Git Push
```bash
git add .
git commit -m "Configure deployment"
git pull --no-rebase
git push origin main
```

### ການຕັ້ງຄ່າເທິງ Vercel Dashboard:
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- *(ໝາຍເຫດ: ຫາກເຂົ້າລິ້ງ `*.vercel.app` ບໍ່ໄດ້ຍ້ອນ ISP ໃນລາວບລັອກ, ໃຫ້ໃຊ້ Custom Domain ຫຼື ເປີດ VPN)*
