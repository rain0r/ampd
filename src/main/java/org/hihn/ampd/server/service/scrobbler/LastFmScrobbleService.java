package org.hihn.ampd.server.service.scrobbler;

import com.google.common.base.Strings;
import de.umass.lastfm.Authenticator;
import de.umass.lastfm.Caller;
import de.umass.lastfm.Session;
import de.umass.lastfm.Track;
import de.umass.lastfm.scrobble.ScrobbleResult;
import de.umass.util.StringUtilities;
import org.bff.javampd.playlist.MPDPlaylistSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service to interact with the last.fm api.
 */
@Service
public class LastFmScrobbleService implements AmpdScrobbler {

	private static final Logger LOG = LoggerFactory.getLogger(LastFmScrobbleService.class);

	private final AmpdSettings ampdSettings;

	Session session;

	LastFmScrobbleService(AmpdSettings ampdSettings) {
		this.ampdSettings = ampdSettings;
	}

	@Override
	public void scrobbleListen(MPDPlaylistSong song) {
		buildSession();
		if (session == null || !ampdSettings.getLastfmApiScrobble()) {
			return;
		}
		int now = (int) (System.currentTimeMillis() / 1000);
		ScrobbleResult result = Track.scrobble(song.getArtistName(), song.getTitle(), now, session);
		System.out.println("ok: " + (result.isSuccessful() && !result.isIgnored()));
	}

	@Override
	public void scrobblePlayingNow(MPDPlaylistSong song) {
		buildSession();
		if (session == null || !ampdSettings.getLastfmApiScrobble()) {
			return;
		}
		ScrobbleResult result = Track.updateNowPlaying(song.getArtistName(), song.getTitle(), session);
		System.out.println("ok: " + (result.isSuccessful() && !result.isIgnored()));
	}

	private void buildSession() {
		if (session == null) {
			session = Authenticator.getMobileSession(ampdSettings.getLastfmApiUsername(),
					ampdSettings.getLastfmApiPassword(), ampdSettings.getLastfmApiKey(),
					ampdSettings.getLastfmApiSecret());
		}
	}

}
