#!/bin/sh
set -e

#
# this copies the frontend production bundle in place for the server
#
# server/config/frontend is the delivery folder for the
# frontend statics in production
#
mkdir -p /raspiscan/server/config/frontend
curl https://raw.githubusercontent.com/seekwhencer/node-rtl433-ui/frontend-production/index.html -o /raspiscan/server/config/frontend/index.html
curl https://raw.githubusercontent.com/seekwhencer/node-rtl433-ui/frontend-production/app.js -o /raspiscan/server/config/frontend/app.js

# Run command with node if the first argument contains a "-" or is not a system command. The last
# part inside the "{}" is a workaround for the following bug in ash/dash:
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=874264
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
  set -- node "$@"
fi

exec "$@"
