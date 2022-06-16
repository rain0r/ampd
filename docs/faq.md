# FAQ

## Why are there no covers when I browse my library?

Please make sure you either start `ampd` with the `-Dmpd.music.directory` parameter or add the
parameter to the `ampd.conf` file (see the [README.md](../README.md) for examples).

## Why are the no covers for the currently played track?

This can happen for multiple reasons:

- No `mpd.music.directory` was provided when starting `ampd`
- Retrieving covers from MusicBrainz is disabled (enable it with `-Dmb.cover.service=true`
- No (previously downloaded) cover was found in the local cover cache

## Why do I get a blanke page when opening `ampd` in my browser?

`ampd` offers two options when downloading a release: One for the context path `/` and one for
`/ampd`. So if you decide to access `ampd` under the context path `/ampd` but instead are
running the `/`-version, you will get a blank page. This also applies vice versa.

## Do I have to run `ampd` on the same computer as the `mpd` server?

No, `ampd` can run on a separate computer. In this case, the option `mpd.server` has to be set
(either at start via `-Dmpd.server=` or written down to `ampd.conf`). There is also the option
`mpd.port` if the `mpd` server is not running on the default port `6600`.

## Can I run `ampd` under a different address than `/`?

Yes, there are two `jar` files each release: One for the operation under `/` and one for `/ampd`.
If you like to run `ampd` under a different address (for example under `/music`) you have to build
`ampd` yourself.

In short (for `/music`):

```shell script
git clone github.com/rain0r/ampd 
cd ampd
mvn -Dfrontend.context=/music package
ls target/ampd-*.jar
```
