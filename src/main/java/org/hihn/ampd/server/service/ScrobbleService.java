package org.hihn.ampd.server.service;

import org.bff.javampd.player.PlayerBasicChangeEvent;
import org.bff.javampd.player.TrackPositionChangeListener;
import org.bff.javampd.playlist.MPDPlaylistSong;
import org.bff.javampd.playlist.PlaylistBasicChangeEvent;
import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.model.AmpdSettings;
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

	private MPDPlaylistSong currentSong = null;

	private boolean scrobbled = false;

	private final AmpdSettings ampdSettings;

	public ScrobbleService(MPD mpd, ListenBrainzScrobbleService lbScrobbleService, AmpdSettings ampdSettings) {
		this.lbScrobbleService = lbScrobbleService;
		this.ampdSettings = ampdSettings;

		mpd.getStandAloneMonitor().addTrackPositionChangeListener(buildPositionListener());
		mpd.getStandAloneMonitor().start();

		mpd.getStandAloneMonitor().addPlayerChangeListener(pcl -> {
			LOG.trace("PlayerChangeListener: {}", pcl.getStatus());
			if (pcl.getStatus().equals(PlayerBasicChangeEvent.Status.PLAYER_STARTED)) {
				LOG.trace("Status: {}", pcl.getStatus());
				mpd.getPlayer().getCurrentSong().ifPresent(song -> currentSong = song);
			}
		});

		mpd.getStandAloneMonitor().addPlaylistChangeListener(pcl -> {
			if (pcl.getEvent().equals(PlaylistBasicChangeEvent.Event.SONG_CHANGED)) {
				mpd.getPlayer().getCurrentSong().ifPresent(song -> {
					if (songChanged(currentSong, song)) {
						scrobbled = false;
						currentSong = song;
						LOG.trace("Song changed to: {}", currentSong);
						lbScrobbleService.scrobblePlayingNow(song);
					}
				});
			}
		});
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
					if (ampdSettings.isScrobbleLb()) {
						lbScrobbleService.scrobblelisten(song);
					}
					scrobbled = true;
				}
			});
		};
	}

}
