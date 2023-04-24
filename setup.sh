#!/bin/bash

#
# run this script on the raspberry pi directly
#

# load .env file
loadConfig() {
    DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    export $(egrep -v '^#' "${DIR}/.env" | xargs)
}

# update the host system
update() {
  sudo apt-get update -y
  sudo apt-get upgrade -y
}

# docker installation
installDocker() {
  sudo apt-get remove docker docker-engine docker.io containerd runc -y
  sudo apt-get update -y
  sudo curl -sSL https://get.docker.com | sh
  sudo usermod -a -G docker pi
}

installDockerCompose() {
  sudo curl -L "${DOCKER_COMPOSE_SOURCE}" -o "/usr/bin/docker-compose"
  sudo chmod +x /usr/bin/docker-compose
}

# create docker volumes
createVolumes() {
    echo ""
    echo "Creating docker volumes"
    echo ""

    docker volume create ${PROJECT_NAME}_tmp
}



#----------------------------------------------------------------------------------------------------------------------

loadConfig

echo ""
echo "Update system?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) update; break;;
        No ) break;;
    esac
done

echo ""
echo "Install Docker?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) installDocker; break;;
        No ) break;;
    esac
done

echo ""
echo "Install Docker Compose?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) installDockerCompose; break;;
        No ) break;;
    esac
done

echo ""
echo "Create Docker Volumes?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) createVolumes; break;;
        No ) break;;
    esac
done

echo ""