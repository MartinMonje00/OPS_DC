FROM node:20-alpine AS builder

WORKDIR /app/ops_dc

RUN npm config set strict-ssl false

COPY ops_dc/package*.json ./

RUN npm ci

COPY ops_dc/ .

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npx ng build --configuration production

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/ops_dc/www /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]