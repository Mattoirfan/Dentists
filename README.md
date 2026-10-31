# Luma Dental Studio — Full-Stack Dental Practice Application

A premium, full-stack dental clinic web application designed to attract new patients, build trust, showcase clinical treatments, and convert website visitors into confirmed appointment bookings.

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and an **Express full-stack backend** with file-backed JSON/database persistence, real-time slot computation, atomic double-booking prevention, an interactive patient portal, and an administrative practice management dashboard.

---

## 🌟 Highlights & Features

### 1. Complete Website Pages & Routes
- **Homepage (`/`)**: Announcement bar, cinematic hero with verified credentials, quick appointment booking strip, 6 featured services, interactive Before & After slider, clinician previews, 4-step patient journey, verified technology specifications, patient testimonials, FAQs, location & hours, and final booking CTA.
- **Dental Services Directory (`/services`)**: Filterable directory across 8 dental categories (Preventive, Restorative, Cosmetic, Orthodontics, Dental Implants, Periodontics, Pediatric Dentistry, and Oral Surgery) with real-time text search and consultation actions.
- **Individual Treatment Pages (`/services/:slug`)**: Dynamic detail pages with indications, step-by-step expectations, aftercare instructions, assigned dentists, indicative fee ranges, and dedicated FAQs.
- **Our Dentists (`/dentists`) & Profiles (`/dentists/:slug`)**: Verified registrations (ADA / GDC / State Dental Board), postgraduate qualifications, languages spoken, working shifts, and 1-click booking with specific clinicians.
- **Multi-Step Appointment Booking Engine (`/book-appointment`)**:
  - Step 1: Select Service & view estimated duration.
  - Step 2: Select preferred clinician or "First Available Specialist".
  - Step 3: Select date and available time slot (computed in real-time, factoring in clinician shifts, lunch breaks, and existing bookings).
  - Step 4: Patient contact details, patient status (New vs Returning), comfort requests, and cancellation policy consent.
  - Step 5: Instant booking confirmation with reference code (e.g., `LDS-94218`) and `.ICS` calendar export.
- **Transparent Fee Guide (`/pricing`)**: Fee ranges, insurance accepted, 0% APR financing options, and clinical quotation disclaimers.
- **Patient Information Resource (`/patient-information`)**: First-visit guide, what to bring, evidence-based daily oral hygiene recommendations, children's milestone visits, accessibility features, and downloadable intake forms.
- **Contact Us (`/contact`)**: Practice phone, email, physical address, interactive transit directions, WhatsApp integration, and category-based online enquiry submission.
- **Emergency Dental Care (`/emergency`)**: Urgent triage hotline, emergency first-aid protocols (knocked-out tooth, acute toothache, broken tooth), same-day emergency booking, and emergency room (911/999) hospital warnings.
- **Patient Portal (`/patient-portal`)**: Secure booking lookup by reference and email/phone, status tracking, rescheduling, cancellation, and calendar export.
- **Admin & Practice Management Dashboard (`/admin`)**:
  - Operational KPIs (today's bookings, confirmed count, new patient enquiries).
  - Appointment list and calendar with status updates (`confirmed`, `pending`, `completed`, `cancelled`, `no-show`).
  - Patient enquiry management with response tracking.
  - Treatment catalog and fee editor.
  - Clinician shift schedules and clinic announcement bar editor.
  - Transactional notification delivery audit log.
- **Legal Policies (`/privacy`, `/terms`, `/cancellation-policy`, and custom 404)**.

---

## 🎨 Visual Design System & Branding
- **Color Palette**:
  - Deep Navy: `#112331` / `#183044`
  - Warm White: `#FFFFFF`
  - Soft Ivory: `#F8FAF9`
  - Calm Teal: `#0D9488` / `#14B8A6`
  - Muted Mint: `#E8F6F3`
  - Slate: `#64748B`
- **Typography**: Manrope for bold, modern headings and Inter for body text.
- **Custom SVG Branding**: Scalable vector logo (`public/brand/logo.svg`), dark background logo (`public/brand/logo-white.svg`), and favicon (`public/brand/favicon.svg`).
- **Zero-Pill Discipline**: Unboxed metadata text with elegant `·` dividers and semantic buttons for interactive controls.

---

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons.
- **Backend**: Node.js, Express, tsx.
- **Data Persistence**: File-backed JSON store in `./data/db.json` with transactional locking and conflict validation.
- **SEO & Schema**: Schema.org `Dentist` JSON-LD structured data, OpenGraph, and Twitter Cards configured in `index.html`.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000` with the Vite dev server mounted inside Express.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🔐 Staff & Practice Manager Access

Visit `/admin` on the website to access the clinic administration dashboard.

- **Username**: `admin`
- **Password**: `luma2026`

---

## 📋 Customization for Clients

All clinic information is centralized and editable:
1. **Clinic Name & Details**: Modify `src/data/initialData.ts` or edit directly in `/admin` under "Practice Settings".
2. **Clinicians**: Add, edit, or update dentists and their working days in `initialDentists`.
3. **Services & Pricing**: Modify treatments and fees in `initialServices` or live via the `/admin` dashboard.
4. **Currency**: Switch between `USD ($)`, `GBP (£)`, `EUR (€)`, or `INR (₹)` in `initialClinicSettings.currency`.
