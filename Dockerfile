FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and prisma schema (needed for postinstall)
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (runs prisma generate via postinstall)
RUN npm install

# Copy remaining source code
COPY . .

# Expose port
EXPOSE 3005

# Start dev server
CMD ["npm", "run", "dev", "--", "-p", "3005"]
