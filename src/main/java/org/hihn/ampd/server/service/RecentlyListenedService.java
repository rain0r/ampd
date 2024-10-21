package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.artist.MPDArtist;
import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.listenbrainz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecentlyListenedService {

	private static final Logger LOG = LoggerFactory.getLogger(RecentlyListenedService.class);

	private final int MAX_RESULTS = 10;

	private final MPD mpd;

	private final AmpdSettings ampdSettings;

	private final LbCoreApi lbCoreApi = new LbCoreApi();

	private String lbUsername = null;

	public RecentlyListenedService(MPD mpd, AmpdSettings ampdSettings) {
		this.mpd = mpd;
		this.ampdSettings = ampdSettings;
		buildAuth();
	}

	public LinkedHashSet<MPDAlbum> getRecentlyListened() {
		LinkedHashSet<MPDAlbum> albums = new LinkedHashSet<>();
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
				Optional<MPDAlbum> a = mpd.getMusicDatabase()
					.getAlbumDatabase()
					.listAlbumsByArtist(new MPDArtist(artist))
					.stream()
					.filter(item -> item.getName().equals(album))
					.findFirst()
					.map(item -> {
						if (item.getAlbumArtist().isBlank() && !item.getArtistNames().isEmpty()) {
							// Set the first artist name as albumArtist
							item.setAlbumArtist(item.getArtistNames().get(0));
						}
						return item;
					});

				a.ifPresent(albums::add);
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
