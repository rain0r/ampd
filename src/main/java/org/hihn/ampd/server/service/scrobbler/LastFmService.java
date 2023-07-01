package org.hihn.ampd.server.service.scrobbler;

import de.umass.lastfm.Authenticator;
import de.umass.lastfm.Session;
import de.umass.lastfm.Track;
import de.umass.lastfm.scrobble.ScrobbleResult;
import org.bff.javampd.playlist.MPDPlaylistSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.LastFmSimilarTracks;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.stream.Stream;

/**
 * Service to interact with the last.fm api.
 */
@Service
public class LastFmService implements AmpdScrobbler {

	private static final Logger LOG = LoggerFactory.getLogger(LastFmService.class);

	private final AmpdSettings ampdSettings;

	Session session;

	LastFmService(AmpdSettings ampdSettings) {
		this.ampdSettings = ampdSettings;
	}

	@Override
	public void scrobbleListen(MPDPlaylistSong song) {
		buildSession();
		if (session == null) {
			return;
		}
		int now = (int) (System.currentTimeMillis() / 1000);
		ScrobbleResult result = Track.scrobble(song.getArtistName(), song.getTitle(), now, session);
		LOG.debug("ok: " + (result.isSuccessful() && !result.isIgnored()));
	}

	@Override
	public void scrobblePlayingNow(MPDPlaylistSong song) {
		buildSession();
		if (session == null) {
			return;
		}
		ScrobbleResult result = Track.updateNowPlaying(song.getArtistName(), song.getTitle(), session);
		LOG.debug("ok: " + (result.isSuccessful() && !result.isIgnored()));
	}

	public LastFmSimilarTracks getSimilarTracks(String artist, String title) {
		return new LastFmSimilarTracks(ampdSettings.getLastfmApiKey(),
				Track.getSimilar(artist, title, ampdSettings.getLastfmApiKey()));

	}

	private void buildSession() {
		if (!ampdSettings.isLastfmApiScrobble()) {
			return;
		}
		if (session == null) {

			// Only attempt authentication if all fields are set
			boolean valid = Stream
				.of(ampdSettings.getLastfmApiUsername(), ampdSettings.getLastfmApiPassword(),
						ampdSettings.getLastfmApiKey(), ampdSettings.getLastfmApiSecret())
				.noneMatch(String::isBlank);

			if (!valid) {
				return;
			}

			session = Authenticator.getMobileSession(ampdSettings.getLastfmApiUsername(),
					ampdSettings.getLastfmApiPassword(), ampdSettings.getLastfmApiKey(),
					ampdSettings.getLastfmApiSecret());
		}
	}

}
