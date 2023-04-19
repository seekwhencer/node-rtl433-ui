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

### Production
- docker-compose
    ```bash
    docker-compose up -d
    ```

## Development

- stop production server
    ```bash
    docker-compose down
    ```
- start server container in dev mode
    ```bash
    # start server container in dev mode, not the server
    docker-compose -f docker-compose-server.yml up -d
  
    # start the server
    docker exec -it raspiscan_server /bin/sh -c "node --experimental-modules --experimental-json-modules index.js"
    ```
  
- frontend build pipeline
    > *on a second console*
    ```bash
    # start only the container
    docker-compose -f docker-compose-frontend.yml
  
    # start the file watcher build pipeline
    docker exec -it raspiscan_frontend /bin/sh -c "node --experimental-modules --experimental-json-modules config/WebpackConfigDev.js"
    ```

--

## Features
- server works as MQTT client to your broker
- server serves the frontend stuff and some api endpoints
- server sends a value (single float value, not json) from a device on a specific MQTT topic to your broker - only when the value changes
- server can update mapping at runtime
- mapping a **device** and **field** to a **topic** per web ui.
- frontend language can be edited and set
- drop topic
- add model to exclude list
- add device to exclude list
- drop entry from exclude list
- sort listing by last update or signal count
- enable and disable list update
- forget unmapped device after x seconds / minutes
- enable and disable removing unmapped devices from list 

### Roadmap
what's next?
- 
