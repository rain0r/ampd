# Docker

## Using Docker hub

To get the latest version of `ampd` from Docker Hub:

```sh
docker pull rain0r/ampd
```

All properties from
the [application.properties](https://github.com/rain0r/ampd/blob/master/src/main/resources/application.properties) can
be set with environment variables. Replace dots with underscores and use upper case.

To set `mpd.server` to `my-mpd-server`, start `ampd` with:

```sh
docker run -p 8080:8080 --env MPD_SERVER=my-mpd-server rain0r/ampd
```

To persist the settings, create a file with one `KEY=VALUE` per line.
See [env.sample](https://github.com/rain0r/ampd/blob/master/docker/env.template) as an example.

```sh
docker run -p 8080:8080 --env-file ./env.list rain0r/ampd
```

## Build from source

To build an image `ampd` form the `master` branch:

```sh
git clone https://github.com/rain0r/ampd/
cd ampd
docker build . -t ampd -f docker/Dockerfile
docker run -p 8080:8080 ampd-dev
```

