# Docker

## Using Docker hub

The "official" Docker image of `ampd` is [rain0r/ampd](https://hub.docker.com/r/rain0r/ampd).

All properties from the
file [application.properties](https://github.com/rain0r/ampd/blob/master/src/main/resources/application.properties) can
be set with environment variables. Replace all dots with underscores and use upper case.

For example: to set `mpd.server` to `my-mpd-server`, start `ampd` with:

```sh
docker run -p 8080:8080 --env MPD_SERVER=my-mpd-server rain0r/ampd
```

`ampd` will be available at `http://localhost:8080`.

To persist the settings, create a file called `env` with one `KEY=VALUE` per line.
See [env.sample](https://github.com/rain0r/ampd/blob/master/docker/env.template) as an example.

```sh
docker run -p 8080:8080 --env-file ./env rain0r/ampd
```

If you want to save radio streams, pass a volume parameter to docker:

```sh
docker run \
    -p 8080:8080 \
    --env MPD_SERVER=hermes \
    --env HOME_DIR=/opt/ampd/home \
    --volume ${PWD}/home:/opt/ampd/home \
    rain0r/ampd
```

## With `docker compose`

This is a sample `compose.yaml` file to run `ampd`:

```yaml
services:
  ampd:
    image: docker.io/rain0r/ampd:latest
    restart: always
    container_name: "ampd"
    network_mode: "host"
    env_file: .env
    volumes:
      - /mnt/music:/mnt/music:ro
      - ./home:/opt/ampd/home
```

## Build from source

To build an image `ampd` form the `master` branch:

```sh
git clone https://github.com/rain0r/ampd/
cd ampd
docker build . -t ampd -f docker/Dockerfile
docker run -p 8080:8080 ampd
```

