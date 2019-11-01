#!/usr/bin/env bash

# cd angularclient
# rm -rf node_modules/
# npm install
# npm run build-prod
# cd ..

#mvn -T 1C clean spring-boot:run
JAVA_HOME=/opt/openjdk-bin-11.0.5_p10 mvn -T 1C clean spring-boot:run
