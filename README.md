# ampd

ampd is a free web-based client for [MPD](https://www.musicpd.org/). 

## Features

* Modern and responsive UI
  * Built with [Angular](https://angular.io/) and [Angular Material](https://material.angular.io/)
  * Light and dark theme included
  * No external JavaScript / CSS files loaded: 100% self hosted
  * Rearrange queue via drag an drop
* Support for album cover art
  * Loads and displays image files from the music directory
  * Support for the [MusicBrainz Cover Art Archive/API](https://wiki.musicbrainz.org/Cover_Art_Archive/API)
* Playlists
  * View / create / delete
* Customizable
  * Multiple features can be switched on and off
* `ncmcpp`-like shortcuts
* Support for Internet Radio Streams
* Support for scrobbling 
  * Last.fm
  * ListenBrainz
* Distributed as a single `jar`-file

### Caveats

* JRE 17 or higher needed
* Only one mpd server supported simultaneously

## Screenshots

Desktop (dark theme)             |  Mobile (light heme)
:-------------------------:|:-------------------------:
![Screenshot of ampd on a desktop](assets/screenshots/desktop.png)  | ![Screenshot of ampd on a mobile device](assets/screenshots/mobile.png)

More screenshots can be found in the [**wiki**](https://github.com/rain0r/ampd/wiki/Screenshots).

## Running

To start, just [download the latest release](https://github.com/rain0r/ampd/releases/latest) start it via: 

```sh
java -jar ampd.jar
```

For more options, please see: [usage.md](docs/usage.md)

If you want to deploy `ampd` behind another webserver via reverse proxy, please see: [deployment.md](docs/deployment.md) 

To run `ampd` with docker, please see: [docker.md](docs/docker.md)

## Contributing / hacking / developing

All types of contributions are welcome:

* Bug tickets
* Pull requests
* Suggestions
* Screenshots
* Documentation

If you like to fork / edit / work on `ampd`, please see: [dev.md](docs/dev.md)
