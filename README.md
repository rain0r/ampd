# ampd

ampd is a web-based client for [MPD](https://www.musicpd.org/). It is build with `Angular` and
`Spring Boot`.

## Features

* Modern and responsive UI
  * Built with [Angular](https://angular.io/) and [Angular Material](https://material.angular.io/)
  * Light and dark theme included
  * No external JavaScript / CSS files loaded: 100% self hosted
  * Rearrange queue via drag an drop
* Support for album cover art
  * Loads and displays image files from the music directory
  * Support for the [MusicBrainz Cover Art Archive/API](https://wiki.musicbrainz.org/Cover_Art_Archive/API)
* Database support
  * Directories
  * Albums
  * Genres
  * Search / browse
* Playlists
* Customizable front- and backend
* `ncmcpp`-like shortcuts
  * `>` for next track etc.
* Internet radio / streams support
* Support for scrobbling (Last.fm and ListenBrainz)
* Shows similar tracks via Last.fm (Api token required)
* Comes as a single `jar`-file

### Caveats

* JRE 11 or higher needed
* Only one mpd server supported

## Screenshots

Desktop (dark theme)             |  Mobile (light heme)
:-------------------------:|:-------------------------:
![Screenshot of ampd on a desktop](.github/desktop.png)  | ![Screenshot of ampd on a mobile device](.github/mobile.png)

More screenshots can be found in the [**wiki**](https://github.com/rain0r/ampd/wiki/Screenshots).

## Running

To start, just download the latest release start it via: 

```sh
java -jar ampd.jar
```

For more options, please see: [usage.md](docs/usage.md), [deployment.md](docs/deployment.md) or [docker.md](docs/docker.md)

## Contributing / hacking / developing

All types of contributions are welcome:

* Bug tickets
* Pull requests
* Suggestions
* Screenshots
* Documentation

If you like to fork / edit / work on `ampd`, please see: [dev.md](docs/dev.md)
