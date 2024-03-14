package org.hihn.ampd.server.service.scrobbler;

import org.bff.javampd.playlist.MPDPlaylistSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.listenbrainz.LbService;
import org.hihn.listenbrainz.lb.SubmitListen;
import org.hihn.listenbrainz.lb.SubmitListenNow;
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
public class ListenBrainzScrobbleService implements AmpdScrobbler {

	private static final Logger LOG = LoggerFactory.getLogger(ListenBrainzScrobbleService.class);

	private final AmpdSettings ampdSettings;

	private final LbService lbService;

	private MPDPlaylistSong currentSong;

	public ListenBrainzScrobbleService(AmpdSettings ampdSettings, LbService lbService) {
		this.ampdSettings = ampdSettings;
		this.lbService = lbService;
	}

	@Override
	public void scrobbleListen(MPDPlaylistSong song) {
		currentSong = song;
		if (ampdSettings.isScrobbleLb()) {
			lbService.submitSingleListen(buildPayload());
		}
	}

	@Override
	public void scrobblePlayingNow(MPDPlaylistSong song) {
		currentSong = song;
		if (ampdSettings.isScrobbleLb()) {
			LOG.info("Submiting playing now: {} - {}", song.getArtistName(), song.getTitle());
			lbService.submitPlayingNow(buildPlayingNowPayload());
		}
	}

	private List<SubmitListenNow> buildPlayingNowPayload() {
		SubmitListenNow submitListenNow = new SubmitListenNow(buildTrackMetadata(currentSong));
		return List.of(submitListenNow);
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
		if (tagMap.get(0) == null) {
			return Optional.empty();
		}
		try {
			return Optional.of(UUID.fromString(tagMap.get(0)));
		}
		catch (IndexOutOfBoundsException e) {
			return Optional.empty();
		}
	}

}
