# Deploy Frontend to Vercel

## Prerequisites
- [Vercel](https://vercel.com) account (log in with GitHub)
- GitHub repo already connected (`fitrimahadzir/od-hunt-live`)

## Steps

### 1. Import project
1. Go to https://vercel.com/new
2. Import the `fitrimahadzir/od-hunt-live` repository
3. **Root Directory**: Select `frontend/` (or leave blank — `vercel.json` will auto-detect)
4. **Framework**: Vite (auto-detected)
5. **Build Command**: `npm run build` (auto-detected from `vercel.json`)
6. **Output Directory**: `dist` (auto-detected from `vercel.json`)

### 2. Set environment variables
| Variable | Value |
|----------|-------|
| `VITE_BACKEND_URL` | `https://odd-hunt-backend.onrender.com` (Render URL, after backend deployed) |

### 3. Deploy
1. Click **Deploy**
2. Wait for build to complete
3. You'll get a URL like `https://odd-hunt-live.vercel.app`

### 4. Custom domain (optional)
1. Go to project settings → Domains
2. Add your custom domain

## Notes
- `vercel.json` at the project root handles routing and root directory config
- No additional config needed — Vite SPA rewrites are already in `vercel.json`
- After backend is deployed, update `VITE_BACKEND_URL` in Vercel project settings if needed
