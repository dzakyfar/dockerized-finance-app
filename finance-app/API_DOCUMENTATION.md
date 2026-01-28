# 📡 API Documentation - Finance Manager

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

Semua endpoint kecuali login dan register memerlukan token JWT di header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123",
  "full_name": "John Doe",
  "email": "john@example.com"
}
```

**Response Success (201):**
```json
{
  "message": "Registrasi berhasil",
  "user": {
    "id": 1,
    "username": "johndoe",
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response Error (400):**
```json
{
  "error": "Username sudah digunakan"
}
```

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response Error (401):**
```json
{
  "error": "Username atau password salah"
}
```

---

## Categories Endpoints

### 3. Get All Categories

**Endpoint:** `GET /categories`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
[
  {
    "id": 1,
    "name": "Belanja",
    "icon": "🛒",
    "color": "#3B82F6"
  },
  {
    "id": 2,
    "name": "Pendidikan",
    "icon": "📚",
    "color": "#8B5CF6"
  },
  {
    "id": 3,
    "name": "Transportasi",
    "icon": "🚗",
    "color": "#10B981"
  },
  {
    "id": 4,
    "name": "Makanan",
    "icon": "🍔",
    "color": "#F59E0B"
  },
  {
    "id": 5,
    "name": "Hiburan",
    "icon": "🎮",
    "color": "#EF4444"
  }
]
```

---

## Expenses Endpoints

### 4. Get User Expenses

**Endpoint:** `GET /expenses`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `month` (optional): Bulan (1-12)
- `year` (optional): Tahun (contoh: 2024)

**Example:** `GET /expenses?month=12&year=2024`

**Response Success (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "category_id": 1,
    "amount": "150000.00",
    "description": "Belanja bulanan",
    "date": "2024-12-15",
    "created_at": "2024-12-15T10:30:00.000Z",
    "category_name": "Belanja",
    "icon": "🛒",
    "color": "#3B82F6"
  },
  {
    "id": 2,
    "user_id": 1,
    "category_id": 4,
    "amount": "50000.00",
    "description": "Makan siang",
    "date": "2024-12-14",
    "created_at": "2024-12-14T12:00:00.000Z",
    "category_name": "Makanan",
    "icon": "🍔",
    "color": "#F59E0B"
  }
]
```

---

### 5. Add Expense

**Endpoint:** `POST /expenses`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "category_id": 1,
  "amount": 150000,
  "description": "Belanja bulanan",
  "date": "2024-12-15"
}
```

**Response Success (201):**
```json
{
  "message": "Pengeluaran berhasil ditambahkan",
  "expense": {
    "id": 1,
    "user_id": 1,
    "category_id": 1,
    "amount": "150000.00",
    "description": "Belanja bulanan",
    "date": "2024-12-15",
    "created_at": "2024-12-15T10:30:00.000Z"
  }
}
```

**Response Error (400):**
```json
{
  "error": "Kategori, jumlah, dan tanggal wajib diisi"
}
```

---

### 6. Update Expense

**Endpoint:** `PUT /expenses/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "category_id": 2,
  "amount": 200000,
  "description": "Update deskripsi",
  "date": "2024-12-15"
}
```

**Response Success (200):**
```json
{
  "message": "Pengeluaran berhasil diupdate",
  "expense": {
    "id": 1,
    "user_id": 1,
    "category_id": 2,
    "amount": "200000.00",
    "description": "Update deskripsi",
    "date": "2024-12-15",
    "created_at": "2024-12-15T10:30:00.000Z"
  }
}
```

**Response Error (404):**
```json
{
  "error": "Pengeluaran tidak ditemukan"
}
```

---

### 7. Delete Expense

**Endpoint:** `DELETE /expenses/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "message": "Pengeluaran berhasil dihapus"
}
```

**Response Error (404):**
```json
{
  "error": "Pengeluaran tidak ditemukan"
}
```

---

## Statistics Endpoints

### 8. Get Statistics by Category

**Endpoint:** `GET /statistics/by-category`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `month` (optional): Bulan (1-12)
- `year` (optional): Tahun (contoh: 2024)

**Example:** `GET /statistics/by-category?month=12&year=2024`

**Response Success (200):**
```json
[
  {
    "id": 1,
    "name": "Belanja",
    "icon": "🛒",
    "color": "#3B82F6",
    "total": "500000.00"
  },
  {
    "id": 2,
    "name": "Pendidikan",
    "icon": "📚",
    "color": "#8B5CF6",
    "total": "0.00"
  },
  {
    "id": 3,
    "name": "Transportasi",
    "icon": "🚗",
    "color": "#10B981",
    "total": "200000.00"
  },
  {
    "id": 4,
    "name": "Makanan",
    "icon": "🍔",
    "color": "#F59E0B",
    "total": "350000.00"
  },
  {
    "id": 5,
    "name": "Hiburan",
    "icon": "🎮",
    "color": "#EF4444",
    "total": "150000.00"
  }
]
```

---

### 9. Get Total Expenses

**Endpoint:** `GET /statistics/total`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `month` (optional): Bulan (1-12)
- `year` (optional): Tahun (contoh: 2024)

**Example:** `GET /statistics/total?month=12&year=2024`

**Response Success (200):**
```json
{
  "total": 1200000
}
```

---

## 🔒 Error Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Token tidak valid/tidak ada |
| 403 | Forbidden - Token expired |
| 404 | Not Found - Resource tidak ditemukan |
| 500 | Internal Server Error - Error server |

---

## 📝 Notes

1. Semua response dengan status error akan memiliki format:
   ```json
   {
     "error": "Pesan error"
   }
   ```

2. Token JWT memiliki masa berlaku 7 hari

3. Semua amount dalam format decimal dengan 2 angka di belakang koma

4. Tanggal menggunakan format ISO 8601: `YYYY-MM-DD`

5. Setiap user hanya bisa mengakses data miliknya sendiri

---

## 🧪 Testing dengan cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","full_name":"Test User","email":"test@example.com"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

### Add Expense (dengan token)
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"category_id":1,"amount":50000,"description":"Test expense","date":"2024-12-15"}'
```

### Get Statistics
```bash
curl -X GET "http://localhost:5000/api/statistics/by-category?month=12&year=2024" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
