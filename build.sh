#!/bin/bash

#
# run this script on a docker host with buildx
#

# load .env file
loadConfig() {
    DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    export $(egrep -v '^#' "${DIR}/.env" | xargs)
}

# build the docker image
build() {
  env
  local TAG_LATEST="${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:latest"
  local TAG_VERSION="${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}"

  #docker build . -t ${TAG_LATEST} -t ${TAG_VERSION} -f ./server/Dockerfile

  docker buildx build . --builder=${DOCKER_BUILDX_NAME} --platform=${DOCKER_BUILDX_PLATFORM} -t ${TAG_LATEST} -t ${TAG_VERSION} -f ./server/Dockerfile ./server/Dockerfile
}

push() {
  local TAG_LATEST="${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:latest"
  local TAG_VERSION="${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}"

  docker push ${TAG_LATEST}
  docker push ${TAG_VERSION}
}

#
loadConfig
build