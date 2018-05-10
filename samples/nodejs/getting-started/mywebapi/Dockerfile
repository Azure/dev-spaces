FROM node
EXPOSE 80
ENV PORT 80

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]
