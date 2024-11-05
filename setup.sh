#!/bin/sh

#npm i --legacy-peer-deps
cd projects/sunbird-pdf-player
#npm i --legacy-peer-deps
cd ../..
npm run build-lib
cd dist/sunbird-pdf-player
npm i --legacy-peer-deps
cd ../..
cd node_modules/@project-sunbird
ln -s ../../dist/sunbird-pdf-player sunbird-pdf-player
cd ../..
npm run prodbuild