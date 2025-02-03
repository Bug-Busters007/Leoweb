# 1. Build Angular App
FROM node:20 AS build

WORKDIR /app

COPY leoweb.client/package.json leoweb.client/package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --prod

FROM nginx:1.25

COPY leoweb.client/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/leoweb.client /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
