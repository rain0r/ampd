package org.hihn.ampd.server.service;

import org.bff.javampd.file.MPDFile;
import org.bff.javampd.server.MPD;
import org.bff.javampd.server.MPDConnectionException;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.outgoing.browse.BrowsePayload;
import org.hihn.ampd.server.message.outgoing.browse.Playlist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.TreeSet;

/**
 * Provides methods to browse the MPD library.
 */
@Service
public class BrowseService {

	private static final Logger LOG = LoggerFactory.getLogger(BrowseService.class);

	private final MPD mpd;

	public BrowseService(MPD mpd) {
		this.mpd = mpd;
	}

	/**
	 * General browse request for a path. Includes directories, tracks and playlists.
	 * @param path The path to browse
	 * @return Object with the directories, tracks and playlist of the given path.
	 */
	public BrowsePayload browse(final String path) {
		/* Remove leading slashes */
		String cleanPath = path.replaceAll("^/+", "").trim();
		/* Outgoing payload */
		BrowsePayload browsePayload = findDirsAndTracks(path);
		if ("/".equals(cleanPath) || cleanPath.isEmpty()) {
			/* Only look for playlists if we're on the root */
			browsePayload.addPlaylists(getPlaylists());
		}
		browsePayload.setDirParam(path);
		return browsePayload;
	}

	/**
	 * Lists the contents of the given directory in the MPD library.
	 * @param path Path relative to the MPD root library.
	 * @return Object with the directories and tracks of the given path.
	 */
	public BrowsePayload findDirsAndTracks(String path) {
		BrowsePayload browsePayload = new BrowsePayload();
		// Build a MPDFile from the input path
		MPDFile startDir = MPDFile.builder(path).build();
		startDir.setDirectory(true);
		Collection<MPDFile> foundFiles = new ArrayList<>();
		try {
			foundFiles = mpd.getMusicDatabase().getFileDatabase().listDirectory(startDir);
		}
		catch (Exception e) {
			LOG.error("Error listing directory for path: '{}'", path);
		}
		for (MPDFile file : foundFiles) {
			if (file.isDirectory()) {
				browsePayload.addDirectory(MPDFile.builder(file.getPath()).directory(true).build());
			}
			else {
				String cleanedPath = file.getPath().replaceAll("'", "\\'");
				Collection<MPDSong> searchResults = mpd.getMusicDatabase()
					.getSongDatabase()
					.searchFileName(cleanedPath);
				if (!searchResults.isEmpty()) {
					browsePayload.addTrack(searchResults.iterator().next());
				}
			}
		}
		return browsePayload;
	}

	/**
	 * Returns all playlists saved on the MPD server.
	 * @return List of saved playlists.
	 */
	private Collection<Playlist> getPlaylists() {
		TreeSet<Playlist> ret = new TreeSet<>();
		Collection<String> playlists = List.of();
		try {
			playlists = mpd.getMusicDatabase().getPlaylistDatabase().listPlaylists();
		}
		catch (MPDConnectionException e) {
			LOG.error("Could not list playlists: {}", e.getMessage());
		}
		for (String playlist : playlists) {
			int count = 0;
			try {
				count = mpd.getMusicDatabase().getPlaylistDatabase().countPlaylistSongs(playlist);
			}
			catch (MPDConnectionException e) {
				LOG.error("Could not get song count for playlist: {}", playlist);
			}
			ret.add(new Playlist(playlist, count));
		}
		return ret;
	}

}
