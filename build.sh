#!/usr/bin/env bash

# cd angularclient
# rm -rf node_modules/
# npm install
# npm run build-prod
# cd ..

#mvn -T 1C clean spring-boot:run
JAVA_HOME=/opt/openjdk-bin-11.0.4_p11 mvn -T 1C clean spring-boot:run
