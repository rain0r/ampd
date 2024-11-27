# FAQ

## Can I scrobble to ListenBrainz?

Yes. Please fill out the property `listenbrainz.token`  in `application.properties`.

Scrobbling can be turned on / off with `listenbrainz.scrobble`.

## Can I scrobble to Last.fm?

Yes. Please fill out these properties in `application.properties`:

* `lastfm.api.username`
* `lastfm.api.password` (in cleartext or 32-char md5 string)
* `lastfm.api.key`
* `lastfm.api.secret`

Scrobbling can be turned on / off with lastfm.api.scrobble.

## How can I load similar tracks from Last.fm?

To just retrieve similar tracks from Last.fm (without scrobbling what you listen to), you just need set `lastfm.api.key` in `application.properties`. No username, password or api secret needed.

## Why are there no covers when I browse my library?

Please make sure you either start `ampd` with the `-Dmpd.music.directory` parameter or add the
parameter to the `ampd.conf` file (see the [README.md](../README.md) for examples).

## Why are the no covers for the currently played track?

This can happen for multiple reasons:

- No `mpd.music.directory` was provided when starting `ampd`
- Retrieving covers from MusicBrainz is disabled (enable it with `-Dmb.cover.service=true`
- No (previously downloaded) cover was found in the local cover cache

## Do I have to run `ampd` on the same computer as the `mpd` server?

No, `ampd` can run on a separate computer. In this case, the option `mpd.server` has to be set
(either at start via `-Dmpd.server=` or written down to `ampd.conf`). There is also the option
`mpd.port` if the `mpd` server is not running on the default port `6600`.