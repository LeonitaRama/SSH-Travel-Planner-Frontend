# Faza 1: Build i kodit React/Vite
FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Faza 2: Shërbimi i skedarëve me Nginx
FROM nginx:alpine

# Kopjojmë skedarët e gjeneruar nga Vite te folderi i Nginx-it
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Ekspozojmë portën standarde të Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]