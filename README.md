# LifeVault — Next.js + TypeScript

Personal AI Memory App — Supabase backend bilan.

---

## 📁 Loyiha Tuzilmasi

```
src/
├── app/
│   ├── layout.tsx          ← Root layout (HTML, fonts)
│   └── page.tsx            ← Entry point
├── components/
│   ├── App.tsx             ← Main orchestrator (auth check)
│   ├── layout/
│   │   ├── Navbar.tsx          ← Desktop top nav
│   │   ├── MobileTopbar.tsx    ← Mobile top bar
│   │   └── BottomNav.tsx       ← Mobile bottom nav
│   ├── pages/
│   │   ├── AppScreen.tsx       ← Tab router
│   │   ├── LoginScreen.tsx     ← Login / Register
│   │   ├── HomePage.tsx        ← Home + Chat + Memories
│   │   ├── NotesPage.tsx       ← Notes editor
│   │   ├── MediaPage.tsx       ← Media gallery
│   │   ├── LibraryPage.tsx     ← Kutubxona + Bookshelf
│   │   ├── PortfolioPage.tsx   ← Portfolio / Profile
│   │   └── ChatPage.tsx        ← AI Chat
│   ├── modals/
│   │   └── SettingsModal.tsx   ← Settings popup
│   └── ui/
│       ├── LoadingScreen.tsx   ← Splash screen
│       └── Toast.tsx           ← Notification toast
├── hooks/
│   └── useAppStore.ts      ← Zustand global state
├── lib/
│   ├── supabase.ts         ← Supabase client
│   ├── i18n.ts             ← UZ/EN translations
│   └── data.ts             ← Static mock data
├── types/
│   └── index.ts            ← TypeScript types
└── styles/
    └── globals.css         ← Global CSS + variables
```

---

## 🚀 O'rnatish va Ishga Tushirish

### 1. Node.js o'rnating
Node.js 18+ kerak: https://nodejs.org

### 2. Loyihani oching va paketlarni o'rnating
```bash
cd lifevault
npm install
```

### 3. `.env.local` faylini tekshiring
U allaqachon to'ldirilgan:
```
NEXT_PUBLIC_SUPABASE_URL=https://pkluyoptcmvlhalshqqw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Development serverini ishga tushiring
```bash
npm run dev
```
Brauzerda oching: **http://localhost:3000**

### 5. Production uchun build qiling
```bash
npm run build
npm run start
```

---

## 🗄️ Supabase Sozlash

Supabase dashboard da quyidagi SQL ni ishlatib jadval yarating:

```sql
-- Items table
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'note', 'rasm', 'video', 'achievement', 'skill', 'plan'
  title TEXT,
  content TEXT,
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) yoqing
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own items"
  ON items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', false);

CREATE POLICY "Users can manage own media"
  ON storage.objects FOR ALL
  USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### Google Login qo'shish (ixtiyoriy):
1. Supabase Dashboard → Authentication → Providers → Google
2. Google Cloud Console da OAuth credentials yarating
3. Client ID va Secret ni kiriting

---

## 🌐 Vercel ga Deploy qilish

```bash
# Vercel CLI o'rnating
npm i -g vercel

# Deploy qiling
vercel

# Environment variables qo'shing:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 📦 Ishlatilgan Texnologiyalar

| Tech | Maqsad |
|------|--------|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Supabase** | Auth + Database + Storage |
| **Zustand** | Global state management |
| **CSS Variables** | Theming (dark/light) |

---

## 🔧 Asosiy Buyruqlar

```bash
npm run dev      # Development
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint tekshirish
```
# emro
