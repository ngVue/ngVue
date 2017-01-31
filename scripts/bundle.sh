#!/bin/bash

BABEL_ENV=build ENTRY=index OUTPUT=index `npm bin`/rollup -c
BABEL_ENV=build ENTRY=plugins OUTPUT=plugins `npm bin`/rollup -c

BABEL_ENV=build MIN=true ENTRY=index OUTPUT=index.min `npm bin`/rollup -c
BABEL_ENV=build MIN=true ENTRY=plugins OUTPUT=plugins.min `npm bin`/rollup -c
