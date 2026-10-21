# ຂັ້ນຕອນການ Deploy (Vercel & Netlify)

---

## 🔺 1. Deploy ຂຶ້ນ Vercel

### ທາງເລືອກທີ 1: Git Push (ແນະນຳ - Vercel ຈະ Auto-Build & Deploy ໃຫ້ທັນທີ)
ເມື່ອ Push Code ຂຶ້ນ GitHub, Vercel ຈະອ່ານການຕັ້ງຄ່າຈາກ [vercel.json](file:///Users/dev/Desktop/DEV/portfolio/vercel.json) ອັດຕະໂນມັດ:
```bash
git add .
git commit -m "Configure vercel.json and clean up for Vercel deployment"
git pull --no-rebase
git push origin main
```

### ທາງເລືອກທີ 2: Deploy ດ້ວຍ Vercel CLI
```bash
# Deploy ລົງ Production ໂດຍກົງ
npx vercel --prod
```

### ການຕັ້ງຄ່າເທິງ Vercel Dashboard (ຫາກເຊື່ອມຕໍ່ Repo ຄັ້ງທຳອິດ ຫຼື ຕ້ອງການກວດສອບ):
- **Framework Preset**: `Vite` (ສຳຄັນ: ຫາກເຫັນເປັນ Remix ໃຫ້ປ່ຽນເປັນ **Vite**)
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- ລະບົບມີໄຟລ໌ [vercel.json](file:///Users/dev/Desktop/DEV/portfolio/vercel.json) ກຳນົດຄ່າ Rewrites (ປ້ອງກັນ 404 ເວລາ Refresh ໜ້າ) ແລະ Headers ໄວ້ແລ້ວ.

---

## 🌐 2. Deploy ຂຶ້ນ Netlify

### ທາງເລືອກທີ 1: Git Push
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
