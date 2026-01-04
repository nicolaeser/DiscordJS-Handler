# Build Stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies (including devDependencies for building)
RUN npm install

COPY . .

# Set dummy DATABASE_URL for prisma generate
ENV DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
# Generate Prisma client
RUN npx prisma generate

# Build the project
RUN npm run build

# Ensure dist/pg exists and copy Prisma engine and schema
RUN mkdir -p dist/pg && \
    (cp src/pg/schema.prisma dist/pg/ || cp prisma/schema.prisma dist/pg/) && \
    cp src/pg/libquery_engine* dist/pg/ || true

# Remove devDependencies to keep image small
RUN npm prune --production

# Runtime Stage
FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
# Copy prisma folder if needed for migrations in start script
COPY --from=builder /usr/src/app/prisma ./prisma 

ENV NODE_ENV=production

# Start the bot
CMD ["npm", "start"]
