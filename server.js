import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT) || 3000;
const here = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const contactToEmail = process.env.CONTACT_TO_EMAIL || 'kaindaperpetua@gmail.com';
const contactFromEmail = process.env.CONTACT_FROM_EMAIL || 'Perpetua Kilemi <onboarding@resend.dev>';

// Lightweight security headers without adding another dependency.
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json({ limit: '12kb', strict: true }));

// Restrict cross-origin API access to local development and the configured live site.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const localOrigins = isProduction ? [] : [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
  ];
  const allowedOrigins = new Set([...localOrigins, process.env.FRONTEND_ORIGIN].filter(Boolean));

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Small in-memory limit for the public contact endpoint. For multi-instance
// production deployments, replace this with a shared store (e.g. Redis).
const contactAttempts = new Map();
function contactRateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip;
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 5;
  const recent = (contactAttempts.get(key) || []).filter(time => now - time < windowMs);
  if (recent.length >= maxRequests) {
    return res.status(429).json({ error: 'Too many messages submitted. Please try again in a few minutes.' });
  }
  recent.push(now);
  contactAttempts.set(key, recent);
  next();
}

const portfolio = {
  name: 'Perpetua Kilemi',
  role: 'Full-Stack Developer | Technology, Data & Digital Innovation | BBIT Graduate',
  api_status: 'online',
  stack: ['Python', 'JavaScript', 'SQL', 'React', 'Node.js', 'Express.js', 'Pandas', 'KNIME', 'Moodle LMS', 'Git', 'GitHub'],
  projects: [
    {
      id: 'coffee-recommender',
      name: 'Coffee Shop Equipment Recommendation System',
      category: 'DATA-DRIVEN WEB APP',
      description: 'A data-driven Flask application that explores associations in coffee-shop equipment data and turns discovered item relationships into equipment recommendations.',
      problem: 'Help a coffee-shop decision-maker explore equipment items that appear together in the available transaction data.',
      contribution: 'Applied Apriori association-rule mining and evaluated generated rules using support, confidence and lift. The exact dataset description and quantitative results should be added from the project report or repository.',
      technologies: ['Python', 'Flask', 'Pandas', 'MLxtend', 'Apriori'],
      repository: 'https://github.com/145449-kilemi/coffee-recommender',
      kind: 'backend',
    },
    {
      id: 'healthre',
      name: 'HealthRE',
      category: 'HEALTH TECH · ACADEMIC PROJECT',
      description: 'An academic healthcare web application built with PHP and MySQL, combining web interfaces with database-backed workflows.',
      problem: 'Provide a structured web application for healthcare-related information and workflows.',
      contribution: 'Developed as an academic project using PHP, MySQL, HTML and CSS. Further feature-level claims are intentionally omitted until the project documentation is reviewed.',
      technologies: ['PHP', 'MySQL', 'HTML', 'CSS'],
      repository: 'https://github.com/145449-kilemi/HealthRE',
      kind: 'backend',
    },
    {
      id: 'go-dashboard',
      name: 'Go + Gin Real-Time Dashboard Toolkit',
      category: 'GO · REAL-TIME DATA · DASHBOARD',
      description: 'A Go and Gin web application featuring a dynamic dashboard, API-backed forms, Chart.js visualisations, live updates through Server-Sent Events and session-based authentication.',
      problem: 'Bring dashboard data and interactive workflows together with live updates in a single web application.',
      contribution: 'Implemented a Go/Gin backend, PostgreSQL integration, Chart.js visualisations, Server-Sent Events and session-based authentication.',
      technologies: ['Go', 'Gin', 'PostgreSQL', 'Chart.js', 'SSE', 'bcrypt'],
      repository: 'https://github.com/145449-kilemi/go-hello-world',
      kind: 'backend',
    },
  ],
};

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/portfolio', (_req, res) => res.json(portfolio));

app.post('/api/contact', contactRateLimit, async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Enter your name (2–100 characters).' });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (message.length < 10 || message.length > 4000) {
    return res.status(400).json({ error: 'Write a message between 10 and 4,000 characters.' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: `Email delivery is not configured yet. Please email ${contactToEmail} directly.`, fallbackEmail: contactToEmail });
  }

  const escapeHtml = value => value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: contactFromEmail,
        to: [contactToEmail],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      }),
    });
    if (!response.ok) return res.status(502).json({ error: `Email delivery failed. Please try again or email ${contactToEmail} directly.`, fallbackEmail: contactToEmail });
    const result = await response.json();
    return res.json({ message: 'Thanks — your message has been sent.', id: result.id });
  } catch {
    return res.status(502).json({ error: `Could not reach the email service. Please try again or email ${contactToEmail} directly.`, fallbackEmail: contactToEmail });
  }
});

if (isProduction) {
  app.use(express.static(path.join(here, 'dist')));
  app.get('*', (_req, res) => res.sendFile(path.join(here, 'dist', 'index.html')));
}

app.use((error, _req, res, _next) => {
  if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'Request is too large.' });
  if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'Invalid JSON request body.' });
  console.error(error);
  return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

app.listen(port, () => console.log(`Portfolio API listening on port ${port}`));
