# Installation

Download a release from [here](https://github.com/rain0r/ampd/releases/latest)

Since `ampd` is distributed as a single `jar`-file, it doesn't need a traditional installation.
Just copy it wherever you like. `/opt/ampd` is recommended.

## Change settings

To change any settings download the [default](https://github.com/rain0r/ampd/blob/master/src/main/resources/application.properties) and place it alongside the `jar`-file.

To download it to `/opt/ampd/application.properties`:

```sh
wget https://raw.githubusercontent.com/rain0r/ampd/master/src/main/resources/application.properties -O /opt/ampd/application.properties
```

Then it would look like:

```sh
$ cd /opt/ampd
$ ls
ampd.jar  application.properties
$ cat application.properties
# General
spring.main.banner-mode=on
spring.messages.encoding=UTF-8
server.address=127.0.0.1
server.port=8003
...
```

Then edit any setting you like in `application.properties`

---

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

Please see [deployment.md](deployment.md)
