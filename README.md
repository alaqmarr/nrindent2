# NR Industrial Enterprises — Official Website & Admin Portal

Built with **Next.js 16**, **Tailwind CSS**, **NextAuth.js**, **Prisma + SQLite (`@prisma/adapter-libsql` & `@libsql/client`)**, **Nodemailer + Gmail SMTP**, and **Cloudflare R2 (`@aws-sdk/client-s3`)** with an interactive **React Dropzone + Client Display Crop Window**.

## Key Features

- **Pages**:
  - `/` — Home page with dynamic Hero section, industrial stats, **About NR Industrial Enterprises** showcase, Featured Categories, Featured Products, and Why Choose Us section.
  - `/products` — Complete filterable & searchable industrial products catalog. Every product card includes **two pre-filled Enquire buttons** (WhatsApp & Email).
  - `/products/[id]` — Detailed product page (supports both slug and ID URLs) with image gallery, technical specifications table, features, applications, related products, and two prominent pre-filled **WhatsApp & Email Enquire** buttons.
  - `/categories` — Overview of all industrial product categories.
  - `/categories/[id]` — Category landing page (supports both slug and ID URLs) with category banner and filtered product cards.
  - `/contact` — Dynamic plant/office address, phone lines, WhatsApp chat link, Google Maps embed, and interactive Email Quotation Form powered by Nodemailer + Gmail SMTP.
  - `/admin` & `/admin/login` — Full CRUD Admin Control Center protected by NextAuth.

- **Admin Backend (`/admin`)**:
  - **Products CRUD**: Create, edit, delete products, manage technical specification rows, gallery images, features, applications, stock status, and SEO metadata.
  - **Categories CRUD**: Create, edit, delete categories, manage display order, images, and SEO metadata.
  - **Inquiries CRM**: View and manage all product and contact inquiries, update status (`NEW`, `IN_PROGRESS`, `RESOLVED`, `ARCHIVED`), and reply via WhatsApp or Email.
  - **User Management CRUD**: Create, edit, activate/suspend admin & staff users, assign roles (`ADMIN`, `MANAGER`, `EDITOR`), and change passwords.
  - **Site, Contact, WhatsApp, SMTP, Cloudflare R2 & SEO Settings**: Dynamically manage About NR Industrial Enterprises content, Hero banner, WhatsApp number, Admin Email, Gmail SMTP credentials (with a live **Send Test Email** button), Cloudflare R2 credentials, and global SEO settings.
  - **Interactive Image Cropper (`react-dropzone` + `react-easy-crop`)**: Every image upload in `/admin` opens a client-display crop window (`4:3 Product Card`, `16:9 Category/Hero Banner`, `1:1 Square Thumbnail`, `3:2 Showcase`) and uploads the cropped WebP image to **Cloudflare R2** (with automatic local fallback if R2 keys are not yet entered).

## Default Seeded Admin Credentials

- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@nrindustrial.com`
- **Password**: `Admin@123`
