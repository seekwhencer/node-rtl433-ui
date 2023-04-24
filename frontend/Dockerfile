FROM node:16-alpine

VOLUME ["/raspiscan/frontend/node_modules"]

RUN npm config set legacy-peer-deps true

WORKDIR /raspiscan/frontend
COPY frontend/package.json .
RUN npm install
COPY frontend .

WORKDIR /raspiscan
COPY .env.example .env
