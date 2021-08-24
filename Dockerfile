FROM maven:3-jdk-11 as builder
WORKDIR /srv
COPY . .
ENV DEBIAN_FRONTEND=noninteractive
RUN set -x \
    && curl -fsSL https://deb.nodesource.com/setup_12.x | bash - \
    && apt-get install -y nodejs \
    && mvn package

FROM openjdk:11-jre-slim
WORKDIR /srv
COPY --from=builder /srv/target/ampd-*-SNAPSHOT.jar ./ampd.jar
EXPOSE 8080

CMD ["java", "-jar", "ampd.jar"]
