# Gunakan image Node.js versi ringan
FROM node:18-alpine

# Set folder kerja di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json lebih dulu (agar cache optimal)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh sisa kode ke dalam container
COPY . .

# Buka port 5000 (sesuai server.js kamu)
EXPOSE 5000

# Jalankan server
CMD ["node", "server.js"]