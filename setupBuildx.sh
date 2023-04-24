#!/bin/bash

#
# run this script on a docker host,
# who can use buildx. not the raspberry pi.
#

# load .env file
loadConfig() {
    DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    export $(egrep -v '^#' "${DIR}/.env" | xargs)
}

setup() {
  docker run --rm --privileged multiarch/qemu-user-static:${DOCKER_QEMU_VERSION} --reset -p yes
  docker buildx create --name=${DOCKER_BUILDX_NAME}
}

loadConfig
setup
