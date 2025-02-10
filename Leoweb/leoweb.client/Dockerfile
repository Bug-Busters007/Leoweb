FROM node:latest AS build-stage

WORKDIR /app/leoweb.client

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/leoweb.client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
