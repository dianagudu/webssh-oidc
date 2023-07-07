FROM node:16-buster-slim as builder

WORKDIR /app

COPY . /app
RUN npm install
RUN npm run build

FROM node:16-buster-slim as runner

WORKDIR /app

COPY package.json /app/package.json
RUN npm install
RUN npm ci --only=production

COPY --from=builder /app/build /app/build
COPY server.js /app/server.js

EXPOSE 8444

CMD ["node", "-r", "dotenv/config", "./server.js"]