FROM node:26-alpine3.23 AS frontend
WORKDIR /app
COPY angularclient .
RUN npm i --no-progress --loglevel=error --no-audit --no-fund --save-exact --prefer-online --ignore-scripts \
    && npx ng build --output-path=dist --configuration=production --base-href=./

FROM maven:3-eclipse-temurin-25 AS backend
WORKDIR /srv
COPY --exclude=angularclient . .
# Ensure static is fresh
RUN mvn -q clean && rm -rf src/main/resources/static/*
COPY --from=frontend /app/dist/browser/. src/main/resources/static/
RUN mvn -q -Dskip.npm=true -DskipTests package

FROM eclipse-temurin:25
WORKDIR /opt/ampd
COPY --from=backend /srv/target/ampd.jar .
CMD ["java", "-jar", "ampd.jar"]
