# Pakai base image Node.js versi LTS (Long Term Support)
FROM node:18

# Buat direktori kerja di container
WORKDIR /app

# Copy file package.json dan package-lock.json (kalau ada)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file project ke folder kerja container
COPY . .

# Biar container expose port 8080 (buat keep_alive.js)
EXPOSE 8080

# Jalankan bot lo (ganti index.js dengan nama file utama bot kalau beda)
CMD ["node", "index.js"]