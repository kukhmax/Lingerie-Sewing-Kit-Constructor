# Этап 1: сборка интерфейса
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Этап 2: запуск. Серверу-заглушке нужен только Node.js, без зависимостей
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY --from=build /app/dist ./dist
COPY mock-server ./mock-server
USER node
EXPOSE 8080
CMD ["node", "mock-server/server.mjs"]
