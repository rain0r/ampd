package org.hihn.ampd.server.service.scrobbler;

import org.bff.javampd.playlist.MPDPlaylistSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.util.StringUtils;
import org.hihn.listenbrainz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hihn.listenbrainz.ListenType.PLAYING_NOW;
import static org.hihn.listenbrainz.ListenType.SINGLE;

/**
 * Service to scrobble songs to ListenBrainz.
 */
@Service
public class ListenBrainzScrobbleService implements AmpdScrobbler {

	private static final Logger LOG = LoggerFactory.getLogger(ListenBrainzScrobbleService.class);

	private final AmpdSettings ampdSettings;

	private final LbCoreApi lbCoreApi = new LbCoreApi();

	private MPDPlaylistSong currentSong;

	public ListenBrainzScrobbleService(AmpdSettings ampdSettings) {
		this.ampdSettings = ampdSettings;
		lbCoreApi.getApiClient().setApiKey("Token " + ampdSettings.getListenbrainzToken());
	}

	@Override
	public void scrobbleListen(MPDPlaylistSong song) {
		currentSong = song;

		if (StringUtils.isNullOrEmpty(song.getArtistName()) || StringUtils.isNullOrEmpty(song.getTitle())) {
			// Nothing to submit: abort
			return;
		}

		if (ampdSettings.isScrobbleLb()) {
			LOG.debug("Submiting listen: {} - {}", song.getArtistName(), song.getTitle());
			try {
				lbCoreApi.submitListens(buildSubmitListens(SINGLE)).execute();
			}
			catch (ApiException e) {
				LOG.error("Could not scrobble track: " + e.getMessage(), e);
			}
		}
	}

	@Override
	public void scrobblePlayingNow(MPDPlaylistSong song) {
		currentSong = song;
		if (ampdSettings.isScrobbleLb()) {
			LOG.debug("Submiting playing now: {} - {}", song.getArtistName(), song.getTitle());
			try {
				lbCoreApi.submitListens(buildSubmitListens(PLAYING_NOW)).execute();
			}
			catch (ApiException e) {
				LOG.error("Could not scrobble track: " + e.getMessage(), e);
			}
		}
	}

	private SubmitListens buildSubmitListens(ListenType listenType) {
		SubmitListens submitListens = new SubmitListens();
		submitListens.setListenType(listenType);
		submitListens.setPayload(List.of(buildPayload(listenType)));
		return submitListens;
	}

	private SubmitListensPayloadInner buildPayload(ListenType listenType) {
		SubmitListensPayloadInner SubmitListensPayload = new SubmitListensPayloadInner();
		SubmitListensPayload.setTrackMetadata(buildTrackMetadata());
		if (listenType.equals(SINGLE)) {
			int unixTime = Math.toIntExact(System.currentTimeMillis() / 1000L);
			SubmitListensPayload.setListenedAt(unixTime);
		}
		return SubmitListensPayload;
	}

	private TrackMetadata buildTrackMetadata() {
		TrackMetadata data = new TrackMetadata();
		data.setTrackName(currentSong.getTitle());
		data.setArtistName(currentSong.getArtistName());
		data.setReleaseName(currentSong.getAlbumName());
		data.setAdditionalInfo(buildAdditionalInfo());
		return data;
	}

	private AdditionalInfo buildAdditionalInfo() {
		AdditionalInfo info = new AdditionalInfo();
		info.setMediaPlayer("mpd");
		info.setSubmissionClient("ampd");
		info.setSubmissionClientVersion(ampdSettings.getVersion());
		info.setDurationMs(currentSong.getLength() * 1000);

		extractTrackMapKey(currentSong.getTagMap().get("MUSICBRAINZ_RELEASETRACKID")).ifPresent(info::setTrackMbid);
		extractTrackMapKey(currentSong.getTagMap().get("MUSICBRAINZ_ALBUMID")).ifPresent(info::setReleaseMbid);
		extractTrackMapKey(currentSong.getTagMap().get("MUSICBRAINZ_ARTISTID"))
			.ifPresent(artistMbId -> info.setArtistMbids(List.of(artistMbId)));
		return info;
	}

	private Optional<UUID> extractTrackMapKey(List<String> tagMap) {
		if (tagMap == null || tagMap.isEmpty() || tagMap.get(0) == null) {
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
