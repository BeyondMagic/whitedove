#!/usr/bin/env sh

case "$1" in

  'ts' | 'typescript')

    esbuild ./source/ts/main.ts --bundle --platform=browser --outfile=./distribution/js/main.js

  ;;

  'sass' | 'scss' )

    sass ./source/scss/main.scss ./distribution/styles.css --no-source-map

  ;;

  'html' )

    cp -r ./source/html/index.html -t ./distribution/

  ;;

  'app' )

    neu build

  ;;

  'all' )

    $0 ts
    $0 scss
    $0 html
    $0 app

  ;;

esac
