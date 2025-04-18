
# 🧠 Ad Campaign Manager (Fullstack Remix + Supabase App)

This is a minimal, production-style **Ad Campaign Management** app built using **Remix**, **TypeScript**, and **Supabase** — with a focus on clean architecture, atomic design, and real-world features like infinite scroll, modal forms, dynamic routing, and relational data.

> ✅ [View source on GitHub](https://github.com/shashankGS10/ad_client)

---

## ⚙️ Tech Stack

| Layer         | Stack                          |
|---------------|---------------------------------|
| Frontend      | [Remix](https://remix.run/) + TypeScript + TailwindCSS |
| Backend       | Supabase (PostgreSQL, REST, Realtime) |
| Styling       | TailwindCSS |
| State         | `useFetcher` + Local State |
| Data Fetching | Remix loaders + actions |
| Routing       | Nested file-based routes with dynamic params |
| Design Pattern| Atomic design (`components/molecule/`) |
| Deployment    | Works locally with Supabase & Vite |

---

## ✅ Features Implemented

### 🧾 Page 1: `/campaigns` – Campaign List Page

- 📋 Lists all campaigns in a scrollable table
- 🔁 Infinite scroll using IntersectionObserver + Remix loader
- ✏️ Each row supports:
  - **Edit** inline (name, daily budget)
  - **Delete** with confirmation
- ➕ Add Campaign modal
  - Form opens in a modal overlay
  - Fields: `name`, `daily_budget`
  - Validates and creates new campaign via Remix action
- 🔗 Clicking campaign name routes to `/campaigns/:id` using `Link`

---

### 📄 Page 2: `/campaigns/:id` – Campaign Details Page

- 🎯 Loads selected campaign and its associated keywords (one-to-many)
- 🧠 Keywords Table:
  - Shows all keywords for that campaign
  - Each row includes:
    - `text`, `bid`, `match_type`, `state`
    - Delete button
- ➕ Add Keyword modal:
  - Allows adding new keywords for this campaign
  - Fields: `text`, `bid`, `match_type`, `state`
  - Keywords must be unique per campaign (enforced at DB level)
- 🔙 Navigation: Back to `/campaigns`

---

## 🧩 Database Schema (via Supabase)

### `campaigns`

| Field         | Type      | Constraints      |
|---------------|-----------|------------------|
| id            | integer   | Primary Key      |
| name          | string    | Unique, Required |
| daily_budget  | float     | Required         |

### `keywords`

| Field         | Type      | Constraints                             |
|---------------|-----------|-----------------------------------------|
| id            | integer   | Primary Key                             |
| campaign_id   | integer   | FK → campaigns(id), cascade on delete   |
| text          | string    | Unique per campaign (composite key)     |
| bid           | float     | Required                                |
| match_type    | string    | One of: `exact`, `phrase`, `broad`      |
| state         | string    | One of: `enabled`, `disabled`           |

---

## 🐛 Debugging + Fixes Applied

- ✅ Resolved 404 issue on dynamic route `/campaigns/:id` by:
  - Moving `campaigns.tsx` → `campaigns/_index.tsx` to enable nested routing
  - Removing duplicate `index.tsx`
  - Renaming `KeywordTable.tsx.tsx` → `KeywordTable.tsx`
- ✅ Ensured route matching worked with `Link` and Remix's nested `<Outlet />`
- ✅ Confirmed Supabase integration across loader/actions

---

## 🚀 How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/shashankGS10/ad_client
   cd ad_client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up `.env` for Supabase:
   ```env
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Author

**Shashank GS**  
[Portfolio](https://github.com/shashankGS10) · Working on clean, scalable web systems with product-thinking and codecraft.

---