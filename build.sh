#!/usr/bin/env sh
#
# Will build the source code entirely.
#
# BeyondMagic © 2022

# -- Variables.

# Folder for distribution.
dist="./distribution"

# Folder for source-code.
src="./source/"

# -- Tests.

# If the folder for distribution doesn't exist, build entirely.
if [ ! -d "$dist/" ]; then

  mkdir "$dist"

  '1'='all'

fi

# -- Functions.
build () {

  esbuild "$1" \
    --loader:.svg=text \
    --tsconfig="$src"/ts/tsconfig.json \
    --bundle \
    --platform=browser \
    --outfile="$2"

}

# -- Main operation.
case "$1" in

  'dev' )

    neu run --frontend-lib-dev

  ;;

  'ts' | 'typescript')

    build "$src"/ts/index.ts "$dist"/js/index.js

  ;;

  'sass' | 'scss' )

    sass "$src"/scss/main.scss "$dist"/styles.css --no-source-map

  ;;

  'html' )

    cp -r "$src"/html/index.html -t "$dist"

  ;;

  'fonts' )

    cp -r "$src"/fonts/ -t "$dist"

  ;;

  'img' )

    cp -rf "$src"/img/ -t "$dist"

  ;;

  'app' )

    neu update
    neu build

  ;;

  'all' | * )

    $0 fonts
    $0 img
    $0 ts
    $0 scss
    $0 html
    $0 app

  ;;

esac
