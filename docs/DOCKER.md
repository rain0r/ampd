# Docker

# Using Docker hub

To get the latest version of `ampd` from Docker Hub:

```sh
docker pull rain0r/ampd
```

All properties from the [application.properties](https://github.com/rain0r/ampd/blob/master/src/main/resources/application.properties) can be set with environment variables. Replace dots with underscores and use upper case.

To set `mpd.server` to `my-mpd-server`, start `ampd` with:

```sh
docker run -p 8080:8080 --env MPD_SERVER=my-mpd-server rain0r/ampd
```

To persist the settings, create a file with one `KEY=VALUE` per line:

```sh
docker run -p 8080:8080 --env-file ./env.list rain0r/ampd
```

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
docker build . -t ampd-dev -f docker/Dockerfile-src
docker run -p 8080:8080 ampd-dev
```

