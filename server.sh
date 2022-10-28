#!/usr/bin/env sh
#
#  Deploy a local server on the "distribution" folder with automatic reloading.
#
#  Note: The port is the same used by "frontendLibrary" on "neutralino.config.json".
# 
#  DEPENDENCIES:
#    live-server (https://github.com/tapio/live-server)
#
# 2022 © João F. BeyondMagic <koetemagie@gmail.com>

live-server \
  --port=12121 \
  --no-browser \
  ./distribution
