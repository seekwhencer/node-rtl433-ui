FROM node:16

RUN npm config set legacy-peer-deps true

WORKDIR /raspiscan/frontend
COPY frontend/package.json .
RUN npm install
COPY . .

WORKDIR /raspiscan
