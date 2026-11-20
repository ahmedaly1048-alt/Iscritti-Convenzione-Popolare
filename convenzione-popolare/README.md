# Convenzione Popolare – registration page (Next.js, free hosting)

## 1. Google Sheet (database, free)
1. Create a Google Sheet. **Extensions → Apps Script**, paste `google-apps-script/Code.gs`.
2. Change `SECRET` to a long random string.
3. **Deploy → New deployment → Web app**. Execute as: *Me*. Access: *Anyone*. Copy the `/exec` URL.
4. Re-deploy (New version) any time you edit the script.

## 2. Run locally
```
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

## 3. Deploy on Vercel (free Hobby plan)
Push to GitHub → vercel.com → Import project → add the env variables from `.env.example` → Deploy.
Set `NEXT_PUBLIC_SITE_URL` to the final URL, then redeploy.

## 4. Downloadable list
- Open the Google Sheet → File → Download (.xlsx / .csv), or
- `https://YOUR-SITE/api/export?key=ADMIN_KEY` downloads a CSV.

## 5. Before going live
Fill in `app/privacy/page.js` (owner name, contact email) and have it reviewed.
