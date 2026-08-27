# Luminous Skin Clinic — Production CMS

Production-oriented multi-page Next.js website foundation for Luminous Skin Clinic, Leeds.

## Included
- Conversion-focused homepage
- Treatments hub + dynamic treatment pages
- Skin concerns hub + dynamic concern pages
- Pricing
- Results placeholder prepared for Cloudinary media
- Reviews
- About
- FAQ
- Contact UI
- 5-step responsive booking UI
- Admin dashboard shell
- Cloudinary URL helper and folder/public-ID convention
- Responsive navigation and mobile booking CTA
- SEO metadata foundation

## Important Stage 2 status
The booking UI is intentionally a front-end demo. It does **not** save appointments yet. Do not use it for real bookings until Stage 3 connects Neon/Postgres, server-side availability validation and authentication.

## 1. Install
Use Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 2. Cloudinary
Create `.env.local` in the project root:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
```

The project expects assets with public IDs similar to:

```text
luminous-skin-clinic/homepage/hero
luminous-skin-clinic/practitioners/main-practitioner
luminous-skin-clinic/treatments/dermaplaning
luminous-skin-clinic/treatments/microneedling
```

If an asset/cloud name is not available yet, the site uses visual fallback images so the design still renders.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Stage 2 Luminous website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## 4. Import into Vercel
1. Vercel → Add New → Project
2. Import the GitHub repository
3. Framework should auto-detect Next.js
4. Add environment variable `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
5. Deploy

## Stage 3
Next stage will add:
- Neon Postgres
- Real appointment tables
- Server-side availability
- Double-booking protection
- Admin authentication
- Treatment CRUD
- Working contact/booking submissions
- Booking management


## Current production features
Secure admin, live Neon bookings, editable treatments/reviews/availability, website CMS, and authenticated Cloudinary media uploads.
