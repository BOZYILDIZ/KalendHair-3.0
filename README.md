# KalendHair v6

SaaS de réservation pour salons de coiffure français — Next.js 15, TypeScript 5 strict, Drizzle ORM, Supabase.

## Stack technique

- **Framework** : Next.js 15 (App Router, Server Actions, PPR)
- **Base de données** : PostgreSQL via Supabase + Drizzle ORM
- **Auth** : NextAuth.js v5 (Credentials + Google)
- **Cache / Idempotence** : Upstash Redis
- **Paiements** : Stripe
- **Jobs** : Trigger.dev (retry exponentiel)
- **Emails** : Resend + React Email
- **Style** : Tailwind CSS v4 + shadcn/ui

## Démarrage

### 1. Prérequis

- Node.js ≥ 22
- pnpm ≥ 10
- Un projet Supabase
- Un compte Upstash Redis

### 2. Installation

```bash
git clone https://github.com/BOZYILDIZ/KalendHair-3.0 kalendhair
cd kalendhair
pnpm install
```

### 3. Variables d'environnement

```bash
cp .env.example .env.local
# Remplissez toutes les variables
```

Variables requises :
- `DATABASE_URL` — URL PostgreSQL Supabase (pooled)
- `AUTH_SECRET` — `openssl rand -hex 32`
- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`

### 4. Base de données

```bash
pnpm db:push      # Crée les tables (développement)
# OU
pnpm db:migrate   # Migrations versionnées (production)
```

### 5. Lancer en développement

```bash
pnpm dev
```

→ [http://localhost:3000](http://localhost:3000)

---

## Architecture

```
src/
├── app/                    # Routes Next.js
│   ├── (auth)/             # Pages publiques (connexion, inscription)
│   ├── (dashboard)/        # Espace pro (protégé)
│   └── api/                # Route handlers (auth, webhooks)
├── features/               # Vertical slices — 1 feature = 1 dossier isolé
│   ├── appointments/       # types · queries · mutations · actions · validations · components
│   ├── auth/               # LoginForm
│   ├── calendar/           # Slots + WeekCalendar
│   ├── clients/
│   ├── connectors/         # Marketplace + silae · pennylane · google-calendar
│   ├── employees/
│   ├── salons/             # Sidebar · Topbar
│   ├── services/
│   └── stats/
└── shared/                 # Partagé entre features (jamais l'inverse)
    ├── auth/               # config · password · session
    ├── db/                 # client · schema
    ├── errors.ts
    └── redis.ts
```

### Règles strictes
- **150 lignes max** par fichier
- **0 import croisé** entre features (`features/A` n'importe jamais depuis `features/B`)
- Les composants reçoivent des **props seulement** (pas d'appels DB directs)
- `queries.ts` = SELECT only — jamais d'INSERT/UPDATE/DELETE
- `mutations.ts` = INSERT/UPDATE/DELETE — jamais utilisé dans les composants

---

## Connecteurs disponibles

| Connecteur       | Catégorie    | Plan     | Fonctionnalités                    |
|------------------|--------------|----------|------------------------------------|
| My Silae         | RH & Congés  | Business | Congés auto-bloqués, absences      |
| Pennylane        | Comptabilité | Business | Factures auto, sync clients        |
| Odoo             | Comptabilité | Business | CRM, facturation, stock            |
| Google Calendar  | Agenda       | Pro      | Sync bidirectionnelle par employé  |
| WhatsApp Business| Communication| Pro      | Rappels & confirmations RDV        |
| Factorial HR     | RH & Congés  | Business | Congés, planning équipe            |

---

## Plans tarifaires

| Plan     | Prix   | Fonctionnalités                              |
|----------|--------|----------------------------------------------|
| Free     | 0€/mois| 1 employé, 30 RDV/mois                      |
| Pro      | 29€/mois| 5 employés, illimité, Google Calendar, WhatsApp |
| Business | 59€/mois| Illimité + tous les connecteurs (Silae, Pennylane, Odoo...) |

---

## Commandes utiles

```bash
pnpm dev          # Développement
pnpm build        # Build production
pnpm db:push      # Sync schéma DB (dev)
pnpm db:studio    # Drizzle Studio (interface DB)
pnpm db:generate  # Générer les migrations
pnpm db:migrate   # Appliquer les migrations
pnpm typecheck    # Vérification TypeScript
pnpm lint         # ESLint
```
