FROM node:lts-alpine AS builder

WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY . .
ENV PORT 80
EXPOSE 80

CMD ["npm", "start"]