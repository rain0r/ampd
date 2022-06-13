# Docker

# Using a release

To run a (stable) release of `ampd`, download the latest [release](https://github.com/rain0r/ampd/releases) and rename it to `ampd.jar`.
Create a file `Dockerfile` (in the same directory) with this content:

```sh
FROM openjdk:11-jre-slim
VOLUME /tmp
COPY ampd.jar ampd.jar
COPY ampd.properties application.properties
ENTRYPOINT ["java", "-jar", "/ampd.jar"]
EXPOSE 8080
```

Also create an empty file `ampd.properties` (or copy [applicaiton.properties](https://github.com/rain0r/ampd/blob/master/src/main/resources/application.properties)).
All `ampd` settings can be configured via this file.


Then create and run the release:
```sh
docker build . -t ampd
docker run -p 8080:8080 ampd
```


# Build from source

To build an image `ampd` form the `master` branch:

```sh
git clone https://github.com/rain0r/ampd/
cd ampd
docker build . -t ampd-dev
docker run -p 8080:8080 ampd-dev
```

