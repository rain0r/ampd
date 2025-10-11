package org.hihn.ampd.server.service.albumart;

import fm.last.musicbrainz.coverart.CoverArt;
import fm.last.musicbrainz.coverart.CoverArtArchiveClient;
import fm.last.musicbrainz.coverart.impl.DefaultCoverArtArchiveClient;
import org.apache.commons.io.IOUtils;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.service.cache.CoverCacheService;
import org.hihn.ampd.server.util.StringUtils;
import org.musicbrainz.controller.Recording;
import org.musicbrainz.controller.Release;
import org.musicbrainz.model.entity.ReleaseWs2;
import org.musicbrainz.model.searchresult.RecordingResultWs2;
import org.musicbrainz.model.searchresult.ReleaseResultWs2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Queries MusicBrainz for covers.
 */
@Service
public class MbCoverService {

	private static final Logger LOG = LoggerFactory.getLogger(MbCoverService.class);

	private final AmpdSettings ampdSettings;

	private final CoverCacheService coverCacheService;

	/**
	 * Downloads album art from MusicBrainz.
	 * @param ampdSettings Settings of this ampd instance.
	 * @param coverCacheService Handles locally saved album art / covers.
	 */
	public MbCoverService(AmpdSettings ampdSettings, CoverCacheService coverCacheService) {
		this.ampdSettings = ampdSettings;
		this.coverCacheService = coverCacheService;
	}

	/**
	 * Download a cover from Musicbrainz.
	 * @param track A {@link MPDSong}.
	 * @return The cover.
	 */
	public Optional<byte[]> getMbCover(MPDSong track) {
		if (!ampdSettings.isMbCoverService()) {
			LOG.trace("mb.cover.service is disabled, not downloading a cover");
			return Optional.empty();
		}
		LOG.debug("Trying to load a cover from the MusicBrainz API for file: {}", track.getFile());
		Optional<byte[]> cover = StringUtils.isNullOrEmpty(track.getAlbumName())
				? searchSingletonMusicBrainzCover(track) : searchAlbumMusicBrainzCover(track);
		// Save the cover in the cache
		cover.ifPresent(bytes -> coverCacheService.saveCover(track, bytes));
		return cover;
	}

	private Optional<byte[]> downloadCover(String uuid) {
		CoverArtArchiveClient client = new DefaultCoverArtArchiveClient();
		UUID mbId = UUID.fromString(uuid);
		CoverArt coverArt = client.getByMbid(mbId);
		Optional<byte[]> ret = Optional.empty();
		if (coverArt != null) {
			InputStream inputStream;
			try {
				inputStream = coverArt.getFrontImage().getImage();
				ret = Optional.of(IOUtils.toByteArray(inputStream));
			}
			catch (Exception e) {
				LOG.error("Error downloading cover", e);
			}
		}
		return ret;
	}

	private Optional<byte[]> searchAlbumMusicBrainzCover(MPDSong track) {
		Release releaseController = new Release();
		releaseController.getSearchFilter().setLimit((long) 10);
		releaseController.getSearchFilter().setMinScore((long) ampdSettings.getMinScore());
		String query;
		List<ReleaseResultWs2> releaseResults = new ArrayList<>();
		try {
			query = String.format("artist:%s%%20AND%%title:%s",
					URLEncoder.encode(track.getArtistName(), StandardCharsets.UTF_8),
					URLEncoder.encode(track.getAlbumName(), StandardCharsets.UTF_8));
			releaseController.search(query);
			releaseResults = releaseController.getFirstSearchResultPage();
		}
		catch (Exception e) {
			LOG.error("Error searching albums", e);
		}
		if (releaseResults == null) {
			return Optional.empty();
		}

		Optional<byte[]> cover = Optional.empty();
		for (ReleaseResultWs2 releaseResultWs2 : releaseResults) {
			cover = downloadCover(releaseResultWs2.getRelease().getId());
			if (cover.isPresent()) {
				break;
			}
		}
		return cover;
	}

	private Optional<byte[]> searchSingletonMusicBrainzCover(MPDSong track) {
		Optional<byte[]> cover = Optional.empty();
		if (StringUtils.isNullOrEmpty(track.getArtistName()) || StringUtils.isNullOrEmpty(track.getTitle())) {
			return cover;
		}
		Recording recording = new Recording();
		recording.getSearchFilter().setLimit((long) 10);
		recording.getSearchFilter().setMinScore((long) ampdSettings.getMinScore());
		String query;
		List<RecordingResultWs2> recordingResults = null;
		try {
			query = String.format("artist:%s%%20AND%%20title:%s",
					URLEncoder.encode(track.getArtistName(), StandardCharsets.UTF_8),
					URLEncoder.encode(track.getTitle(), StandardCharsets.UTF_8));
			recording.search(query);
			recordingResults = recording.getFirstSearchResultPage();
		}
		catch (Exception e) {
			LOG.error("Error searching singleton", e);
		}
		if (recordingResults == null) {
			return Optional.empty();
		}
		boolean running = true;
		for (RecordingResultWs2 recordingResult : recordingResults) {
			for (ReleaseWs2 release : recordingResult.getRecording().getReleases()) {
				cover = downloadCover(release.getId());
				if (cover.isPresent()) {
					running = false;
					break;
				}
			}
			if (!running) {
				break;
			}
		}
		return cover;
	}

}
