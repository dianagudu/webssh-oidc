FROM node:16-buster-slim

WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY build /app/build
COPY server.js /app/server.js

EXPOSE 8444

CMD ["node", "-r", "dotenv/config", "./server.js"]