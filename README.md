# Roblox Game Development Consultancy Website

Production-ready Laravel + Inertia.js (React) website for an independent Roblox game development consultancy.

## Tech Stack

- **Framework**: Laravel 11.x (PHP 8.3+)
- **Frontend**: React 19 via Inertia.js 2.x
- **Styling**: Tailwind CSS v4 with custom pastel editorial theme tokens
- **Database**: MySQL 8.x (with full SQLite support for local dev & testing)
- **Tooling**: Vite 6.x, Pest / PHPUnit

---

## Design System & Theme Tokens

The design direction follows a warm, stationery-inspired editorial aesthetic with subtle game-block motifs, avoiding generic SaaS gradients or 3D blobs.

- **Background Cream**: `#FBF7F2` (`bg-cream`)
- **Peach**: `#F9D5C5` (`bg-peach`)
- **Mint**: `#CFE8DC` (`bg-mint`)
- **Lavender**: `#DCD3F0` (`bg-lavender`)
- **Butter**: `#F8EBB8` (`bg-butter`)
- **Sky**: `#CFE3F3` (`bg-sky`)
- **Ink (Text)**: `#2B2A33` (`text-ink`)
- **Soft Ink**: `#5B5963` (`text-ink-soft`)
- **Headings**: *Fraunces* (Editorial Serif)
- **Body**: *DM Sans* (Clean Humanist Sans)

*Contrast Note: All text uses high-contrast ink on pastel tokens, passing WCAG AA standards.*

---

## Pages Included

1. **Home (`/`)**: Value proposition, target audience breakdown (Indie Creators, Small Studios, Brands), services overview, featured case studies, 4-step process strip, and inquiry CTA.
2. **Services (`/services`)**: In-depth service breakdowns with what clients receive, typical deliverables, target audience suitability, and direct inquiry links.
3. **Packages (`/packages`)**: 3 transparent consulting tiers (Starter, Studio, Brand) with "starting from" pricing in IDR, editable from the database, plus an engagement FAQ.
4. **Portfolio (`/portfolio`)**: Case studies listing with filterable accent colors and detail pages (`/portfolio/{slug}`) detailing The Problem, Our Approach, The Outcome, and Tools Used.
5. **Process (`/process`)**: Consultation, scoping, execution, and handover phases with realistic timeline expectations and client prerequisite checklists.
6. **About (`/about`)**: Studio philosophy, daily development stack (Roblox Studio, Rojo, Luau, Miro, Figma), and core values.
7. **Contact (`/contact`)**: Form Request validated inquiry form with honeypot spam protection, rate limiting (5 submissions/hour/IP), queued owner notifications, confirmation emails, direct domain email, and WhatsApp link.
8. **Legal (`/privacy-policy` & `/terms`)**: Draft privacy policy and terms of service including explicit non-affiliation disclaimer with Roblox Corporation.
9. **Sitemap (`/sitemap.xml`)**: Dynamic XML sitemap for SEO crawlers with static routes and dynamic portfolio pages.
10. **Admin Area (`/admin`)**: Protected Laravel authentication dashboard to manage inquiries, services, packages (including IDR pricing), and case studies.

---

## Local Development Setup

### 1. Prerequisites
- PHP 8.3+ with `pdo`, `mbstring`, `zip`, `openssl` extensions
- Composer 2.x
- Node.js 18+ and npm
- MySQL 8.x or SQLite

### 2. Installation Steps

Clone the repository and enter the directory:

```bash
cd "path/to/project"
```

Install Composer dependencies:
```bash
composer install
```

Install Node dependencies:
```bash
npm install
```

Copy the environment file and generate application key:
```bash
cp .env.example .env # or copy .env
php artisan key:generate
```

### 3. Database Setup

Configure your database connection in `.env`:

**For MySQL:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=roblox_consultancy
DB_USERNAME=root
DB_PASSWORD=
```

**For SQLite (Zero-config local testing):**
```env
DB_CONNECTION=sqlite
```
*(Ensure `database/database.sqlite` exists if using SQLite)*

Run migrations and seed the initial content:
```bash
php artisan migrate --seed
```

This seeds:
- 5 Core Consulting Services
- 3 Packages with IDR pricing
- 3 Realistic Case Studies with `[CLIENT_NAME]` and `[PROJECT_RESULT]` placeholders
- 1 Admin User (`admin@example.com` / `changeme123!`)

### 4. Build Assets & Start Server

In terminal 1 (Vite dev server):
```bash
npm run dev
```

In terminal 2 (Laravel local server):
```bash
php artisan serve
```

Visit the website at: `http://localhost:8000`  
Access the admin portal at: `http://localhost:8000/admin`

