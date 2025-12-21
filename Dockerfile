FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and prisma schema (needed for postinstall)
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (runs prisma generate via postinstall)
RUN npm ci

# Copy remaining source code
COPY . .

# Build production app
RUN npm run build

# Expose port (matches railway.toml internalPort)
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Start production server
CMD ["npm", "start"]
