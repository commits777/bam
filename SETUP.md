# BAM! — Deploy to getbam.fun

Complete guide for deploying to Vercel with a Neon PostgreSQL database.

---

## Prerequisites

- GitHub account
- Vercel account (vercel.com — free)
- Neon account (neon.tech — free)
- Google Cloud Console access (for Google OAuth)
- GitHub Developer Settings access (for GitHub OAuth)

---

## Step 1 — Database (Neon)

1. Go to https://console.neon.tech and create a new project named `bam`
2. Choose region: **Europe West** (closest to Athens)
3. Once created, click **Connection string** → select **Prisma** from the dropdown
4. You'll see two URLs — copy both:
   - **DATABASE_URL** — the pooled connection (ends with `pgbouncer=true`)
   - **DIRECT_URL** — the direct connection (no pgbouncer)

---

## Step 2 — Generate auth secret

Run in PowerShell:
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```
Save the output as `AUTH_SECRET`.

---

## Step 3 — Google OAuth

1. Go to https://console.cloud.google.com/apis/credentials
2. Create project → Create Credentials → OAuth client ID → Web application
3. Authorized redirect URIs — add **both**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://getbam.fun/api/auth/callback/google`
4. Copy Client ID → `AUTH_GOOGLE_ID`
5. Copy Client Secret → `AUTH_GOOGLE_SECRET`

---

## Step 4 — GitHub OAuth

1. Go to https://github.com/settings/developers → New OAuth App
2. Homepage URL: `https://getbam.fun`
3. Authorization callback URL: `https://getbam.fun/api/auth/callback/github`
4. Copy Client ID → `AUTH_GITHUB_ID`
5. Generate a Client Secret → `AUTH_GITHUB_SECRET`

---

## Step 5 — Push to GitHub

```powershell
cd C:\Users\ian39\bam

git add .
git commit -m "BAM! Phase 1 platform"

# Create a repo on GitHub (github.com/new), then:
git remote add origin https://github.com/YOUR_USERNAME/bam.git
git push -u origin master
```

---

## Step 6 — Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your `bam` GitHub repo
3. Framework: **Next.js** (auto-detected)
4. **Before clicking Deploy**, open Environment Variables and add all of these:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Neon pooled URL from Step 1 |
| `DIRECT_URL` | Neon direct URL from Step 1 |
| `AUTH_SECRET` | Generated in Step 2 |
| `AUTH_GOOGLE_ID` | From Step 3 |
| `AUTH_GOOGLE_SECRET` | From Step 3 |
| `AUTH_GITHUB_ID` | From Step 4 |
| `AUTH_GITHUB_SECRET` | From Step 4 |
| `ADMIN_EMAIL` | Your email address |
| `NEXTAUTH_URL` | `https://getbam.fun` |

5. Click **Deploy**. First deploy runs `prisma migrate deploy` — this creates all the database tables automatically.

---

## Step 7 — Add custom domain (getbam.fun)

1. In Vercel → your project → **Settings** → **Domains**
2. Add `getbam.fun` and `www.getbam.fun`
3. Vercel shows you DNS records to add. In your domain registrar (wherever you bought getbam.fun):
   - Add an **A record**: `@` → Vercel's IP (shown in dashboard)
   - Add a **CNAME record**: `www` → `cname.vercel-dns.com`
4. DNS propagation takes 5–30 minutes. Vercel auto-provisions SSL.

---

## Step 8 — Verify everything works

1. Visit https://getbam.fun — the landing page should load
2. Visit https://getbam.fun/discover — map with venues
3. Sign in at https://getbam.fun/auth/signin with the email you set as `ADMIN_EMAIL`
4. Visit https://getbam.fun/admin — you should see the admin dashboard

---

## Admin dashboard — what you can do

URL: **getbam.fun/admin** (requires sign-in with your admin email)

**Users tab:**
- See every registered user, their join date, save count
- Search by name or email
- Promote/demote users between `user` and `admin` roles (click their role badge)

**Venues tab:**
- See which venues are being saved most
- Ranked by save count — useful for knowing which venues have the most interest

**Adding/editing venues:**
Venues are in `src/lib/venues.ts`. Edit the file, push to GitHub, Vercel auto-redeploys in ~30 seconds.

---

## Local development (after database migration)

1. Update `.env.local` with your Neon URLs
2. Run `npx prisma db push` to sync schema to Neon
3. `npm run dev`

---

## Future: adding a Mapbox token

The map currently uses CartoDB (free, no API key). When you upgrade to Mapbox:
1. Get a token from https://mapbox.com
2. Add `NEXT_PUBLIC_MAPBOX_TOKEN="pk...."` to Vercel env vars
3. Update `src/components/map-view.tsx`
