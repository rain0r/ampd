package org.hihn.ampd.server.service.scrobbler;

import org.bff.javampd.playlist.MPDPlaylistSong;

/**
 * Methods to be implemented by all services that will "scrobble" a listen to a remote
 * service.
 */
public interface AmpdScrobbler {

	void scrobbleListen(MPDPlaylistSong song);

	void scrobblePlayingNow(MPDPlaylistSong song);

}
