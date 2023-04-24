#!/bin/bash

#
# run this script on a docker host with buildx
#

# load .env file
loadConfig() {
    DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    export $(egrep -v '^#' "${DIR}/.env" | xargs)

    export TAG_LATEST="${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:latest"
    export TAG_VERSION="${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}"

}

# build the docker image
build() {
  env
  #docker build . -t ${TAG_LATEST} -t ${TAG_VERSION} -f ./server/Dockerfile

  docker buildx build . --builder=${DOCKER_BUILDX_NAME} --platform=${DOCKER_BUILDX_PLATFORM} --push -t ${TAG_LATEST} -t ${TAG_VERSION} -f ./server/Dockerfile
}

#
loadConfig
build