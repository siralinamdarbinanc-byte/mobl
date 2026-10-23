# 👑 ARIKAN Royal Wood Gallery — 3D Furniture Configurator
### گالری منبت و مبلمان اشرافی سلطنتی آریكان

An interactive, production-ready 3D Royal Furniture Configurator built with **React**, **Three.js** (`@react-three/fiber`, `@react-three/drei`), and **Tailwind CSS**.

---

## 🚀 راهنمای پوش (Push) به گیت‌هاب (GitHub)

مخزن گیت (Git) به همراه برنچ `main` آماده شده است. برای ارسال کدها به گیت‌هاب خود، دستورات زیر را در ترمینال اجرا کنید:

```bash
# ۱. اتصال به ریپازیتوری گیت‌هاب خود (نام کاربری و نام ریپازیتوری خود را جایگزین کنید)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# ۲. ارسال کدها به برنچ main در گیت‌هاب
git push -u origin main
```

اگر در آینده تغییراتی ایجاد کردید:
```bash
git add .
git commit -m "update: توضیحات تغییرات"
git push
```

---

## ⚡ گردش‌کارهای خودکار گیت‌هاب اکشنز (GitHub Actions)

پروژه به دو ورک‌فلو خودکار در مسیر `.github/workflows/` مجهز شده است:

1. **`ci.yml` (CI - Build & Lint Validation)**:
   - با هر بار `push` یا ایجاد `pull_request` روی برنچ‌های `main` / `master` اجرا می‌شود.
   - کدهای تایپ‌اسکریپت را بررسی (Lint & Typecheck) و بیلد پروداکشن را اعتبارسنجی می‌کند.

2. **`deploy.yml` (Deploy to GitHub Pages)**:
   - با پوش روی برنچ `main`، پروژه را خودکار بیلد کرده و روی **GitHub Pages** به صورت رایگان و زنده منتشر می‌کند.
   - برای فعال‌سازی در گیت‌هاب: به بخش **Settings > Pages** رفته و در قسمت **Source** گزینه **GitHub Actions** را انتخاب کنید.

---

## 🛠️ دستورات توسعه محلی (Local Development)

```bash
# نصب پکیج‌ها
npm install

# اجرای سرور توسعه (Local Dev Server)
npm run dev

# بررسی عدم وجود خطای تایپ و لیدر
npm run lint

# بیلد نسخه نهایی پروداکشن
npm run build
```

---

## 🎨 قابلیت‌های کلیدی

- **مدل‌سازی پارامتریک سه‌بعدی**: مبل تک‌نفره سلطنتی (Armchair) و کاناپه سه‌نفره اشرافی (3-Seater Grand Sofa)
- **منبت‌کاری و تاج باروک**: شبیه‌سازی اسلیمی، برگ کنگری، و پایه‌های سم‌آهویی
- **روکش و لمسه‌کوبی دکمه‌دار الماسی**: با متریال‌های مخمل، زریبافت طلایی، ابریشم و چرم
- **آپلود طرح پارچه اختصاصی (Custom Fabric Texture)**: امکان قرار دادن عکس پارچه دلخواه روی مبل
- **محاسبه قیمت داینامیک**: به‌روزرسانی لحظه‌ای قیمت با تغییر مدل و متریال
- **ثبت سفارش سفارشی**: مدال اختصاصی جهت ثبت پیش‌فاکتور و اطلاعات مشتری
