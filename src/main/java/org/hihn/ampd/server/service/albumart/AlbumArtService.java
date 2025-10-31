package org.hihn.ampd.server.service.albumart;

import org.bff.javampd.art.MPDArtwork;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.bff.javampd.song.SearchCriteria;
import org.bff.javampd.song.SongSearcher;
import org.hihn.ampd.server.javampd.EmbeddedCoverService;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.service.cache.CoverCacheService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Methods to load album artworks from the music directory.
 */
@Service
public class AlbumArtService {

	private static final Logger LOG = LoggerFactory.getLogger(AlbumArtService.class);

	private final MPD mpd;

	private final AmpdSettings ampdSettings;

	private final CoverCacheService coverCacheService;

	private final MbCoverService mbCoverService;

	private final EmbeddedCoverService myMpd;

	/**
	 * Methods to load album artworks from the music directory.
	 * @param ampdSettings Settings of this ampd instance.
	 * @param mpd Represents a connection to a MPD server.
	 * @param coverCacheService Handles locally saved albumart / covers.
	 * @param mbCoverService Service to download cover from MusicBrainz.
	 */
	public AlbumArtService(AmpdSettings ampdSettings, MPD mpd, CoverCacheService coverCacheService,
			MbCoverService mbCoverService, EmbeddedCoverService myMpd) {
		this.ampdSettings = ampdSettings;
		this.mpd = mpd;
		this.coverCacheService = coverCacheService;
		this.mbCoverService = mbCoverService;
		this.myMpd = myMpd;
	}

	/**
	 * Finds a cover for a track file path.
	 * @param trackFilePath A track file path.
	 * @return An Optional containing the cover as bytes.
	 */
	public Optional<byte[]> findAlbumCoverForTrack(String trackFilePath) {
		MPDSong track;
		Optional<byte[]> cover;

		try {
			// Map the track file path to a MPDSong
			track = mpd.getMusicDatabase().getSongDatabase().searchFileName(trackFilePath).iterator().next();
		}
		catch (NoSuchElementException e) {
			// Don't log if a radio stream is playing
			if (!Pattern.compile("http.+").matcher(trackFilePath.toLowerCase()).matches()) {
				LOG.warn("Could not find MPDSong for file: {}", trackFilePath);
			}
			return Optional.empty();
		}

		// Try to load the cover from the Mpd music directory
		cover = loadArtworkForTrack(track);

		if (cover.isEmpty()) {
			// Try to load the cover from cache
			cover = coverCacheService.loadCover(track);
		}

		if (cover.isEmpty()) {
			// Load the cover from MusicBrainz
			cover = mbCoverService.getMbCover(track);
		}

		if (cover.isEmpty()) {
			try {
				cover = myMpd.getEmbeddedCover(trackFilePath);
			}
			catch (Exception e) {
				LOG.error("Error loading embedded cover: {} - {}", trackFilePath, e.getMessage());
			}
		}

		return cover;
	}

	public Optional<byte[]> findAlbumCoverForAlbum(String albumName, String artistName) {
		// Find all tracks with this album and artist
		List<MPDSong> mpdSongs = new ArrayList<>(mpd.getSongSearcher()
			.search(new SearchCriteria(SongSearcher.ScopeType.ARTIST, artistName),
					new SearchCriteria(SongSearcher.ScopeType.ALBUM, albumName)));
		Optional<Optional<byte[]>> ret = mpdSongs.stream()
			.map(MPDSong::getFile)
			.map(this::loadMusicDirCover)
			.findFirst();
		return ret.orElseGet(Optional::empty);
	}

	/**
	 * Looks in a specific directory for a cover.
	 * @param dirPath The directory that contains a cover.
	 * @return The content of the found cover.
	 */
	public Optional<byte[]> loadArtworkForDir(String dirPath) {
		try {
			// Build the full path to search for the artwork that is the MPD
			// music_directory + dirPath
			Path path = Paths.get(ampdSettings.getMusicDirectory(), dirPath);
			MPDArtwork artwork = mpd.getArtworkFinder().find(path.toString()).iterator().next();
			return Optional.of(artwork.getBytes());
		}
		catch (Exception e) {
			LOG.debug("Could not load filename for Track: {} - {}", dirPath, e.getMessage());
		}
		return Optional.empty();
	}

	/**
	 * See if the path of track leads to an album directory and try to load the cover.
	 * @param track The track to find the artwork for.
	 * @return The bytes of the found cover.
	 */
	private Optional<byte[]> loadArtworkForTrack(MPDSong track) {
		try {
			return loadMusicDirCover(track.getFile());
		}
		catch (Exception e) {
			LOG.error("Could not load artwork for track: {}", track, e);
			return Optional.empty();
		}
	}

	/**
	 * Try to find a cover file in the directory of the track.
	 * @param trackFilePath The file path of a track.
	 * @return Cover as bytes or an empty optional if no cover was found.
	 */
	private Optional<byte[]> loadMusicDirCover(String trackFilePath) {
		String localDir = ampdSettings.getMusicDirectory();
		// Only look for local covers if a music directory is set
		if (localDir.isEmpty()) {
			LOG.trace("musicDirectory is empty - not looking for a cover in the track directory.");
			return Optional.empty();
		}
		LOG.trace("Looking for a cover in the directory of file: '{}/{}'", localDir, trackFilePath);
		Path path = Paths.get(localDir, trackFilePath);
		Path parent = path.getParent();
		if (parent == null) {
			return Optional.empty();
		}
		List<Path> covers = new ArrayList<>();
		try (DirectoryStream<Path> stream = Files.newDirectoryStream(parent, ampdSettings.getCoverNamePattern())) {
			stream.forEach(covers::add);
		}
		catch (IOException e) {
			LOG.trace("No covers found in directory: {}", parent);
			return Optional.empty();
		}
		try {
			return Optional.of(Files.readAllBytes(covers.get(0)));
		}
		catch (Exception e) {
			return Optional.empty();
		}
	}

}
