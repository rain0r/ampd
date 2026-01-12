package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.message.outgoing.SavePlaylistResponse;
import org.hihn.ampd.server.model.PlaylistInfo;
import org.hihn.ampd.server.service.PlaylistService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import static org.hihn.ampd.server.util.Constants.DEFAULT_PAGE_SIZE_REQ_PARAM;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Endpoint for everything playlist-related.
 */
@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

	private final PlaylistService playlistService;

	public PlaylistController(PlaylistService playlistService) {
		this.playlistService = playlistService;
	}

	/**
	 * Returns information about a playlist.
	 * @param playlistName Name of the playlist.
	 * @return An {@link PlaylistInfo} object.
	 */
	@RequestMapping(value = "/{name}", method = GET)
	public PlaylistInfo getPlaylist(@PathVariable("name") String playlistName,
			@RequestParam(defaultValue = "0") int pageIndex,
			@RequestParam(defaultValue = DEFAULT_PAGE_SIZE_REQ_PARAM) int pageSize) {
		return playlistService.getPlaylistInfo(playlistName, pageIndex, pageSize)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

	@PostMapping("/")
	public SavePlaylistResponse savePlaylist(@RequestBody String playlist) {
		return playlistService.savePlaylist(playlist);
	}

	@DeleteMapping(value = "/{name}")
	@ResponseStatus(HttpStatus.OK)
	public void delete(@PathVariable("name") String playlistName) {
		playlistService.deleteByName(playlistName);
	}

}
