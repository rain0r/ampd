# ampd

ampd is a web-based client for [MPD](https://www.musicpd.org/). It is build with `Angular` and
`Spring Boot`.

## Features

* Modern and responsive UI
* Bundles as single `jar`-file
* Album Cover Art
* Support for MusicBrainz Cover Art API
* Storing and using playlists
* Directory browser
* Database search
* Light and dark theme included
* Customizable front- and backend
* `ncmcpp`-like shortcuts
* Internet radio support
* No external JavaScript / CSS loaded
* Rearrange songs via drag an drop

### Limitations

* JRE 11 or higher needed
* JavaScript needed
* Only one mpd server supported

## Screenshots

Desktop (dark theme)             |  Mobile (light heme)
:-------------------------:|:-------------------------:
![Screenshot of ampd on a desktop](.github/desktop.png)  | ![Screenshot of ampd on a mobile device](.github/mobile.png)

More screenshots can be found in the [**wiki**](https://github.com/rain0r/ampd/wiki/Screenshots).

## Running

To run `ampd`, just run the `jar`-file:

```shell script
java -jar ampd.jar
```

For more options, please see: [USAGE.md](USAGE.md)

## Settings

Please see the
[default](https://github.com/rain0r/ampd/blob/master/src/main/resources/application.properties)
for settings that can be changed. It's pretty self-explanatory and commented.

## Contributing / hacking / developing

All types of contributions are welcome:

* Bug tickets
* Pull requests
* Suggestions
* Screenshots
* Documentation

If you like to fork / edit / work on `ampd`, please see: [DEVELOPING.md](DEVELOPING.md)
