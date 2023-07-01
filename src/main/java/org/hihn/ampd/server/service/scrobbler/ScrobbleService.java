package org.hihn.ampd.server.service.scrobbler;

import org.bff.javampd.player.PlayerBasicChangeEvent;
import org.bff.javampd.player.TrackPositionChangeListener;
import org.bff.javampd.playlist.MPDPlaylistSong;
import org.bff.javampd.playlist.PlaylistBasicChangeEvent;
import org.bff.javampd.server.MPD;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ScrobbleService {

	private static final Logger LOG = LoggerFactory.getLogger(ScrobbleService.class);

	/**
	 * The maximum time you have to listen to a song before it will count as a listen. Set
	 * to 4 minutes as per the recommendations in the ListenBrainz documentation.
	 */
	private static final int MAX_REQ_LISTEN_T = 4 * 60;

	private final ListenBrainzScrobbleService lbScrobbleService;

	private final LastFmService lastFmService;

	private MPDPlaylistSong currentSong = null;

	private boolean scrobbled = false;

	public ScrobbleService(MPD mpd, ListenBrainzScrobbleService lbScrobbleService, LastFmService lastFmService) {
		this.lbScrobbleService = lbScrobbleService;
		this.lastFmService = lastFmService;

		mpd.getStandAloneMonitor().addTrackPositionChangeListener(buildPositionListener());
		mpd.getStandAloneMonitor().start();

		mpd.getStandAloneMonitor().addPlayerChangeListener(pcl -> {
			LOG.debug("PlayerChangeListener: {}", pcl.getStatus());
			if (pcl.getStatus().equals(PlayerBasicChangeEvent.Status.PLAYER_STARTED)) {
				LOG.debug("Status: {}", pcl.getStatus());
				mpd.getPlayer().getCurrentSong().ifPresent(song -> currentSong = song);
			}
		});

		mpd.getStandAloneMonitor().addPlaylistChangeListener(pcl -> {
			if (pcl.getEvent().equals(PlaylistBasicChangeEvent.Event.SONG_CHANGED)) {
				mpd.getPlayer().getCurrentSong().ifPresent(song -> {
					if (songChanged(currentSong, song)) {
						scrobbled = false;
						currentSong = song;
						LOG.debug("Song changed to: {}", currentSong);
						scrobblePlayingNow(song);
					}
				});
			}
		});
	}

	private void scrobblePlayingNow(MPDPlaylistSong song) {
		lbScrobbleService.scrobblePlayingNow(song);
		lastFmService.scrobblePlayingNow(song);
	}

	private void scrobbleListen(MPDPlaylistSong song) {
		lbScrobbleService.scrobbleListen(song);
		lastFmService.scrobbleListen(song);
	}

	private boolean songChanged(MPDPlaylistSong currSong, MPDPlaylistSong playlistSong) {
		if (currSong == null || playlistSong == null) {
			return false;
		}
		return currSong.getId() != playlistSong.getId();
	}

	private TrackPositionChangeListener buildPositionListener() {
		return tpcl -> {
			if (scrobbled) {
				return;
			}
			Optional.ofNullable(currentSong).ifPresent(song -> {
				// Calculate the required position after which we can scrobble the song
				int minPos = Math.min(song.getLength() / 2, MAX_REQ_LISTEN_T);
				if (tpcl.getElapsedTime() >= minPos) {
					// Scrobble it
					scrobbleListen(song);
					scrobbled = true;
				}
			});
		};
	}

}
