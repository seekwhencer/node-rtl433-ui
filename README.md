# node-rtl433-ui

This is a simple and user guided, graphical way to map a value from a 433 Mhz device to a MQTT topic.

- map a **device** and **field** to a **topic** per web ui.
- server works as MQTT client to your broker
- server delivers the frontend statics and some api endpoints
- server sends a value (single float value, not json) from a device on a specific MQTT topic to your broker - only when the value changes
- server can update mapping at runtime
- ui language can be edited and set
- drop topic (delete mapped topic for a device and value)
- add model to exclude list
- add device to exclude list
- drop entry from exclude list
- sort device listing by *last update* or *signal count*
- enable and disable list update
- forget unmapped device after x seconds / minutes
- enable and disable removing unmapped devices from list

![Screenshot device listing](../master/docs/screenshots/listing.png?raw=true "Screenshot device listing")

## Setup (Raspberry Pi 4)
- take the lite OS image without desktop
- set up your raspberry pi as you will (expand filesystem, enable ssh, disable bluetooth and wifi etc.)
- install docker and docker compose, create docker volumes
    ```bash
  # use your home folder
  cd ~
  
  # clone repo
  git clone https://github.com/seekwhencer/node-rtl433-ui.git raspiscan
  
  # the folder
  cd raspiscan # or: /home/pi/raspiscan or: ~/raspiscan
    
  # make the setup script runable
    chmod +x ./setup.sh
  
    # run the script not as sudo
    ./setup.sh
    ```

## Config

- duplicate the file `server/config/default.conf.example` to `server/config/default.conf`
- edit the file `server/config/default.conf`
- edit the file `rtl433/rtl_433.conf`

## Run

### Production
- ```bash
  docker-compose up -d
  ```
  
    *at the first run, the image will be build*
  
    > Now open: http://RASPBERRYPI:3000
    
    If the this folder is empty: `frontend/dist/prod` - run the frontend production build

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

## Frontend 
- The frontend production bundle is not part of this repository.
- A github action builds the production bundle and push it to the branch: [frontend-production](https://github.com/seekwhencer/node-rtl433-ui/tree/frontend-production)
- The `server/entrypoint.sh` places the content of the **frontend-production** branch into: `server/config/frontend`
- For production:`SERVER_FRONTEND_PATH=config/frontend` set in `docker-compose.yml`
- For development:`SERVER_FRONTEND_PATH=../frontend/dist/dev` set in `docker-compose-server.yml`

## Roadmap
what's next?
- ui get the forget state at start
- CI for server
- docker image for the server

## In the wild
![raspiscan](../master/docs/screenshots/raspiscan.jpg?raw=true "raspiscan")