---

## Running Automated Tests

Run the test suite verifying all 12 feature test cases:
```bash
php artisan test
```

---

## Production Deployment Guide

### A. Shared Hosting (cPanel / DirectAdmin)

1. **Build Assets Locally or in CI**:
   ```bash
   npm run build
   ```
2. **Directory Structure**:
   - Upload all files except the `public/` directory into a folder above `public_html` (e.g. `/home/username/laravel_app`).
   - Upload the contents of Laravel's `public/` directory directly into your web root (`/home/username/public_html`).
   - In `public_html/index.php`, update the paths to `autoload.php` and `bootstrap/app.php`:
     ```php
     require __DIR__.'/../laravel_app/vendor/autoload.php';
     $app = require_once __DIR__.'/../laravel_app/bootstrap/app.php';
     ```
3. **Environment & Database**:
   - In cPanel, create a MySQL database and user.
   - Edit the `.env` file in `/home/username/laravel_app` with your production DB credentials, `APP_ENV=production`, `APP_DEBUG=false`, and your production `APP_URL`.
4. **Run Migrations**:
   - Use SSH or cPanel Terminal:
     ```bash
     php artisan migrate --force --seed
     php artisan config:cache
     php artisan route:cache
     php artisan view:cache
     ```

### B. VPS Deployment (Ubuntu / Nginx)

1. **Server Requirements**:
   - Nginx, PHP 8.3-FPM, MySQL 8.0, Composer, Node.js / Git.
2. **Nginx Configuration**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/roblox_consultancy/public;

       add_header X-Frame-Options "SAMEORIGIN";
       add_header X-Content-Type-Options "nosniff";

       index index.php;
       charset utf-8;

       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }

       location = /favicon.ico { access_log off; log_not_found off; }
       location = /robots.txt  { access_log off; log_not_found off; }

       error_page 404 /index.php;

       location ~ \.php$ {
           fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
           fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
           include fastcgi_params;
       }

       location ~ /\.(?!well-known).* {
           deny all;
       }
   }
   ```
3. **Permissions & Optimization**:
   ```bash
   sudo chown -R www-data:www-data /var/www/roblox_consultancy/storage /var/www/roblox_consultancy/bootstrap/cache
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
4. **Queue Worker (Supervisor)**:
   For processing contact notification emails asynchronously:
   ```ini
   [program:roblox-worker]
   process_name=%(program_name)s_%(process_num)02d
   command=php /var/www/roblox_consultancy/artisan queue:work --sleep=3 --tries=3
   autostart=true
   autorestart=true
   user=www-data
   numprocs=1
   redirect_stderr=true
   stdout_logfile=/var/www/roblox_consultancy/storage/logs/worker.log
   ```

---

## Pre-Launch Placeholder Replacement Checklist

Before taking the website live with real clients, update the following marked placeholder values:

- [ ] **Business Name (`config/business.php` and `.env`)**:
  - Replace `BUSINESS_NAME="[BUSINESS_NAME]"` with your official studio or consulting practice name.
- [ ] **Business Email (`.env`)**:
  - Replace `BUSINESS_EMAIL="hello@[YOURDOMAIN].com"` with your actual business mailbox.
- [ ] **WhatsApp Number (`.env`)**:
  - Replace `BUSINESS_WHATSAPP="+62812345678901"` with your international WhatsApp phone number (with country code).
- [ ] **Admin Credentials (`.env`)**:
  - Replace `ADMIN_EMAIL=admin@example.com` and `ADMIN_PASSWORD=changeme123!` with a secure password before seeding or running in production.
- [ ] **Mail Server Credentials (`.env`)**:
  - Configure `MAIL_MAILER=smtp`, `MAIL_HOST`, `MAIL_USERNAME`, and `MAIL_PASSWORD` (e.g. Mailgun, Postmark, or SMTP) to deliver inquiry notification and confirmation emails.
- [ ] **Portfolio Case Studies (`database/seeders/PortfolioSeeder.php` or Admin Portal)**:
  - Replace `[CLIENT_NAME]` with real client studio names (or anonymous descriptors like "Indie Obby Studio").
  - Replace `[PROJECT_RESULT]` percentages and numbers with verified outcomes.
- [ ] **Legal Entity Address (`.env` or `config/business.php`)**:
  - Update `BUSINESS_ADDRESS="Indonesia"` with your city or registered business location.
