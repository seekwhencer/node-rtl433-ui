FROM node:16-alpine

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
COPY . .

WORKDIR /raspiscan/shared
COPY shared/package.json .
RUN npm install
COPY . .

RUN npm install pkg -g

RUN chown -R 1000:1000 /root/.npm

WORKDIR /usr/local/bin
COPY server/entrypoint.sh .
RUN chmod +x entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

WORKDIR /raspiscan
