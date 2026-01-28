#!/bin/bash

echo "🚀 Finance Manager - Auto Setup Script"
echo "========================================"
echo ""

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fungsi untuk print dengan warna
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Cek apakah Node.js terinstall
if ! command -v node &> /dev/null; then
    print_error "Node.js tidak ditemukan. Silakan install Node.js terlebih dahulu."
    exit 1
fi
print_success "Node.js terinstall: $(node --version)"

# Cek apakah PostgreSQL terinstall
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL tidak ditemukan. Silakan install PostgreSQL terlebih dahulu."
    exit 1
fi
print_success "PostgreSQL terinstall"

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

cd ..

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🗄️  Database Setup"
echo ""
echo "Silakan masukkan informasi PostgreSQL Anda:"
read -p "PostgreSQL username [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "PostgreSQL password: " DB_PASSWORD
echo ""

# Coba membuat database
echo ""
echo "Membuat database finance_app..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -c "CREATE DATABASE finance_app;" 2>/dev/null

if [ $? -eq 0 ]; then
    print_success "Database finance_app created"
else
    print_warning "Database mungkin sudah ada atau gagal dibuat"
fi

# Import schema
echo "Importing database schema..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d finance_app -f backend/init.sql

if [ $? -eq 0 ]; then
    print_success "Database schema imported"
else
    print_error "Failed to import schema"
    exit 1
fi

# Update .env file
echo ""
echo "Updating backend .env file..."
cat > backend/.env << EOF
PORT=5000
DB_USER=$DB_USER
DB_HOST=localhost
DB_NAME=finance_app
DB_PASSWORD=$DB_PASSWORD
DB_PORT=5432
JWT_SECRET=finance-app-secret-key-2024
EOF
print_success "Backend .env updated"

echo ""
echo "=========================================="
print_success "Setup completed successfully!"
echo "=========================================="
echo ""
echo "🎉 Aplikasi siap digunakan!"
echo ""
echo "Untuk menjalankan aplikasi:"
echo ""
echo "1️⃣  Terminal 1 - Backend:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2️⃣  Terminal 2 - Frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "Aplikasi akan berjalan di: http://localhost:3000"
echo ""
