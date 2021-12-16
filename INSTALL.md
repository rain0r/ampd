# Usage

## Installation

Download a release from [here](https://github.com/rain0r/ampd/releases) ([mirror](https://static.hihn.org/dl/ampd/)).

Since `ampd` is distributed as a single `jar`-file, it doesn't need a traditional installation.
Just copy it wherever you like.

I would recommend `/opt/ampd/` and in the following we are assuming `ampd` was placed into `/opt/ampd/ampd.jar`.

To overwrite any property from the built-in `application.properties`, download the
[default](https://github.com/rain0r/ampd/blob/master/src/main/resources/application.properties),
copy it to `/opt/ampd/application.properties` and change the properties to suit your needs.

---

Gentoo users can use an [ebuild](https://github.com/rain0r/hihn-overlay/tree/master/media-sound/ampd) from my overlay.

## Installation as a service

### init.d

The jar file can be used as a service out-of-the-box. Just create a symlink to `/etc/init.d`
and you're good to go:

```shell script
ln -sf /opt/ampd/ampd.jar /etc/init.d/ampd
/etc/init.d/ampd start
```

If you get the error: `start-stop-daemon: unrecognized option '--no-close'`, remove that
option from the jar-file with: `sed -i 's/--no-close//g' /opt/ampd/ampd.jar`

### systemd

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

## Installation behind another webserver (apache and nginx)

Please see [DEPLOYING.md](DEPLOYING.md)