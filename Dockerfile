FROM maven:3-jdk-11 as builder-backend
WORKDIR /srv
COPY . .
ENV DEBIAN_FRONTEND=noninteractive
RUN mvn -Dskip.npm package

FROM node:lts as builder-frontend
WORKDIR /srv
COPY ./angularclient .
ENV DEBIAN_FRONTEND=noninteractive
RUN npm install

FROM openjdk:11-jre-slim
WORKDIR /srv
COPY --from=builder-frontend /srv ./angularclient
COPY --from=builder-backend /srv/target/ampd-*jar ./ampd.jar
EXPOSE 8080

CMD ["java", "-jar", "ampd.jar"]
