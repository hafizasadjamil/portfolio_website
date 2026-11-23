# Portfolio website

Portfolio of Muhammad Asad Jamil: [asadjamil.tech](https://asadjamil.tech)

| Folder | What it is | Local address |
|---|---|---|
| `frontend` | Public site (React, Vite, Tailwind) | http://localhost:3000 |
| `admin-panel` | Content editor (React, Vite, Tailwind) | http://localhost:3001 |
| `backend` | API (Express, MongoDB) and job scraper (Python) | http://localhost:5000 |

## Run it locally

Needs Node 20 or newer, and Python 3 for the job scraper.

1. Copy `.env.example` to `.env` in each folder and fill it in.
2. In each folder run `npm install`, then:
   - `backend`: `npm run dev`
   - `frontend` and `admin-panel`: `npm start`
3. For the job scraper: `pip install -r backend/scraper/requirements.txt`

If the backend stops with `querySrv ECONNREFUSED`, set `DNS_SERVERS` in `backend/.env`.

## Admin account

`npm run admin` in `backend` creates the admin, or resets the password if the account exists.
There is no public sign-up.

## Tests

`npm test` in `backend`. The tests use an in-memory database.

## Sample data

`npm run seed:sample` adds made-up courses and LeetCode problems. It stops if there is already data.

## Deploy

**Backend:** any host that runs Docker or Node 20+ (Render, Fly.io, a VPS…), with `backend` as the root directory.

- With Docker, the `Dockerfile` installs Node and Python (Python runs the job scraper). Without Docker, run `npm ci --omit=dev` and `npm start`.
- Set `MONGODB_URI`, `JWT_SECRET` and `ADMIN_URL`; see `backend/.env.example` for the rest.
- Uploaded images are lost on redeploy unless the host gives you a persistent disk. Mount it, for example at `/data`, and set `UPLOADS_DIR=/data/uploads`.
- Health check path: `/api/health`

**Frontend and admin panel (Vercel):** one project each, with `frontend` or `admin-panel` as the root directory.
Set `REACT_APP_API_URL` to the backend address, then redeploy. The value is built into the site.
