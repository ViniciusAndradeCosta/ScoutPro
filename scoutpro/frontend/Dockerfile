# Estágio 1: Build
FROM node:20-alpine AS build

RUN apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio 2: Servidor Web (Nginx)
FROM nginx:alpine AS production

RUN apk upgrade --no-cache

# AQUI ESTÁ A CORREÇÃO: Mudamos de /app/dist para /app/build
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]