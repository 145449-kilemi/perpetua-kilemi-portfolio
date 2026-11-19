# Perpetua Kilemi — Full-Stack Developer | Technology, Data & Digital Innovation

A responsive personal portfolio built with **React + Vite**, backed by a **Node.js + Express REST API**. It presents professional experience, education and selected projects across web development, data and digital operations.

## What this project demonstrates

- React functional components and hooks (`useState`, `useEffect`)
- Fetching and rendering project data from an Express REST endpoint
- Client-side filtering for selected projects and responsive navigation
- Controlled contact form with client- and server-side validation
- Email delivery through Resend, with API credentials kept on the backend
- Express security headers, CORS allow-listing, JSON size limits and basic rate limiting
- Responsive layout, accessible labels, reduced-motion support and page metadata

## Technology

- React 19, Vite 8 and Lucide React
- Node.js 22.12+ and Express 4
- Plain CSS

**Database note:** this portfolio itself does not connect to PostgreSQL or MySQL. Those technologies are listed only in the context of separate projects where they were used.

## Run locally on Windows

1. Install Node.js 22.12 or newer (Node 22 LTS is recommended).
2. Extract the ZIP and open PowerShell or Command Prompt in the project folder.
3. Install packages:

   ```powershell
   npm install
   ```

4. Copy `.env.example` to a new file named `.env`. The example sets the contact recipient to `kaindaperpetua@gmail.com`. Add your Resend API key to `RESEND_API_KEY` only when you are ready to enable email delivery.
5. Start the backend in terminal one:

   ```powershell
   npm start
   ```

6. Start the React development server in terminal two:

   ```powershell
   npm.cmd run dev
   ```

   `npm.cmd` avoids the PowerShell script execution-policy issue on some Windows computers.

7. Open the Vite URL, normally `http://localhost:5173`. Keep both terminals running.

## Enable the contact form (Resend)

The contact form is wired to deliver messages to **kaindaperpetua@gmail.com**. Email sending remains disabled until you add a valid Resend API key.

1. Create a Resend account at <https://resend.com/> using `kaindaperpetua@gmail.com`.
2. Create an API key at <https://resend.com/api-keys>.
3. Open the `.env` file in the project folder and paste the key after `RESEND_API_KEY=`. Do not add quotes unless Resend specifically instructs you to.
4. For initial testing, keep the sender as `Perpetua Kilemi <onboarding@resend.dev>`. Resend's test sender is restricted; the account's verified email address must be the recipient.
5. Stop and restart the backend (`Ctrl+C`, then `npm start`) so it reads the updated environment file.
6. Submit a test message through the portfolio and check the inbox and spam folder.

For public production use, verify a domain you own in Resend and change `CONTACT_FROM_EMAIL` to an address on that verified domain. Keep `RESEND_API_KEY` private: never put it in `src/`, `index.html`, `VITE_` variables or GitHub. The `.env` file is ignored by Git and is not included in the distributed ZIP. Create it locally from `.env.example`.

If email is not configured, the form explains that and the page provides a direct `mailto:` link to `kaindaperpetua@gmail.com`; it does not pretend that an email was sent.

## API routes

- `GET http://localhost:3000/api/health` — backend health check.
- `GET http://localhost:3000/api/portfolio` — portfolio data as JSON. Seeing raw JSON when opening this endpoint directly is expected; the React website consumes the same endpoint to populate its project cards.
- `POST http://localhost:3000/api/contact` — validates and sends a contact message through Resend.

## Production deployment (recommended: one Node.js web service)

This project is simplest to deploy as **one Node.js service** because Express serves the built React site and the `/api/*` endpoints from the same domain. This avoids unnecessary cross-origin configuration.

On a Node.js hosting provider that supports a persistent web service (for example, Render or Railway), configure:

- **Runtime:** Node.js 22.12 or newer.
- **Build command:** `npm ci && npm run build`
- **Start command:** `npm start`
- **Environment:** `NODE_ENV=production`
- **Port:** let the hosting provider supply `PORT`; the Express server reads it automatically.

