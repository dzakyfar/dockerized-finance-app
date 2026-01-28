-- Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20)
);

-- Insert default categories
INSERT INTO categories (name, icon, color) VALUES
    ('Belanja', '🛒', '#3B82F6'),
    ('Pendidikan', '📚', '#8B5CF6'),
    ('Transportasi', '🚗', '#10B981'),
    ('Makanan', '🍔', '#F59E0B'),
    ('Hiburan', '🎮', '#EF4444');

-- Tabel Expenses (Pengeluaran)
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Income (Pendapatan) - opsional untuk fitur tambahan
CREATE TABLE IF NOT EXISTS income (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    source VARCHAR(100),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_income_user_id ON income(user_id);
