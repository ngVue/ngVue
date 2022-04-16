#!/bin/bash

BABEL_ENV=build ENTRY=index OUTPUT=index node_modules/.bin/rollup -c
BABEL_ENV=build ENTRY=plugins/index OUTPUT=plugins node_modules/.bin/rollup -c
BABEL_ENV=build ENTRY=patches/ngfilters OUTPUT=patch-ngfilters node_modules/.bin/rollup -c
