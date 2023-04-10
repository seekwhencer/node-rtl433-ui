# node-rtl433-ui

- A web-ui and webserver as MQTT client
- Using [rtl_433](https://github.com/merbanan/rtl_433) as scanner.
- This is a simple and user guided, graphical way to map a value from a device to a MQTT topic.
- The server can exclude devices and forgets unmapped devices after a time.
- You can choose a value field from a device by clicking on the label.
- Then you can enter your topic.
- Instantly the server sends this new mapped topic to your mqtt broker. On value change.
- The frontend is localizable. You can add and set your own language.


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
>  ... more readme later