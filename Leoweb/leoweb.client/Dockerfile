# 1. Build Angular App
FROM node:latest AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --prod

FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/leoweb.client /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
