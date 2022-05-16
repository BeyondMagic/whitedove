#!/usr/bin/env sh

case "$1" in

  'ts' | 'typescript')

    case "$2" in

      'renderer' )

         esbuild ./typescript/renderer/main.ts --bundle --target=chrome58 --platform=browser --outfile=./distribution/renderer/main.js

      ;;

      'system' )

         esbuild ./typescript/system/preload.ts --bundle --external:electron --platform=node --outfile=./distribution/preload.js

      ;;

      'window' )

          esbuild ./typescript/main.ts --bundle --external:electron --platform=node --outfile=./distribution/main.js

      ;;

    esac

  ;;

  'sass' | 'scss' )

    sass ./layout/style-sheet/main.scss ./distribution/style-sheet/style.css --no-source-map
    cp -r ./layout/line-dividers/ -t ./distribution/

  ;;

  'html' )

    cp -r ./layout/index.html -t ./distribution/

  ;;

  * | 'all' )

    $0 ts renderer
    $0 ts system
    $0 scss
    $0 html

  ;;

esac
