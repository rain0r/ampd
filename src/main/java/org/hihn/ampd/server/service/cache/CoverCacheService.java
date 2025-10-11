package org.hihn.ampd.server.service.cache;

import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.CoverType;
import org.hihn.ampd.server.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * Handles the caching of album art.
 */
@Service
public class CoverCacheService {

	private static final Logger LOG = LoggerFactory.getLogger(CoverCacheService.class);

	private final boolean cacheEnabled;

	private Path cacheDir;

	/**
	 * Handles the caching of album art.
	 * @param ampdSettings Settings of this ampd instance.
	 * @param dirService Handles access to the ampd dir in the home directory.
	 */
	public CoverCacheService(AmpdSettings ampdSettings, DirService dirService) {
		cacheEnabled = ampdSettings.isLocalCoverCache();
		if (cacheEnabled) {
			cacheDir = dirService.getCacheDir();
			if (!cacheDir.toFile().exists() && !new File(cacheDir.toString()).mkdirs()) {
				LOG.warn("Could not create cache cover dir: {}", cacheDir);
			}
		}
	}

	/**
	 * Return who many disk space the cached cover use.
	 * @return The size of the cover cache dir in bytes.
	 */
	public long getCoverDiskUsage() {
		long size = 0;
		try (Stream<Path> linesStream = Files.walk(cacheDir).filter(p -> p.toFile().isFile())) {
			size = linesStream.mapToLong(p -> p.toFile().length()).sum();
		}
		catch (IOException e) {
			LOG.warn("Could not get the size of the cover cache dir", e);
		}
		return size;
	}

	/**
	 * Reads a file from disk.
	 * @param path The path of a file.
	 * @return The bytes of the file.
	 */
	public Optional<byte[]> loadFile(Path path) {
		try {
			return Optional.of(Files.readAllBytes(path));
		}
		catch (IOException e) {
			return Optional.empty();
		}
	}

	/**
	 * Loads a cover from the local cache.
	 * @param track The track to load the cover for.
	 * @return An optional with the bytes of the found cover in a successful case.
	 */
	public Optional<byte[]> loadCover(MPDSong track) {
		if (!cacheEnabled) {
			LOG.trace("Cache is disabled, not looking for a locally saved cover.");
			return Optional.empty();
		}
		Optional<Path> fullPath = buildCacheFullPath(track);
		if (fullPath.isEmpty() || !fullPath.get().toFile().exists()) {
			return Optional.empty();
		}
		try {
			LOG.trace("Loading cached cover: {}", fullPath.get());
			return loadFile(fullPath.get());
		}
		catch (Exception e) {
			return Optional.empty();
		}
	}

	/**
	 * Saves a given cover to the local cache.
	 * @param track The track to save the cover for.
	 * @param file The cover itself.
	 */
	public void saveCover(MPDSong track, byte[] file) {
		if (!cacheEnabled) {
			return;
		}
		buildCacheFullPath(track).ifPresent(path -> {
			try {
				// Don't write the file if it already exists
				if (!path.toFile().exists()) {
					LOG.debug("Saving cover: {}", path);
					Files.write(path, file);
				}
			}
			catch (IOException e) {
				LOG.warn("Failed to save cover to local cache", e);
			}
		});
	}

	private Optional<Path> buildCacheFullPath(MPDSong track) {
		CoverType coverType = StringUtils.isNullOrEmpty(track.getAlbumName()) ? CoverType.SINGLETON : CoverType.ALBUM;
		String titleOrAlbum = (coverType == CoverType.ALBUM) ? track.getAlbumName() : track.getTitle();
		if (titleOrAlbum == null || track.getArtistName() == null) {
			return Optional.empty();
		}
		String fileName = coverType.getPrefix() + track.getArtistName().trim().hashCode() + "_"
				+ titleOrAlbum.trim().hashCode() + ".jpg";
		try {
			return Optional.of(Paths.get(cacheDir.toString(), fileName).toAbsolutePath());
		}
		catch (InvalidPathException e) {
			LOG.error("Error getting Path for: {}", fileName, e);
			return Optional.empty();
		}
	}

}
