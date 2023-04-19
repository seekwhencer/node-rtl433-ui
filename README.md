# node-rtl433-ui

This is a simple and user guided, graphical way to map a value from a 433 Mhz device to a MQTT topic.

- A web-ui and webserver as MQTT client
- Using [rtl_433](https://github.com/merbanan/rtl_433) as scanner.
- The server can exclude devices and forgets unmapped devices after a time.
- You can choose a value field from a device by clicking on the label.
- Then you can enter your topic.
- Instantly the server sends this new mapped topic to your mqtt broker. On value change.
- The frontend is localizable. You can add and set your own language.


![alt text](../master/docs/screenshots/listing.png?raw=true "Screenshot device listing")

## Setup
- install docker and docker compose, create docker volumes
    ```bash
    # make the setup script runable
    chmod +x ./setup.sh
  
    # run the script not as sudo
    ./setup.sh
    ```

## Config

- duplicate the file `server/config/default.conf.example` to `server/config/default.conf`
- edit the file `server/config/default.conf`
- edit the file `rtl433&/rtl_433.conf`

## Run

### Production
- ```bash
  docker-compose up -d
  ```

### Development

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
  
- frontend dev build pipeline with file watcher and proxy
    > *on a second console*
    ```bash
    # start only the container
    docker-compose -f docker-compose-frontend.yml
  
    # start the file watcher build pipeline
    docker exec -it raspiscan_frontend /bin/sh -c "node --experimental-modules --experimental-json-modules config/WebpackConfigDev.js"
    ```
  
    > Now open: http://RASPBERRYPI:4000/dev.html  


- frontend production build
    ```bash
    # start only the container - if not running
    docker-compose -f docker-compose-frontend.yml
  
    # bundling
    docker exec -it raspiscan_frontend /bin/sh -c "node --experimental-modules --experimental-json-modules config/WebpackConfigProd.js"
    ```

### Frontend production bundle
- The frontend production bundle is not part of this repository.
- A github action builds the production bundle and push it to the branch: [frontend-production](https://github.com/seekwhencer/node-rtl433-ui/tree/frontend-production)
- Place the content of this branch into: `frontend/dist/prod`
  ```bash
  git clone ...
  ```

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
- ...
