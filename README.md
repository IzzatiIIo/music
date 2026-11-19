# MusicUz — Zamonaviy Musiqa UI Ilovasi 🎵

Ushbu loyiha **React**, **Tailwind CSS**, **Axios** va **Maxsus Custom Hooklar** yordamida yaratilgan zamonaviy musiqa portali UI qismidir.

Backend API: `https://music-l8kd.onrender.com`

---

## 🌟 Asosiy Xususiyatlar va Imkoniyatlar

1. **Backend xavfsizligi (.env)**:
   - Backend manzili `.env` faylida `VITE_API_BASE_URL` o'zgaruvchisida saqlangan va `.gitignore` ga qo'shilgan.
2. **Maxsus Custom Hooklar (Custom Hooks)**:
   - `useTheme`: Tungi (Dark) va Kunduzgi (Light) rejimlarni boshqaradi, `localStorage` da saqlaydi va HTML klassini yangilaydi.
   - `useLikes`: Musiqalarga like bosish (yurakcha), optimistik hisoblagich, backend bilan sinxronlash va brauzerda eslab qolish.
   - `useComments`: Har bir musiqa uchun sharhlar (kommentariyalar) yozish, o'chirish, vaqtini hisoblash va saqlash.
   - `useMusic`: Backenddan musiqalarni olish, jonli qidiruv, janrlar bo'yicha saralash, foydalanuvchi tomonidan yangi musiqa qo'shish.
   - `useAudioPlayer`: To'liq audio pleyer (Play/Pause, Seek bar, Ovoz/Mute, Keyingi/Oldingi trek, Loop, Shuffle, Backendga `play` hisobotini yuborish).
3. **Modal oynalar (Modals)**:
   - **Musiqa qo'shish modali**: Foydalanuvchi o'zi xohlagan musiqani audio havola (URL) yoki fayl orqali yuklashi, muqova tanlashi va janr belgilashi mumkin.
   - **Sharhlar (Comments) modali**: Har bir qo'shiq uchun alohida fikr yozish, tezkor emojilar, foydalanuvchi nomi va vaqti bilan sharhlar ro'yxati.
   - **Tizimga kirish (Auth) modali**: Telegram bot (`@cidid_bot`) va telefon raqam orqali avtorizatsiya yoki token kiritish.
4. **Zamonaviy Tailwind CSS Dizayn**:
   - Spotify / Apple Music uslubidagi qulay interfeys.
   - O'zgaruvchan Dark / Light mavzusi (bitta tugma orqali almashadi).
   - Animatsiyali soundwave (ekvalayzer) to'lqinlari.
   - Pastki qismda yopishqoq (sticky glassmorphism) pleyer paneli.
5. **Axios integratsiyasi**:
   - `src/api/axiosClient.js`: Request/Response interceptors, token boshqaruvi va tayyor API xizmatlari.

---

## 🚀 Loyihani Ishga Tushirish

Loyihaning ildiz papkasiga kiring:
```bash
cd "C:\Users\MegaComp\Desktop\Новая папка"
```

Kutubxonalarni o'rnatish (agar o'rnatilmagan bo'lsa):
```bash
npm install
```

Dasturchi rejimida (Dev server) ishga tushirish:
```bash
npm run dev
```

Brauzerda ochish:
```
http://localhost:5173
```

Ishlab chiqarish (Production build) uchun yig'ish:
```bash
npm run build
```

---

## 📁 Loyiha Strukturasi

```
Новая папка/
├── .env                       # Backend API manzili (VITE_API_BASE_URL)
├── .env.example               # Namuna muhit fayli
├── index.html                 # Asosiy HTML, shriftlar va sarlavha
├── package.json               # Bog'liqliklar va skriptlar
├── vite.config.js             # Vite va Tailwind v4 konfiguratsiyasi
└── src/
    ├── api/
    │   └── axiosClient.js     # Axios mijozi va backend so'rovlari
    ├── hooks/
    │   ├── useTheme.js        # Dark / Light rejim custom hooki
    │   ├── useLikes.js        # Like bosish custom hooki
    │   ├── useComments.js     # Sharhlar custom hooki
    │   ├── useMusic.js        # Musiqalar va qidiruv custom hooki
    │   └── useAudioPlayer.js  # Audio pleyer custom hooki
    ├── components/
    │   ├── Navbar.jsx         # Qidiruv, rejim tugmasi va boshqaruv
    │   ├── HeroBanner.jsx     # Tavsiya etilgan TOP musiqa vitrinasi
    │   ├── GenreFilter.jsx    # Janrlar va saralash tugmalari
    │   ├── SongCard.jsx       # Musiqa kartochkasi (Like, Comment, Play)
    │   ├── SongList.jsx       # Musiqalar panjarasi va yuklanish holati
    │   ├── MusicPlayer.jsx    # Pastki pleyer paneli (Seekbar, Ovoz, Tugmalar)
    │   ├── AddSongModal.jsx   # Yangi musiqa qo'shish oynasi
    │   ├── CommentsModal.jsx  # Sharhlar va fikrlar oynasi
    │   └── AuthModal.jsx      # Telegram/Backend kirish oynasi
    ├── utils/
    │   └── formatters.js      # Vaqt va muqova formatlagichlar
    ├── App.jsx                # Asosiy orkestrator komponent
    ├── main.jsx               # React kirish nuqtasi
    └── index.css              # Tailwind CSS v4 va to'lqin animatsiyalari
```
