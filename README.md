# node-rtl433-ui

This is a simple and user guided, graphical way to map a value from a 433 Mhz device to a MQTT topic.

- scan for 433Mhz devices with [merbanan/rtl_433](https://github.com/merbanan/rtl_433)
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

duplicate *.example files as *

- edit the file `.env`
- edit the file `server/config/default.conf`
- edit the file `rtl433/rtl_433.conf` (if needed)

## Run

- ```bash
  docker-compose up -d
  ```
  > Now open: http://RASPBERRYPI:3000

## Roadmap
what's next?
- ui get the forget state at start

## In the wild
![raspiscan](../master/docs/screenshots/raspiscan.jpg?raw=true "raspiscan")
