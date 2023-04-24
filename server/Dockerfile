FROM node:16-alpine

VOLUME ["/raspiscan/server/node_modules", "/raspiscan/shared/node_modules"]

RUN apk add --no-cache build-base libtool libusb-dev librtlsdr-dev rtl-sdr cmake git curl

WORKDIR /home/node
RUN git clone https://github.com/merbanan/rtl_433.git

WORKDIR /home/node/rtl_433
RUN mkdir build

WORKDIR /home/node/rtl_433/build
RUN cmake ../
RUN make
RUN make install

WORKDIR /raspiscan/server
COPY server/package.json .
RUN npm install
COPY server .

COPY server/config/default.conf.example config/default.conf
COPY server/config/mapping.json.example config/mapping.json
COPY server/config/excludes.json.example config/excludes.json

WORKDIR /raspiscan/shared
COPY shared/package.json .
RUN npm install
COPY shared .

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

WORKDIR /raspiscan
COPY .env.example .env

