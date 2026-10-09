# Pre-Launch Verification Checklist

This checklist tracks every placeholder and credential that must be finalized with verified values before production deployment and startup verification submission.

---

## 1. Brand Identity & Business Name

- [ ] **Business Name (`[BUSINESS_NAME]`)**:
  - Target key: `BUSINESS_NAME` in `.env` and `.env.example`.
  - Config reference: `config/business.php` (`'name'`).
  - Frontend consumers: `resources/js/Components/Navbar.jsx`, `resources/js/Components/Footer.jsx`, `resources/js/Layouts/AppLayout.jsx`, `resources/js/app.jsx`.
  - Action: Replace placeholder `[BUSINESS_NAME]` with your officially chosen studio or practice name.

---

## 2. Contact Information & Email Domains

- [ ] **Public Business Email (`[EMAIL_PERUSAHAAN]`)**:
  - Target key: `BUSINESS_EMAIL` in `.env` and `.env.example`.
  - Config reference: `config/business.php` (`'email'`).
  - Frontend consumers: Rendered via `isPlaceholderEmail` helper in `resources/js/Components/Footer.jsx`, `resources/js/Pages/Contact.jsx`, `resources/js/Pages/Legal/Privacy.jsx`, and `resources/js/Pages/Legal/Terms.jsx`.
  - Behavior: While value starts with `[`, the email renders as plain text without an active `mailto:` link, and mail systems will never use it as a recipient or sender. Once updated to a real custom domain address (e.g. `hello@yourstudio.com`), the UI automatically converts it into a clickable `mailto:` link.
  
- [ ] **Owner Notification Forwarder**:
  - Target key: `OWNER_NOTIFICATION_EMAIL` in `.env`.
  - Config reference: `config/business.php` (`'owner_notification_email'`).
  - Action: Specify the private mailbox where incoming client inquiries and waitlist signups should be forwarded.

- [ ] **WhatsApp Business Line**:
  - Target keys: `BUSINESS_WHATSAPP` and `BUSINESS_WHATSAPP_DISPLAY` in `.env`.
  - Config reference: `config/business.php` (`'whatsapp_number'`, `'whatsapp_display'`).
  - Action: Confirm that the international number format (`+62...`) is attached to an active WhatsApp business account.

---

## 3. Portfolio Case Studies & Client Permissions

- [ ] **Client Names and Release Authorization**:
  - File: `database/seeders/PortfolioSeeder.php` or Admin Portal (`/admin/portfolio`).
  - Action items:
    - Item 1 (`archipelago-quest`): Obtain written client authorization to display the studio name and engagement metrics, or re-label as an internal architecture prototype.
    - Item 2 (`code-fortress-review`): Obtain client sign-off on technical code review excerpts.
    - Item 3 (`brand-worlds-launch`): Confirm authorization for agency/brand attribution or retain as an anonymized case study.
  - Remove any lingering `[CLIENT_NAME]` or `[PROJECT_RESULT]` placeholder tokens.

---

## 4. Production Mail Infrastructure

- [ ] **SMTP / Mail Provider Configuration**:
  - Target keys in `.env`: `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`.
  - Action: Transition from sandbox credentials to verified domain sending (configure SPF, DKIM, and DMARC DNS records with your DNS provider).

---

## 5. Security & Administrative Credentials

- [ ] **Admin Account**:
  - Target keys: `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.
  - File: `database/seeders/AdminSeeder.php`.
  - Action: Replace default credentials (`admin@example.com` / `changeme123!`) before running `php artisan migrate --force --seed` in production.
  - Notice: Admin sign in route is protected with rate limiting (5 attempts per minute) and excluded from robots and sitemaps via `noindex, nofollow`.

---

## 6. Business Registration & Legal Entity

- [ ] **Registered Address & Jurisdiction**:
  - Target key: `BUSINESS_ADDRESS` in `.env`.
  - Config reference: `config/business.php` (`'address'`).
  - Action: Update generic `"Indonesia"` with your registered city and legal entity details (e.g. city of operation, NIB / business registration if applicable).
