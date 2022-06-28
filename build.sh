#!/usr/bin/env sh

build () {

  esbuild "$1" --loader:.svg=text --tsconfig=./source/ts/tsconfig.json --bundle --platform=browser --outfile="$2"

}

case "$1" in

  'ts' | 'typescript')

    case "$2" in

      'global' )

        build ./source/ts/global.ts ./distribution/js/global.js

      ;;

      'main' )

        build ./source/ts/main.ts ./distribution/js/main.js

      ;;

    esac

  ;;

  'sass' | 'scss' )

    sass ./source/scss/main.scss ./distribution/styles.css --no-source-map

  ;;

  'html' )

    cp -r ./source/html/index.html -t ./distribution/

  ;;

  'fonts' )

    cp -r ./source/fonts/ -t ./distribution/

  ;;

  'app' )

    neu build

  ;;

  'all' )

    $0 fonts
    $0 ts
    $0 scss
    $0 html
    $0 app

  ;;

esac
