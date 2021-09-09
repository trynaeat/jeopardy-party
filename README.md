# JEO-PARTY!
Fun jeopardy party game to be played in groups or even online!

Scraped data from JArchive and some database setup provided by tadeckar

# Development
## Getting Started

First install all local deps
`cd ./server && npm i`
`cd ./jeopardy-party-client && npm i`

Run from the root directory:
`docker-compose up --build`

This will spin up 3 containers:
- client: serves the Vue.js development server at port 8080
- server: serves HTTP API/WS servers at port 3000. Uses ts-node for JIT TS compilation and nodemon to watch for changes and reboot automatically
- postgres: serves the postgres DB of questions utilized by the API server. Port 5432. Data is mounted to a local volume at `postgres/data_persist`

# Production

Run from the root directory:
`docker-compose -f docker-compose.yml -f docker-compose.override.yml -f production.yml up --build`

Production config makes the following changes to the deployment:
- client: builds app into a static bundle and serves it with NGINX at port 80. Set to restart if process crashes.
- server: precompiles TS and runs the server as a regular node app. Set to restart if process crashes.
