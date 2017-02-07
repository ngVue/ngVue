#!/bin/bash

BABEL_ENV=build ENTRY=index OUTPUT=index `npm bin`/rollup -c
BABEL_ENV=build ENTRY=plugins/index OUTPUT=plugins `npm bin`/rollup -c
BABEL_ENV=build ENTRY=patches/ngfilters OUTPUT=patch-ngfilters `npm bin`/rollup -c

BABEL_ENV=build MIN=true ENTRY=index OUTPUT=index.min `npm bin`/rollup -c
BABEL_ENV=build MIN=true ENTRY=plugins/index OUTPUT=plugins.min `npm bin`/rollup -c
BABEL_ENV=build MIN=true ENTRY=patches/ngfilters OUTPUT=patch-ngfilters.min `npm bin`/rollup -c
