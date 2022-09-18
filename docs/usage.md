# Usage

## Starting `ampd`

To run `ampd`, just run the `jar`-file:

```shell script
java -jar ampd.jar
```

Additional options can be passed via the `-D` arguments, for example:

```shell script
# Music dir is located at /home/foo/music
java -jar -Dmpd.music.directory=/home/foo/music ampd.jar
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
