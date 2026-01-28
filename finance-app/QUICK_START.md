# 🚀 Quick Start Guide - Finance Manager

Panduan cepat untuk menjalankan aplikasi dalam 5 menit!

## ⚡ Setup Cepat

### 1. Persiapan Database (1 menit)

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE finance_app;

# Keluar
\q

# Import schema
cd backend
psql -U postgres -d finance_app -f init.sql
```

### 2. Install & Run Backend (2 menit)

```bash
# Install dependencies
cd backend
npm install

# Edit .env jika perlu (sesuaikan password PostgreSQL)
# Jalankan server
npm start
```

✅ Backend berjalan di: http://localhost:5000

### 3. Install & Run Frontend (2 menit)

```bash
# Buka terminal baru
cd frontend
npm install

# Jalankan aplikasi
npm start
```

✅ Frontend berjalan di: http://localhost:3000

## 🎉 Selesai!

Aplikasi sudah siap digunakan. Buka browser dan akses: http://localhost:3000

## 📝 Login Pertama

1. Klik tab **Register**
2. Isi data:
   - Username: `admin`
   - Password: `admin123`
   - Nama: `Admin`
   - Email: `admin@example.com`
3. Klik **Register**
4. Login dengan kredensial yang sama

## 💡 Tips

- Gunakan akun demo untuk testing
- Tambahkan beberapa transaksi untuk melihat grafik
- Coba filter per bulan untuk melihat perubahan data

## ❗ Troubleshooting

**Database error?**
```bash
# Pastikan PostgreSQL running
sudo service postgresql start  # Linux
brew services start postgresql # Mac
```

**Port sudah digunakan?**
- Edit PORT di `.env` backend/frontend
- Atau matikan aplikasi yang menggunakan port tersebut

**Module not found?**
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

## 🔧 Konfigurasi Default

**Backend:**
- Port: 5000
- Database: finance_app
- User: postgres

**Frontend:**
- Port: 3000
- API URL: http://localhost:5000/api

Untuk konfigurasi lebih lanjut, lihat [README.md](README.md)
