# OleaD Board (ODB) – Executive Dev Cockpit

> **Projektni moto:** *CODEX NON VERBA*  
> **Verzija:** 2.1.0 (V2.1 Release)  
> **Autor & Vlasnik:** Ivo Cetinić, OleaD  
> **Infrastruktura:** Node.js lokalno / Docker & Coolify na MyDataKnox VPS  

---

## 🎯 1. Sažetak i vizija projekta
**OleaD Board (ODB)** je interni operativni dashboard (Executive Dev Cockpit) namijenjen svakodnevnom praćenju statusa projekata, radnih sati, faza isporuke, migracija na VPS/kontejnere i financijskih ciljeva naplate obrtničke i razvojne djelatnosti OleaD.

Sustav uklanja jutarnju neodlučnost i fragmentiranost zadataka pružanjem trenutnog vizualnog uvida u prioritete dana i tjedna kroz interaktivne pločice (*Project Tiles*), raspodjelu rada između uređaja (💻 Laptop vs 🖥️ Radna stanica), financijski status naplate i **dedicirane stranice za svaki projekt (`/projects/[id]`)** za sve tehničke bilješke i praćenje radnih sati.

---

## 🛠️ 2. Arhitektura i Tehnološki stog

| Sloj | Tehnologija | Uloga i prednosti |
| :--- | :--- | :--- |
| **Frontend & Backend** | **Next.js 16 (App Router, React 19)** | Server Components za brzinu i performanse, Server Actions za direktne mutacije baze bez REST overheada. |
| **Baza podataka & ORM** | **SQLite + Prisma ORM** | Lokalna datotečna baza (`dev.db`), nula latencije, 100% prenosivo bez vanjskih servisa. |
| **Stiliziranje & UI** | **Tailwind CSS + Lucide Icons** | Svijetla (Light Mode) profesionalna OleaD estetika visoke čitljivosti, prilagođena uredskom dnevnom radu. |
| **Infrastruktura & Deploy** | **Docker & Coolify (VPS)** | Multi-stage Dockerfile spreman za produkcijski VPS deploy na MyDataKnox okolinu. |

---

## 🚀 3. Ključne funkcionalnosti sustava (V2.1)

### 📊 1. Čista jutarnja traka i filtriranje (Zero noise)
- **Top KPI Traka:** Hitno Danas, Sati / Tjedan, Isporuka (>75%), VPS Stog.
- **Fokusirana jutarnja traka filtera:**
  `Svi (17)` | `🔥 Hitno Danas (3)` | `💻 Laptop (4)` | `🚀 Coolify (5)` | `📦 VPS (8)` | `🌐 Totohost (9)` | `💶 Neplaćeno (6)` | `📦 Arhiva`
- **Jedna raketa:** CI/CD prikazan čistim bedžem `🚀 Coolify CI/CD` bez dvostrukih ikona ili šuma.

### 🗂️ 2. Vizualni prikaz pločica (*Project Tiles*)
Svaka pločica na dashboardu sadrži:
- **Domena & Klijent:** Klikom na naziv otvara se dedicirana stranica projekta (`/projects/[id]`), a vanjski link vodi direktno na web.
- **Hosting Prekidač:** `[ 📦 VPS ]` (zeleno) ili `[ 🌐 Totohost ]` (plavo) s 1-klik prebacivanjem.
- **Status Naplate:** `[ ✅ PLAĆENO ]` (zeleno) ili `[ ⚠️ NIJE PLAĆENO ]` (narančasto) s 1-klik prebacivanjem.
- **Radno Okruženje:** `[ 💻 Laptop ]` vs `[ 🖥️ Stanica ]` s 1-klik prebacivanjem.
- **CI/CD Webhook:** `🚀 Coolify Webhook` bedž.
- **Tehničke opaske:** Indikator i brzi link na opaske.
- **Brzi unos sati:** Gumbi `+15m`, `+30m`, `+1h` na svakoj kartici.

