#!/bin/bash

bundle exec jekyll build
cd ../web
npm run deploy
cd -
