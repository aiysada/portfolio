# ຂັ້ນຕອນການ Deploy ຂຶ້ນ Netlify

### ທາງເລືອກທີ 1: Git Push (ແນະນຳ - Netlify ຈະ Auto-Build & Deploy ໃຫ້ທັນທີ)

```bash
git add .
git commit -m "Configure netlify.toml for Netlify deployment"
git pull --no-rebase && git push origin main
```

---

### ທາງເລືອກທີ 2: Deploy ດ້ວຍ Netlify CLI

1. ທົດສອບ Build ກ່ອນ:

```bash
npm run build
```

2. ສັ່ງ Deploy:

```bash
npx netlify-cli deploy --prod --dir=dist
```

---

### ການຕັ້ງຄ່າເທິງ Netlify Dashboard (ຫາກເຊື່ອມຕໍ່ Git ຄັ້ງທຳອິດ):

- **Base directory**: (ປະວ່າງໄວ້)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- ລະບົບຈະອ່ານຄ່າຈາກ [netlify.toml](file:///Users/dev/Desktop/DEV/portfolio/netlify.toml) ໂດຍອັດຕະໂນມັດ
