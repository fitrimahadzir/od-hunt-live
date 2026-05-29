# Deploy Backend to Render

## Prerequisites
- [Render](https://render.com) account (log in with GitHub)
- GitHub repo already connected (`fitrimahadzir/od-hunt-live`)

## Steps

### 1. Create a Web Service
1. Go to https://dashboard.render.com/new
2. Select **Web Service**
3. Connect the `fitrimahadzir/od-hunt-live` repository

### 2. Configure the service
| Setting | Value |
|---------|-------|
| **Name** | `odd-hunt-backend` |
| **Root Directory** | (leave empty — use repo root) |
| **Runtime** | Node |
| **Build Command** | `cd backend && npm install && npm run build` |
| **Start Command** | `node backend/dist/server.cjs` |
| **Plan** | Free (or your choice) |

### 3. Set environment variables
| Variable | Value |
|----------|-------|
| `PORT` | `8080` (Render will override this automatically) |
| `CORS_ORIGIN` | `https://odd-hunt-live.vercel.app` (your Vercel frontend URL) |
| `SERVE_STATIC` | (leave unset — defaults to `false`) |

### 4. Deploy
1. Click **Create Web Service**
2. Wait for build & deploy to complete
3. You'll get a URL like `https://odd-hunt-backend.onrender.com`

### 5. After deploy — update frontend
1. Go back to Vercel project settings
2. Set `VITE_BACKEND_URL` to your Render URL (e.g. `https://odd-hunt-backend.onrender.com`)
3. Redeploy the frontend on Vercel

## Notes
- Render supports WebSocket/Socket.IO natively — no extra config needed
- The backend does NOT serve frontend static files in this setup (`SERVE_STATIC` disabled by default)
- Free tier spins down after 15 min of inactivity (first request after idle may take ~30s)
