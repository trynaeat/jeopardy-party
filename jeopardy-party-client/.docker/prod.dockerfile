FROM node:14 as builder

RUN mkdir /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

FROM nginx as production
EXPOSE 80

RUN mkdir /app
COPY --from=builder /usr/src/app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
