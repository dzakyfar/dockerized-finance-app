# Gunakan image Node.js versi ringan
FROM node:18-alpine

# Set folder kerja
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh kode frontend
COPY . .

# Buka port 3000 (Default React)
EXPOSE 3000

# Jalankan React
CMD ["npm", "start"]