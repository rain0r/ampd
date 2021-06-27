# ampd

ampd is a web-based client for [MPD](https://www.musicpd.org/). It is build with `Angular` and
`Spring Boot`.

**Features**
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

**Limitations**
* JRE 11 or higher needed
* JavaScript needed
* Only one mpd server supported

---

## [Screenshots](https://github.com/rain0r/ampd/wiki/Screenshots)

Desktop (dark theme)             |  Mobile (light heme)
:-------------------------:|:-------------------------:
![Screenshot of ampd on a desktop](.github/desktop.png)  | ![Screenshot of ampd on a mobile device](.github/mobile.png)

## Running

Requires Java 11. To run ampd, just run the `jar`-file:

```shell script
java -jar ampd.jar
```

Additional options can be passed via the `-D` arguments, for example:

```shell script
# Music dir is located at /home/foo/music
java -jar -Dmpd.music.directory=/home/foo/music ampd.jar

# Combine multiple properties, MPD runs on port 5500 and access MPD server on 'myhostname'
java -jar -Dmpd.port=5500 -Dmpd.server=myhostname ampd.jar
```

To persist these options, create a config file. See chapter `Installation`.

## Using

### Shortcuts

`ampd` has some shortcuts built in:

* `<space>` or `p`: Pauses the current running song. If the browser focus is on another button, that button may be triggered.
* `<arrow left>`: Previous song.
* `<arrow right>` Next song.
* `f`: Sets the focus to the filter. This is enabled on both the `Queue` and `Browse` view.
* `1`: Navigate to the queue view
* `2`: Navigate to the browse view
* `3`: Navigate to the search view
* `4`: Navigate to the settings view

Press `h` to see a list of all shortcuts.

## Installation

Download a release from [here](https://github.com/rain0r/ampd/releases) ([mirror](https://static.hihn.org/dl/ampd/)).

Since `ampd` is distributed as a single `jar`-file, it doesn't need a traditional installation.
Just copy it wherever you like. I would recommend `/opt/ampd/ampd.jar`.

To overwrite any property from `application.properties` you can place a config file
under `/opt/ampd/ampd.conf` which contains additional parameters, for example:

```shell script
# File: /opt/ampd/ampd.conf
# See src/main/resources/application.properties for a full list
JAVA_OPTS="-Dspring.profiles.active=prod"
# If you have multiple JRE installed 
JAVA_HOME="/opt/openjdk-bin-11.0.6_p10/" 
```

**Caveats**  
The properties in `ampd.conf` are only applied if...

* ...`ampd` is startet via `./ampd.jar start`
* ... the `conf`-file has the same name as the `jar`-file (except the ending, of course)

## Settings
These are the available settings (with the defaults) that can be provided when starting `ampd` 
(either via `-D` or in the `ampd.conf` file).  

```  
    # The root of your music directory. Used to display album covers.
    # mpd.music.directory=/home/foo/Music
    # The ip or name of the server that runs MPD
    mpd.server=localhost
    # The port on which MPD runs
    mpd.port=6600
    # If MPD uses a password, set it here
    # mpd.password=
    # Covers can be cached locally in  ~/.local/share/ampd/
    local.cover.cache=true
    # Covers can be fetched from Musicbrainz
    mb.cover.service=true
    # Reset MPD modes on "Clear queue" (turn off shuffle/consume/etc)
    reset.modes.on.clear=false
    # If users are allowed to create new playlists
    create.new.playlists=true
    # If users are allowed to delete existing playlists
    delete.existing.playlists=true
    # The interval (in ms) in which ampd sends updates
    publisher.delay=900
```

### Installation as a service

#### init.d

The jar file can be used as a service out-of-the-box. Just create a symlink to `/etc/init.d`
and you're good to go:

```shell script
ln -sf /opt/ampd/ampd.jar /etc/init.d/ampd
/etc/init.d/ampd start
```

If you get the error: `start-stop-daemon: unrecognized option '--no-close'`, remove that
option from the jar-file with: `sed -i 's/--no-close//g' /opt/ampd/ampd.jar`

#### systemd

Create the file `/etc/systemd/system/ampd.service`

```shell script
[Unit]
Description=ampd
After=syslog.target

[Service]
User=ampd # <<<--- Change to a user on your system 
ExecStart=/opt/ampd/ampd.jar
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

Afterwards, start it immediately with `systemctl start ampd.service`.
If you wish, to start `ampd` at the next boot, enable it with `systemctl enable ampd.service`.

### Installation behind another webserver (apache and nginx)

Please see [DEPLOYING.md](DEPLOYING.md)

---

Developers go this way: [DEVELOPING.md](DEVELOPING.md)