### 📄 3. Pojedinačna stranica za svaki projekt (`/projects/[id]`)
Klikom na bilo koji projekt otvara se njegova puna konzola:
- **Header s brzim statusom:**
  - Tipka `← Natrag na Cockpit`.
  - Prekidač `[ VPS | TOTOHOST ]`.
  - Prekidač `[ PLAĆENO / NIJE PLAĆENO ]` + iznos u €.
  - Prekidač radnog mjesta `[ 💻 Laptop | 🖥️ Radna stanica ]`.
  - Prekidač CI/CD statusa `[ 🚀 Coolify Webhook ]`.
  - Faza projekta, prioritet rada i slider dovršenosti (%).
- **Područje za opaske (Technical Notes):**
  - Veliko polje (textarea) s gumbom `💾 Spremi Opaske` za zapisivanje kontejnerskih portova, Coolify UUID-ova, postavki baze i deploy koraka.
  - Brzi gumbi za umetanje formatiranih isječaka.
- **Evidencija radnih sati (Time Tracking):**
  - Ukupno utrošeno vrijeme.
  - Brzi unos (`+15 min`, `+30 min`, `+1 sat`) i detaljni unos s opisom zadatka.
  - Kronološki pregled svih unosa uz mogućnost brisanja.
- **Brzi linkovi:**
  - Live / test domena, Google Doc / Drive specifikacija i Coolify VPS MyDataKnox link.

---

## 🗄️ 4. Model podataka (Prisma Schema)

```prisma
model Project {
  id            String      @id @default(cuid())
  domain        String      // npr. "marcopolosport.com", "oly-bot"
  client        String      // npr. "Marko Polo Sport", "Camp Ponta"
  techStack     String      // npr. "Astro, Payload CMS"
  hosting       String      @default("VPS") // "VPS" ili "TOTOHOST"
  isVps         Boolean     @default(false)
  currentStatus String      // "Joomla -> Astro/Payload migracija. Test aktivan."
  stage         String      @default("IN_PROGRESS") // BACKLOG, IN_PROGRESS, WAITING_VPS, PRODUCTION, MAINTENANCE
  priority      String      @default("NORMAL")      // URGENT, HIGH, NORMAL, LOW
  progress      Int         @default(0)             // 0 - 100 %
  price         Float?      // npr. 650.00
  isPaid        Boolean     @default(false)         // PLAĆENO (true) ili NIJE PLAĆENO (false)
  docUrl        String?     // Link na Google Doc / Drive specifikaciju
  devDevice     String      @default("WORKSTATION") // LAPTOP, WORKSTATION
  hasGitBackup  Boolean     @default(true)
  hasCicd       Boolean     @default(false)         // Webhook s Coolifyjem
  notes         String?     // Markdown / tehničke opaske, UUID, portovi
  isArchived    Boolean     @default(false)
  timeLogs      TimeLog[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model TimeLog {
  id          String      @id @default(cuid())
  projectId   String
  project     Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  hours       Float       // decimalni sati, npr. 1.5
  description String?     // npr. "Konfiguracija Nginx proxyja i SSL certifikata"
  createdAt   DateTime    @default(now())
}

model SystemSetting {
  id        String   @id @default(cuid())
  key       String   @unique      // weekly_hours_target, monthly_revenue_target, vps_server
  value     String
  updatedAt DateTime @updatedAt
}
```

---

## 💻 5. Upute za pokretanje

```bash
# 1. Instalacija ovisnosti
npm install

# 2. Sinkronizacija baze podataka i seed
npm run db:push
npm run db:seed

# 3. Pokretanje lokalnog razvojnog poslužitelja
npm run dev
```
Aplikacija je dostupna na: **[http://localhost:3000](http://localhost:3000)**

---

## 🐳 6. Docker & Coolify Deploy (MyDataKnox VPS)

```bash
docker compose up -d --build
```
- Persistent Volume: `/app/data` (za očuvanje SQLite `dev.db` baze)
- Port: `3000`

---
*© 2026 OleaD. Sva prava pridržana. CODEX NON VERBA.*
