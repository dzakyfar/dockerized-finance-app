# 💰 Finance Manager - Aplikasi Manajemen Keuangan

Aplikasi manajemen keuangan pribadi yang lengkap dengan frontend React, backend Node.js/Express, dan database PostgreSQL.

## 🌟 Fitur

### Frontend
- ✅ **Login & Register** - Sistem autentikasi user yang aman
- 📊 **Dashboard Interaktif** - Tampilan overview keuangan
- 🥧 **Grafik Pie Chart** - Visualisasi pengeluaran per kategori
- 📈 **Progress Bar** - Persentase pengeluaran setiap kategori
- 💳 **Manajemen Transaksi** - Tambah, lihat, dan hapus pengeluaran
- 📅 **Filter Bulan/Tahun** - Lihat data berdasarkan periode
- 📱 **Responsive Design** - Tampilan optimal di semua device

### Kategori Pengeluaran
1. 🛒 **Belanja** (Biru)
2. 📚 **Pendidikan** (Ungu)
3. 🚗 **Transportasi** (Hijau)
4. 🍔 **Makanan** (Orange)
5. 🎮 **Hiburan** (Merah)

### Backend
- 🔐 Autentikasi dengan JWT
- 🔒 Password hashing dengan bcryptjs
- 📊 REST API untuk semua operasi
- ✅ Validasi input
- 🛡️ Protected routes

### Database PostgreSQL
- 👤 Tabel Users (username, password, profile)
- 📂 Tabel Categories (kategori pengeluaran)
- 💸 Tabel Expenses (data pengeluaran user)
- 💰 Tabel Income (opsional untuk pendapatan)

## 🚀 Cara Install & Menjalankan

### Prasyarat
- Node.js (v14 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- npm atau yarn

### 1️⃣ Setup Database PostgreSQL

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database baru
CREATE DATABASE finance_app;

# Keluar dari psql
\q
```

### 2️⃣ Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Jalankan SQL untuk membuat tabel
psql -U postgres -d finance_app -f init.sql

# Jalankan server (development)
npm start

# Atau dengan nodemon (auto-reload)
npm run dev
```

Server backend akan berjalan di **http://localhost:5000**

### 3️⃣ Setup Frontend

```bash
# Buka terminal baru, masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan aplikasi
npm start
```

Aplikasi frontend akan berjalan di **http://localhost:3000**

## 🔧 Konfigurasi

### Backend (.env)
```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=finance_app
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=finance-app-secret-key-2024
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user

### Categories
- `GET /api/categories` - Ambil semua kategori

### Expenses
- `GET /api/expenses` - Ambil pengeluaran (dengan filter bulan/tahun)
- `POST /api/expenses` - Tambah pengeluaran baru
- `PUT /api/expenses/:id` - Update pengeluaran
- `DELETE /api/expenses/:id` - Hapus pengeluaran

### Statistics
- `GET /api/statistics/by-category` - Statistik per kategori
- `GET /api/statistics/total` - Total pengeluaran

## 🎨 Teknologi yang Digunakan

### Frontend
- React 18
- Recharts (untuk grafik)
- Axios (HTTP client)
- CSS3 (styling modern)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (autentikasi)
- bcryptjs (password hashing)

## 📱 Cara Menggunakan

1. **Registrasi Akun**
   - Buka aplikasi
   - Klik tab "Register"
   - Isi data (username, password, nama, email)
   - Klik "Register"

2. **Login**
   - Masukkan username dan password
   - Klik "Login"

3. **Tambah Pengeluaran**
   - Di dashboard, klik tombol "+ Tambah Pengeluaran"
   - Pilih kategori
   - Masukkan jumlah, deskripsi, dan tanggal
   - Klik "Simpan"

4. **Lihat Statistik**
   - Grafik pie chart menampilkan distribusi pengeluaran
   - Progress bar menampilkan persentase setiap kategori
   - Pilih bulan/tahun untuk filter data

5. **Hapus Transaksi**
   - Di riwayat transaksi, klik icon 🗑️
   - Konfirmasi penghapusan

## 🗂️ Struktur Project

```
finance-app/
├── backend/
│   ├── db.js              # Konfigurasi database
│   ├── server.js          # Server utama & API routes
│   ├── init.sql           # SQL untuk membuat tabel
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Login.css
    │   │   ├── Dashboard.js
    │   │   └── Dashboard.css
    │   ├── services/
    │   │   └── api.js     # API service
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── .env
```

## 🎯 Fitur Mendatang

- [ ] Export data ke Excel/PDF
- [ ] Grafik tren pengeluaran bulanan
- [ ] Budget setting per kategori
- [ ] Notifikasi budget limit
- [ ] Multi-currency support
- [ ] Mobile app (React Native)

## 🐛 Troubleshooting

### Database connection error
- Pastikan PostgreSQL sudah running
- Cek kredensial di file `.env`
- Pastikan database `finance_app` sudah dibuat

### Port sudah digunakan
- Ubah PORT di `.env` backend
- Atau matikan aplikasi yang menggunakan port 5000/3000

### CORS error
- Pastikan backend sudah running di port 5000
- Cek konfigurasi CORS di `server.js`

## 📄 Lisensi

MIT License - bebas digunakan untuk pembelajaran dan komersial.

## 👨‍💻 Author

Dibuat dengan ❤️ untuk membantu mengelola keuangan pribadi.

---

**Happy Coding! 🚀**
