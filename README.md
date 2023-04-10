# node-rtl433-ui

A webserver and web-ui for [rtl_433](https://github.com/merbanan/rtl_433).

![alt text](../master/docs/screenshots/listing.png?raw=true "Screenshot device listing")

## Setup

- ```
  chmod +x ./setup.sh
  ./setup.sh
  ```

## Config

- edit the file `server/config/default.conf`

## Run

- docker-compose
    ```bash
    docker-compose -f docker-compose-server.yml
    ```

- the app
    ```bash
    docker exec -it raspiscan_server /bin/sh -c "node --experimental-modules --experimental-json-modules index.js"
    ```

## Development

- frontend build pipeline
    ```bash
    docker-compose -f docker-compose-frontend.yml
    docker exec -it raspiscan_frontend /bin/sh -c "node --experimental-modules --experimental-json-modules config/WebpackConfigDev.js"
    ```


---
**Note**
 ... more readme later