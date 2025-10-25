package org.hihn.ampd.server.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.hihn.ampd.server.service.albumart.AlbumArtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

/**
 * Endpoint for everything cover-releated.
 */
@Controller
@RequestMapping("/api")
public class CoverController {

	private final AlbumArtService albumArtService;

	@Autowired
	public CoverController(AlbumArtService albumArtService) {
		this.albumArtService = albumArtService;
	}

	/**
	 * Tries to find the cover for a directory.
	 * @param dirPath Path of a directory.
	 * @return The bytes of the found cover.
	 */
	@RequestMapping(value = { "/find-dir-cover" }, produces = MediaType.IMAGE_JPEG_VALUE)
	public @ResponseBody byte[] findAlbumCoverForDir(@RequestParam("path") String dirPath) {
		return albumArtService.loadArtworkForDir(dirPath)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, dirPath));
	}

	/**
	 * Tries to find the cover for a track.
	 * @param trackFilePath File path of a track.
	 * @return The bytes of the found cover.
	 */
	@RequestMapping(value = { "/find-track-cover" }, produces = MediaType.IMAGE_JPEG_VALUE)
	public @ResponseBody byte[] findAlbumCoverForTrack(@RequestParam("path") String trackFilePath) {
		return albumArtService.findAlbumCoverForTrack(trackFilePath)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

	@RequestMapping(value = { "/find-album-cover" }, produces = MediaType.IMAGE_JPEG_VALUE)
	public @ResponseBody byte[] findAlbumCoverForArtistAndName(@RequestParam("albumName") String albumName,
			@RequestParam("artistName") String artistName, HttpServletResponse response) {
		response.addHeader("Cache-Control", "max-age=604800, immutable");
		return albumArtService.findAlbumCoverForAlbum(albumName, artistName)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

}
