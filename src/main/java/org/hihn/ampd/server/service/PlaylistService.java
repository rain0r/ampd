package org.hihn.ampd.server.service;

import org.bff.javampd.server.MPD;
import org.bff.javampd.server.MPDConnectionException;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.outgoing.SavePlaylistResponse;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.PlaylistInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Provides methods to manage playlists.
 */
@Service
public class PlaylistService {

	private static final Logger LOG = LoggerFactory.getLogger(PlaylistService.class);

	private final MPD mpd;

	private final AmpdSettings ampdSettings;

	public PlaylistService(final MPD mpd, final AmpdSettings ampdSettings) {
		this.mpd = mpd;
		this.ampdSettings = ampdSettings;
	}

	/**
	 * Deletes a playlist.
	 * @param playlistName Name of the playlist to delete.
	 */
	public void deleteByName(final String playlistName) {
		if (ampdSettings.isDeletePlaylists()) {
			mpd.getPlaylist().deletePlaylist(playlistName);
		}
	}

	/**
	 * Saves the current queue to a playlist on the MPD server.
	 * @param playlistName Name of the new playlist.
	 * @return A {@link SavePlaylistResponse}-object containing the search results.
	 */
	public SavePlaylistResponse savePlaylist(final String playlistName) {
		SavePlaylistResponse response = new SavePlaylistResponse();
		response.setPlaylistName(playlistName);

		if (ampdSettings.isCreatePlaylists()) {
			Optional<String> existing = mpd.getMusicDatabase()
				.getPlaylistDatabase()
				.listPlaylists()
				.stream()
				.filter(pl -> pl.equals(playlistName))
				.findFirst();

			existing.ifPresent(playlist -> {
				if (!mpd.getMusicDatabase().getPlaylistDatabase().listPlaylistSongs(playlist).isEmpty()) {
					// Playlist already exists - delete it first
					deleteByName(playlist);
				}
			});

			try {
				response.setSuccess(mpd.getPlaylist().savePlaylist(playlistName));
			}
			catch (MPDConnectionException e) {
				response.setSuccess(false);
				response.setMessage(e.getMessage());
				LOG.error("Failed to create playlist: {}", playlistName, e);
			}
		}
		else {
			response.setSuccess(false);
			response.setMessage("Saving new playlists is disabled on the server.");
		}
		return response;
	}

	/**
	 * Gets info about a playlist from the MPD server.
	 * @param name The name of the playlist.
	 * @return Info about the specified playlist.
	 */
	public Optional<PlaylistInfo> getPlaylistInfo(final String name, final int pageIndex, final int pageSize) {
		Optional<PlaylistInfo> ret = Optional.empty();
		try {
			PageImpl<MPDSong> page = getPage(
					new ArrayList<>(mpd.getMusicDatabase().getPlaylistDatabase().listPlaylistSongs(name)), pageIndex,
					pageSize);
			ret = Optional.of(new PlaylistInfo(name, page));
		}
		catch (Exception e) {
			LOG.error("Could not get info about playlist: {}", name, e);
		}
		return ret;
	}

	private PageImpl<MPDSong> getPage(final List<MPDSong> playlists, final int pageIndex, final int pageSize) {
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		PagedListHolder<MPDSong> pages = new PagedListHolder<>(playlists);
		pages.setPage(pageIndex);
		pages.setPageSize(pageSize);
		return new PageImpl<>(pages.getPageList(), pageable, playlists.size());

	}

}
