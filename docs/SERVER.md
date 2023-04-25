## *node-rtl433-ui*
# Server

## Production
- ```bash
  docker-compose up -d
  ```
  > Now open: http://RASPBERRYPI:3000

## Development

- ### stop production container
    ```bash
    docker-compose down
    ```
- ### start server container in dev mode
    ```bash
    # start server container in dev mode, not the server
    docker-compose -f docker-compose-server.yml up -d
  
    # start the server
    docker exec -it raspiscan_server /bin/sh -c "node --experimental-modules --experimental-json-modules index.js"
    ```

## Todo