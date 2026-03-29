FROM node as frontend
WORKDIR /app
COPY angularclient .
RUN npm ci \
    && npx ng build --output-path=dist --configuration=production --base-href=./

FROM maven AS backend
WORKDIR /srv
COPY --exclude=angularclient . .
COPY --from=frontend /app/dist/browser/* src/main/resources/static/
RUN rm -rf /var/lib/apt/lists/* \
    && mvn package -q -Dskip.npm=true

FROM eclipse-temurin:25
WORKDIR /opt/ampd
COPY --from=backend /srv/target/ampd.jar .
RUN rm -rf /var/lib/apt/lists/*
CMD ["java", "-jar", "ampd.jar"]
