#!/bin/sh

# load .env file and config file
loadConfig() {
    export DIR="/raspiscan"
    export $(egrep -v '^#' "${DIR}/.env" | xargs)
}

bundle() {
  cd "${DIR}/server"
  echo "BUNDLING..."
  node --experimental-modules --experimental-json-modules ./webpack-app-pkg.config.js
}

bundleNCC(){
  cd "${DIR}/server"
  ncc build ./index.js -o dist
}

createBinary(){
  cd "${DIR}/server"
  pkg dist/index.js --output "${BUILD_FILENAME}" --targets "${BUILD_TARGET}" --compress GZip -d
  chown node:node "${BUILD_FILENAME}"
  chmod +x "${BUILD_FILENAME}"
}


loadConfig

echo ""

#bundle
createBinary
