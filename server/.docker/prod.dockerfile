FROM node:14 as builder

RUN mkdir /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

FROM node:14 as production
WORKDIR /usr/src/app
COPY . .
RUN npm install
COPY --from=builder /usr/src/app/dist /usr/src/app/dist

CMD ["node", "./dist/index.js"]
