# Usage

## Starting `ampd`

To run `ampd`, just run the `jar`-file:

```shell script
java -jar ampd.jar
```

Want to start the server on a port other than 8080?

```sh
java -jar -Dserver.port=8003 ampd.jar
```




Please see the
[default](https://github.com/rain0r/ampd/blob/master/src/main/resources/application.properties)
`application.properties` file for settings that can be changed. It's pretty self-explanatory and commented.





Additional options can be passed via the `-D` arguments, for example:

```shell script
# Music dir is located at /home/foo/music
java -jar -Dmpd.music.directory=/home/foo/music ampd.jar
```



To display album art from the music directory, pass the value of `music_directory` (from your `mpd.conf`) to `ampd`:

```sh
java -jar -Dmpd.music.directory=/home/foo/music ampd.jar
```

Alternatively, all properties may be set via environmental variables.

```sh
MPD_MUSIC_DIRECTORY=/home/foo/music java -jar ampd.jar
```

Too much to type? Just create an `application.properties`

```sh
echo "mpd.music.directory=/home/foo/music" >> application.properties
java -jar ampd.jar
```

## General

`ampd` is pretty straightforward and has just four views:

* Queue - Displays the currently played track, its cover, player controls and the queue.
* Browse - Displays the saved playlists and lets you browse through the music directory.
* Search - Lets you search for tracks.
* Settings - Displays the backend-settings of `ampd` and lets you customize the frontend.

## Shortcuts

`ampd` has some shortcuts built in:

* `<space>` or `p`: Pauses the current running song. If the browser focus is on another button, that button may be triggered.
* `<arrow left>`: Previous song.
* `<arrow right>` Next song.
* `f`: Sets the focus to the filter. This is enabled on both the `Queue` and `Browse` view.
* `1`: Navigate to the queue view
* `2`: Navigate to the browse view
* `3`: Navigate to the search view
* `4`: Navigate to the settings view

Press `h` to see a list of all shortcuts. Alternatively, click on the question mark-icon in the top right corner.
