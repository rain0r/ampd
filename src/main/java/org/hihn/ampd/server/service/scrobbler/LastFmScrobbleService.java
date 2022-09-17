package org.hihn.ampd.server.service.scrobbler;

import de.umass.lastfm.Authenticator;
import de.umass.lastfm.Session;
import de.umass.lastfm.Track;
import de.umass.lastfm.scrobble.ScrobbleResult;
import org.bff.javampd.playlist.MPDPlaylistSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.LastFmCred;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collection;

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
		LOG.debug("ok: " + (result.isSuccessful() && !result.isIgnored()));
	}

	@Override
	public void scrobblePlayingNow(MPDPlaylistSong song) {
		buildSession();
		if (session == null || !ampdSettings.getLastfmApiScrobble()) {
			return;
		}
		ScrobbleResult result = Track.updateNowPlaying(song.getArtistName(), song.getTitle(), session);
		LOG.debug("ok: " + (result.isSuccessful() && !result.isIgnored()));
	}

	public LastFmCred getLastFmCred() {
		LastFmCred lastFmCred = new LastFmCred();
		lastFmCred.setApiKey(ampdSettings.getLastfmApiKey());
		return lastFmCred;
	}

	public Collection<Track> getSimilarTracks(String artist, String title) {
		return Track.getSimilar(artist, title, ampdSettings.getLastfmApiKey());
	}

	private void buildSession() {
		if (session == null) {
			session = Authenticator.getMobileSession(ampdSettings.getLastfmApiUsername(),
					ampdSettings.getLastfmApiPassword(), ampdSettings.getLastfmApiKey(),
					ampdSettings.getLastfmApiSecret());
		}
	}

}
