#!/bin/bash

# ===========================================
# Epitome Kia - Local Development Setup
# ===========================================
# Run this script to set up your local development environment
# Usage: ./scripts/setup.sh

set -e

echo "🚗 Epitome Kia - Development Setup"
echo "==================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher. Current: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check for .env.local
echo ""
echo "📋 Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠ .env.local not found. Creating from template...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local from .env.example${NC}"
    echo -e "${YELLOW}⚠ Please update .env.local with your database URL and other settings${NC}"
else
    echo -e "${GREEN}✓ .env.local exists${NC}"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo ""
echo "🗄️ Setting up database..."
npx prisma generate

# Check if DATABASE_URL is set
if grep -q 'DATABASE_URL="postgresql://user:password' .env.local; then
    echo -e "${YELLOW}⚠ DATABASE_URL appears to be using default values.${NC}"
    echo -e "${YELLOW}  Please update .env.local with your actual database connection string.${NC}"
    echo ""
    echo "  For local PostgreSQL:"
    echo "  DATABASE_URL=\"postgresql://postgres:password@localhost:5432/epitome_kia\""
    echo ""
    echo "  For Railway (get from dashboard):"
    echo "  DATABASE_URL=\"postgresql://postgres:xxx@xxx.railway.app:5432/railway\""
    echo ""
else
    # Try to push schema to database
    echo "Pushing database schema..."
    if npx prisma db push 2>/dev/null; then
        echo -e "${GREEN}✓ Database schema pushed${NC}"

        # Seed the database
        echo ""
        echo "🌱 Seeding database..."
        if npm run db:seed 2>/dev/null; then
            echo -e "${GREEN}✓ Database seeded${NC}"
        else
            echo -e "${YELLOW}⚠ Database seeding failed. You can run it later with: npm run db:seed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Could not connect to database. Please check your DATABASE_URL.${NC}"
    fi
fi

# Generate NEXTAUTH_SECRET if not set
if grep -q 'NEXTAUTH_SECRET="your-secret-key-here"' .env.local; then
    echo ""
    echo "🔐 Generating NEXTAUTH_SECRET..."
    SECRET=$(openssl rand -base64 32)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|NEXTAUTH_SECRET=\"your-secret-key-here\"|NEXTAUTH_SECRET=\"$SECRET\"|g" .env.local
    else
        sed -i "s|NEXTAUTH_SECRET=\"your-secret-key-here\"|NEXTAUTH_SECRET=\"$SECRET\"|g" .env.local
    fi
    echo -e "${GREEN}✓ NEXTAUTH_SECRET generated${NC}"
fi

echo ""
echo "==================================="
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Update .env.local with your database URL (if not done)"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "Useful commands:"
echo "  npm run dev          - Start development server"
echo "  npm run db:studio    - Open Prisma Studio (database GUI)"
echo "  npm run db:seed      - Seed the database"
echo "  npm run build        - Build for production"
echo ""
