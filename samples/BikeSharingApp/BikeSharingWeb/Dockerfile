# STAGE-1: Build application
FROM node:lts-alpine AS builder

WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY . .

# STAGE-2: Copy built file into a new docker
FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app .
ENV PORT 80
EXPOSE 80

CMD ["npm", "start"]