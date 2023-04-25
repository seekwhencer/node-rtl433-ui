## *node-rtl433-ui*
# Frontend

- The frontend production bundle is not part of this repository.
- A github action builds the production bundle and push it to the branch: [frontend-production](https://github.com/seekwhencer/node-rtl433-ui/tree/frontend-production)
- The `server/entrypoint.sh` places the content of the **frontend-production** branch into: `server/config/frontend`
- For production:`SERVER_FRONTEND_PATH=config/frontend` set in `docker-compose.yml`
- For development:`SERVER_FRONTEND_PATH=../frontend/dist/dev` set in `docker-compose-server.yml`

## Development
- ### frontend dev build pipeline with file watcher and proxy
  > *on a second console*
    ```bash
    # start only the container
    docker-compose -f docker-compose-frontend.yml
  
    # start the file watcher build pipeline
    docker exec -it raspiscan_frontend /bin/sh -c "node --experimental-modules --experimental-json-modules config/WebpackConfigDev.js"
    ```

  > Now open: http://RASPBERRYPI:4000/dev.html


- ### frontend production build
    ```bash
    # start only the container - if not running
    docker-compose -f docker-compose-frontend.yml
  
    # bundling
    docker exec -it raspiscan_frontend /bin/sh -c "node --experimental-modules --experimental-json-modules config/WebpackConfigProd.js"
    ```
    Creates a bundle in `frontend/dist/prod`
    
    > This will be triggered by a github workflow action and only the result will be pushed to the branch: [frontend-production](https://github.com/seekwhencer/node-rtl433-ui/tree/frontend-production)
            
## Todo
- ...