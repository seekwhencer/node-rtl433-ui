FROM node:16-alpine

ARG RTL433_RELEASE_TAG=22.11
ARG FRONTEND_COMMIT_ID=d8f7c4cb50388c13046b0f53703009fc5aca31c6

VOLUME ["/raspiscan/server/node_modules", "/raspiscan/shared/node_modules"]

RUN apk add --no-cache build-base libtool libusb-dev librtlsdr-dev rtl-sdr cmake git curl

# get rtl_433 source from release tag
WORKDIR /home/node
RUN curl -L https://github.com/merbanan/rtl_433/archive/refs/tags/${RTL433_RELEASE_TAG}.tar.gz -o rtl_433-${RTL433_RELEASE_TAG}.tar.gz
RUN tar -xvf rtl_433-${RTL433_RELEASE_TAG}.tar.gz

WORKDIR /home/node/rtl_433-${RTL433_RELEASE_TAG}
RUN mkdir build

WORKDIR /home/node/rtl_433-${RTL433_RELEASE_TAG}/build
RUN cmake ../
RUN make
RUN make install

#
WORKDIR /raspiscan/shared
COPY shared/package.json .
RUN npm install
COPY shared .

WORKDIR /raspiscan/server
COPY server/package.json .
RUN npm install
COPY server .

COPY server/config/default.conf.example config/default.conf
COPY server/config/mapping.json.example config/mapping.json
COPY server/config/excludes.json.example config/excludes.json

# obsolete, because there is no polyfill for Proxy()
#RUN npm install pkg -g

WORKDIR /
RUN chown -R 1000:1000 /root/.npm

COPY rtl_433/rtl_433.conf /etc/rtl_433/rtl_433.conf
COPY rtl_433/rtl-sdr.rules /etc/udev/rules.d/rtl-sdr.rules

WORKDIR /usr/local/bin
COPY server/entrypoint.sh .
RUN chmod +x entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

WORKDIR /raspiscan/server/config
RUN mkdir frontend
RUN curl https://github.com/seekwhencer/node-rtl433-ui/blob/${FRONTEND_COMMIT_ID}/index.html -o frontend/index.html
RUN curl https://github.com/seekwhencer/node-rtl433-ui/blob/${FRONTEND_COMMIT_ID}/app.js -o frontend/app.js

WORKDIR /raspiscan
COPY .env.example .env

