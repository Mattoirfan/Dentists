# Netlify Deployment Guide — Luma Dental Studio

This project is configured and fully optimized for zero-config, 1-click deployment on **Netlify**.

---

## ⚡ Deployment Methods

### Method 1: Deploy via GitHub / GitLab / Bitbucket (Recommended)

1. **Push your code to a Git repository** (e.g. GitHub):
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Luma Dental Studio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/luma-dental-studio.git
   git push -u origin main
   ```

2. **Log in to [Netlify](https://app.netlify.com/)**:
   - Click **"Add new site"** → **"Import an existing project"**.
   - Choose **GitHub** and select your repository.

3. **Verify Build Settings** (Netlify will auto-detect from `netlify.toml`):
   - **Base directory**: *(leave empty)*
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Click "Deploy Site"**:
   - Netlify will build your application and assign an instant live URL (e.g., `https://luma-dental-studio.netlify.app`).

---

### Method 2: Deploy via Netlify CLI (Fastest Terminal Flow)

If you have the Netlify CLI installed:

1. Install the Netlify CLI globally (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. Build the production bundle:
   ```bash
   npm run build
   ```

3. Deploy directly to Netlify:
   ```bash
   netlify deploy --prod --dir=dist
   ```

---

### Method 3: Netlify Drag & Drop (Zero Git Required)

1. Run the local build command:
   ```bash
   npm run build
   ```
2. Log into [Netlify Drop](https://app.netlify.com/drop).
3. Drag the generated **`dist`** folder directly into the browser upload box.
4. Your site is live immediately!

---

## 🛡️ Built-In Netlify Configurations

The project includes:
- **`netlify.toml`**: Configures the build command (`npm run build`), publish directory (`dist`), Node 20 runtime, security headers, and asset caching.
- **`public/_redirects`**: Ensures clean Single-Page Application (SPA) routing so visiting `/services`, `/dentists/dr-elena-rostova`, `/book-appointment`, or `/admin` directly never results in a 404.
- **`src/utils/clientApiBridge.ts`**: Automatically enables client-side localStorage fallback for real-time slot generation, appointment booking, rescheduling, patient portal lookup, and admin management if an external Node.js server is not attached to the Netlify deployment.

---

## 🔑 Practice Staff Credentials on Live Deployment

To access the practice manager dashboard at `/admin`:
- **Username**: `admin`
- **Password**: `luma2026`
