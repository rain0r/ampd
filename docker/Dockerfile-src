FROM maven:3-eclipse-temurin-17 as builder
ARG frontend_context=/
WORKDIR /srv
COPY . .
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_MAJOR=20

RUN apt-get update
RUN apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install nodejs -y

RUN mvn package -q -Dfrontend.context=$frontend_context -Dnpm.exec=npm

FROM eclipse-temurin:17
WORKDIR /srv
COPY --from=builder /srv/target/ampd-*.jar ./ampd.jar
EXPOSE 8080

CMD ["java", "-jar", "ampd.jar"]
