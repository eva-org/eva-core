#!/bin/bash

node-gyp rebuild --target=v2.0.0-beta.7 --dist-url=https://atom.io/download/electron && mv ./build/Release/mac-bundle-util.node ./mac-bundle-util.node
