# -------- Build Stage --------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all deps (including dev for build)
RUN npm install

# Copy source code
COPY . .

# Build TS
RUN npm run build


# -------- Runtime Stage --------
FROM node:18-alpine

WORKDIR /app

# Copy only package.json & lock file for prod deps
COPY package*.json ./

# Install only production deps
RUN npm install --only=production

# Copy dist from builder
COPY --from=builder /app/dist ./dist

# Expose backend port
EXPOSE 8000

# Run compiled server
CMD ["node", "dist/server.js"]
