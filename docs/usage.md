# Usage

## Starting `ampd`

To run `ampd`, just run the `jar`-file:

```shell script
java -jar ampd.jar
```

## Settings

Please see the
[default](https://github.com/rain0r/ampd/blob/master/src/main/resources/application.properties)
`application.properties` file for settings that can be changed. It's pretty self-explanatory and commented.

There are multiple ways to start `ampd` with different settings:

* Using the `-D` parameter
* Modify `application.properties`
* Environment variables

### Using the `-D` parameter

All settings in `application.properties` can be set via `-D`.  To start `ampd` on port 8003:

```sh
java -jar -Dserver.port=8003 ampd.jar
```

To display album art from the music directory, pass the value of `music_directory` (from your `mpd.conf`) to `ampd`:

```sh
java -jar -Dmpd.music.directory=/home/foo/music ampd.jar
```

### Writing the setting to `application.properties`

```sh
echo "mpd.music.directory=/home/foo/music" >> application.properties
java -jar ampd.jar
```

### Using environment variables

All properties from
the [application.properties](https://github.com/rain0r/ampd/blob/master/src/main/resources/application.properties) can
be set with environment variables. Replace dots with underscores and use upper case.

```sh
MPD_MUSIC_DIRECTORY=/home/foo/music java -jar ampd.jar
```
## Installation

If you plan to run `ampd` as a service, please see  [install.md](install.md).

## Reverse proxy

If you plan to run `ampd` as a service behind another webserver, please see [deployment.md](deployment.md).

## General

`ampd` is pretty straightforward and has just four views:

* Queue - Displays the currently played track, its cover, player controls and the queue.
* Browse - Displays the saved playlists and lets you browse through the music directory.
* Search - Lets you search for tracks.
* Settings - Displays the backend-settings of `ampd` and lets you customize the frontend.

## Shortcuts

`ampd` has some shortcuts built in:

* `<space>` or `p`: Pauses the current running song. If the browser focus is on another button, that button may be
  triggered.
* `<arrow left>`: Previous song.
* `<arrow right>` Next song.
* `f`: Sets the focus to the filter. This is enabled on both the `Queue` and `Browse` view.
* `1`: Navigate to the queue view
* `2`: Navigate to the browse view
* `3`: Navigate to the search view
* `4`: Navigate to the settings view

Press `h` to see a list of all shortcuts. Alternatively, click on the question mark-icon in the top right corner.

## Importing radio streams

`ampd` supports the bulk import of radio streams. For that, navigate to the radio streams page
under `/browse/radio-streams` and scroll down to `Import radio streams`.

From there, select a `JSON`-file with your streams and upload it.

The `JSON`-file has to be in this format:

```json
[
  {
    "name": "radio station 1",
    "url": "https://example.com/1.m3u"
  },
  {
    "name": "another radio station",
    "url": "https://example.com/2.m3u"
  }
]

```