Add these environment variables in the hosting provider's private environment-variable settings:

- `CONTACT_TO_EMAIL` — the inbox that should receive website enquiries (currently `kaindaperpetua@gmail.com`).
- `CONTACT_FROM_EMAIL` — after verifying your sending domain in Resend, use a sender such as `Perpetua Kilemi <website@your-verified-domain.com>`. Do not use this example literally; replace it with an address on your verified domain.
- `RESEND_API_KEY` — the private Resend API key. Keep it on the server only.
- `FRONTEND_ORIGIN` — leave unset for a single service serving both the site and API. If the frontend is hosted separately, set this to its exact origin, including `https://` and without a trailing slash.

After deployment, attach your custom website domain in the hosting provider's dashboard and follow that provider's DNS instructions. Wait for HTTPS/SSL provisioning, then test the home page and `/api/health` on the custom domain. Do not guess DNS records: use the exact records supplied by your host.

### Resend production email setup

1. Add your sending domain (or a dedicated sending subdomain) in the Resend dashboard.
2. Copy the DNS records Resend provides into the DNS manager for that domain. Add the records exactly as shown, then wait for Resend to report the domain as **Verified**.
3. If you already use Google Workspace, Microsoft 365 or another email provider for your normal mailbox, do not replace your existing root-domain MX records. Follow Resend's instructions for its sending records and consider using a dedicated sending subdomain.
4. Create a Resend API key and add it as `RESEND_API_KEY` in the hosting provider's server-side environment settings. Do not put it in React code, a `VITE_` variable, GitHub, or a public `.env` file.
5. Set `CONTACT_FROM_EMAIL` to an address on the verified sending domain. Keep `CONTACT_TO_EMAIL` as the inbox where you want to receive enquiries.
6. Redeploy/restart the service after changing environment variables. Submit a real test enquiry and check both the receiving inbox and spam folder, as well as the Resend email logs.

For local testing before verifying your domain, the example sender `Perpetua Kilemi <onboarding@resend.dev>` can be used with Resend's onboarding restrictions; this is not the production sender. Without `RESEND_API_KEY`, the contact endpoint intentionally returns a clear not-configured response and the page provides a direct email fallback instead of claiming that a message was sent.

### Separate frontend and backend (optional)

If you choose different hosting providers, set `VITE_API_URL` at frontend build time to the deployed API base URL (without a trailing slash), and set `FRONTEND_ORIGIN` on the backend to the exact deployed frontend origin. Configure `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` as backend environment variables. The `VITE_API_URL` value is public configuration; never put secrets in any `VITE_` variable.

The public-facing API section explains the Express routes without sending visitors to raw JSON. Its project call-to-action scrolls back to the selected-work cards; the `/api/portfolio` endpoint remains available for developers who want to inspect the data directly.

## Portfolio content accuracy

- Open University of Kenya — External Content Digitizer, May 2025–Present.
- Agricultural Finance Corporation — ICT Attachment (dates not supplied).
- Strathmore University — Bachelor of Business Information Technology, completed 2025.
- Coffee Recommender — Python, Flask, Pandas and MLxtend / Apriori.
- HealthRE — PHP, MySQL, HTML and CSS.
- Go + Gin Real-Time Dashboard Toolkit — [Explore the specific go-hello-world repository](https://github.com/145449-kilemi/go-hello-world), using Go, Gin, PostgreSQL, Chart.js and server-sent events.

The portfolio website is the professional showcase itself, not a separate project card. The selected-work section contains the three separate projects listed above, and each repository link points to its specific source repository. Add live demo links only when a project has actually been deployed.


## Before sharing the Go dashboard repository

Review the public README in the linked Go dashboard repository and remove any demo login credentials from the public documentation. Use disposable demo-only credentials, and never reuse a password from another account. If any published demo password has been reused elsewhere, change it immediately.
