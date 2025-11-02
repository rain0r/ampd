FROM maven:3-eclipse-temurin-25 AS builder
WORKDIR /srv
COPY . .
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_MAJOR=22

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends --no-install-suggests ca-certificates curl gnupg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests nodejs && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    mvn package -q -Dnpm.exec=npm
FROM eclipse-temurin:25
WORKDIR /opt/ampd
COPY --from=builder /srv/target/ampd.jar ./ampd.jar
CMD ["java", "-jar", "ampd.jar"]
