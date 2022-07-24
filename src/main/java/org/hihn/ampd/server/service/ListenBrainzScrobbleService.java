package org.hihn.ampd.server.service;

import org.bff.javampd.playlist.MPDPlaylistSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.listenbrainz.LbService;
import org.hihn.listenbrainz.lb.SubmitListen;
import org.hihn.listenbrainz.lb.SubmitListensAdditionalInfo;
import org.hihn.listenbrainz.lb.SubmitListensTrackMetadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service to scrobble songs to ListenBrainz.
 */
@Service
public class ListenBrainzScrobbleService {

	private static final Logger LOG = LoggerFactory.getLogger(ListenBrainzScrobbleService.class);

	private final AmpdSettings ampdSettings;

	private final LbService lbService;

	private MPDPlaylistSong currentSong;

	public ListenBrainzScrobbleService(AmpdSettings ampdSettings, LbService lbService) {
		this.ampdSettings = ampdSettings;
		this.lbService = lbService;
	}

	public void scrobbleListenBrainz(MPDPlaylistSong song) {
		LOG.info("Submit Listen: {} - {}", song.getArtistName(), song.getTitle());
		currentSong = song;
		if (ampdSettings.isScrobbleLb()) {
			lbService.submitSingleListen(buildPayload());
		}
	}

	private SubmitListen buildPayload() {
		SubmitListen payload = new SubmitListen();
		int unixTime = Math.toIntExact(System.currentTimeMillis() / 1000L);
		payload.setListenedAt(unixTime);
		payload.setTrackMetadata(buildTrackMetadata(currentSong));
		return payload;
	}

	private SubmitListensTrackMetadata buildTrackMetadata(MPDPlaylistSong song) {
		SubmitListensTrackMetadata data = new SubmitListensTrackMetadata();
		data.setTrackName(song.getTitle());
		data.setArtistName(song.getArtistName());
		data.setReleaseName(song.getAlbumName());
		data.setAdditionalInfo(buildAdditionalInfo(song));
		return data;
	}

	private SubmitListensAdditionalInfo buildAdditionalInfo(MPDPlaylistSong song) {
		SubmitListensAdditionalInfo info = new SubmitListensAdditionalInfo();
		info.setMediaPlayer("mpd");
		info.setSubmissionClient("ampd");
		info.setSubmissionClientVersion(ampdSettings.getVersion());
		info.setDurationMs(song.getLength() * 1000);

		extractTrackMapKey(song.getTagMap().get("MUSICBRAINZ_RELEASETRACKID")).ifPresent(info::setTrackMbid);
		extractTrackMapKey(song.getTagMap().get("MUSICBRAINZ_ALBUMID")).ifPresent(info::setReleaseMbid);
		extractTrackMapKey(song.getTagMap().get("MUSICBRAINZ_ARTISTID"))
				.ifPresent(artistMbId -> info.setArtistMbids(List.of(artistMbId)));
		return info;
	}

	private Optional<UUID> extractTrackMapKey(List<String> tagMap) {
		try {
			return Optional.of(UUID.fromString(tagMap.get(0)));
		}
		catch (IndexOutOfBoundsException | NullPointerException e) {
			return Optional.empty();
		}
	}

}
