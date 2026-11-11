# Amdan.

An anonymous, open database for tech salaries in Pakistan. 

**[Live Site](https://amdanpk.vercel.app)** 
## The What
A minimal, brutally honest ledger of tech compensation. 
* **Anonymous Data Ingestion:** Drop your receipt without signing up.
* **The Market Gap:** Live median calculations contrasting local PKR salaries against converted remote USD/CAD salaries.
* **The Ledger:** A live, auto-scrolling ticker and a flat, anti-corporate receipt feed showing exact specs (YOE, work model, city, currency).

* ## The How (Technical Architecture)
Amdan is built as a lightweight, serverless application prioritizing speed, minimal bloat, and strict data governance.

### Core Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS (v4)
* **Database:** Supabase (PostgreSQL)
* **Deployment:** Vercel

### Data Integrity & Security
* **Row-Level Security (RLS):** The `salary_records` table on Supabase is strictly locked down. Anonymous users only have `INSERT` and `SELECT` privileges.
* **Database-Native Aggregation:** Medians are not calculated on the client. A custom Postgres RPC function (`percentile_cont(0.5)`) computes the exact middle value dynamically based on role filters, keeping the frontend thin.
* **Edge Rate-Limiting:** A Next.js Server Action acts as a proxy between the client and Supabase, intercepting requests and logging `x-forwarded-for` IPs into an in-memory Map to enforce a strict 5-minute cooldown per IP, blocking automated spam scripts.

### Design System
Anti-corporate, financial-paper aesthetic. 
* **Typography:** Oswald (impact metrics), Playfair Display (italic accents), and monospace/sans mixes for raw data.
* **UI Principles:** 1px thin borders, colored pulsing status dots, and complete removal of heavy dashboard blocks in favor of a flat ledger layout.


## The Why
The Pakistani tech market operates in the dark. Engineers, PMs, and designers consistently get lowballed because compensation data is gatekept by HR departments and outdated Glassdoor averages. Averages are mathematically flawed for salaries—one remote worker making $5,000 USD skews the entire local aggregate. 

Amdan exists to expose actual market rates. It relies purely on medians and separates local economies from remote/global economies to give the tech community real leverage in their next negotiation.





---
Built by Ali (QWERTS) for the culture.
