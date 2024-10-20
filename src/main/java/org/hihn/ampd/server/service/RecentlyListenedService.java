package org.hihn.ampd.server.service;

import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.listenbrainz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecentlyListenedService {

	private static final Logger LOG = LoggerFactory.getLogger(RecentlyListenedService.class);

	private final int MAX_RESULTS = 10;

	private final SearchService searchService;

	private final AmpdSettings ampdSettings;

	private final LbCoreApi lbCoreApi = new LbCoreApi();

	private String lbUsername = null;

	public RecentlyListenedService(SearchService searchService, AmpdSettings ampdSettings) {
		this.searchService = searchService;
		this.ampdSettings = ampdSettings;
		buildAuth();
	}

	public LinkedHashSet<String> getRecentlyListened() {
		LinkedHashSet<String> albums = new LinkedHashSet<>();
		Set<String> alreadySearched = new TreeSet<>();

		try {
			List<ListensForUserPayloadListensInner> response = Objects
				.requireNonNull(lbCoreApi.listensForUser(lbUsername).count(200).execute().getPayload().getListens());
			response.forEach(v -> {

				if (albums.size() == MAX_RESULTS) {
					return;
				}

				TrackMetadata metadata = Objects.requireNonNull(v.getTrackMetadata());

				String artist = Objects.requireNonNull(metadata.getArtistName());
				String album = Objects.requireNonNull(metadata.getReleaseName());

				// Abort if we already searched MPD for this album and artist
				String pair = artist + "-" + album;
				if (alreadySearched.contains(pair)) {
					return;
				}

				// Check, if we have this song in the database
				Map<String, String> searchParams = Map.of("album", album, "artist", artist);
				PageImpl<MPDSong> result = searchService.advSearch(searchParams, 0, 1);
				result.stream().findFirst().ifPresent(song -> albums.add(song.getAlbumName()));

				alreadySearched.add(pair);
			});
		}
		catch (Exception e) {
			LOG.error("Could not get listensForUser, username={}", lbUsername, e);
		}
		return albums;
	}

	private void buildAuth() {
		lbCoreApi.getApiClient().setApiKey("Token " + ampdSettings.getListenbrainzToken());
		try {
			ValidateToken a = lbCoreApi.validateToken().execute();
			lbUsername = a.getUserName();
		}
		catch (ApiException e) {
			LOG.error("Could not determine ListenBrainz username", e);
		}
	}

}
