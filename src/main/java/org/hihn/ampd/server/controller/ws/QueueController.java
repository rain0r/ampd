package org.hihn.ampd.server.controller.ws;

import org.bff.javampd.file.MPDFile;
import org.bff.javampd.playlist.MPDPlaylistSong;
import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.message.incoming.AddPlayAlbum;
import org.hihn.ampd.server.message.incoming.MoveTrackMsg;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.QueuePageImpl;
import org.hihn.ampd.server.service.QueueService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.List;

import static org.hihn.ampd.server.util.Constants.DEFAULT_PAGE_SIZE_REQ_PARAM;

/**
 * Websocket endpoint to control the queue. Besides getting the current queue, it also
 * provides endpoints to add directories, tracks and playlists.
 */
@Controller
@MessageMapping("/queue")
public class QueueController {

	private static final Logger LOG = LoggerFactory.getLogger(QueueController.class);

	private final MPD mpd;

	private final AmpdSettings ampdSettings;

	private final QueueService queueService;

	/**
	 * Endpoint that provides access to the MPD queue.
	 * @param mpd Represents a connection to a MPD server.
	 * @param ampdSettings Settings of this ampd instance.
	 * @param queueService Service to manage the queue.
	 */
	public QueueController(MPD mpd, AmpdSettings ampdSettings, QueueService queueService) {
		this.mpd = mpd;
		this.ampdSettings = ampdSettings;
		this.queueService = queueService;
	}

	@MessageMapping("/page")
	@SendToUser("/topic/queue")
	public QueuePageImpl<MPDPlaylistSong> getPage(PageEvent pageEvent) {
		return queueService.getQueue(pageEvent.pageIndex(), pageEvent.pageSize());
	}

	/**
	 * Removes all tracks from the queue.
	 */
	@MessageMapping("/clear")
	public void clearQueue() {
		mpd.getPlaylist().clearPlaylist();
		if (ampdSettings.isResetModesOnClear()) {
			mpd.getPlayer().setRandom(false);
			mpd.getPlayer().setRepeat(false);
			mpd.getPlayer().setXFade(0);
			mpd.getPlayer().setConsume(false);
			mpd.getPlayer().setSingle(false);
		}
	}

	@MessageMapping("/add-tracks")
	public void addTracks(final List<String> tracks) {
		queueService.addTracks(tracks);
	}

	@MessageMapping("/add-dir")
	public void addDir(final String dir) {
		mpd.getPlaylist().addFileOrDirectory(MPDFile.builder(dir).directory(true).build());
	}

	@MessageMapping("/add-album")
	public void addAlbum(final AddPlayAlbum addPlayAlbum) {
		queueService.addAlbum(addPlayAlbum);
	}

	@MessageMapping("/play-album")
	public void addPlayAlbum(final AddPlayAlbum addPlayAlbum) {
		queueService.addPlayAlbum(addPlayAlbum);
	}

	/**
	 * Adds all tracks from a playlist to the queue.
	 * @param playlist The name of the playlist.
	 */
	@MessageMapping("/add-playlist")
	public void addPlaylist(final String playlist) {
		queueService.addPlaylist(playlist);
	}

	@MessageMapping("/add-play-track")
	public void addPlayTrack(final String file) {
		queueService.addTrack(file);
		queueService.playTrack(file);
	}

	@MessageMapping("/remove-track")
	public void removeTrack(final int position) {
		mpd.getPlaylist().removeSong(position);
	}

	@MessageMapping("/play-track")
	public void playTrack(final String file) {
		queueService.playTrack(file);
	}

	@MessageMapping("/move-track")
	public void moveTrack(final MoveTrackMsg moveTrackMsg) {
		queueService.moveTrack(moveTrackMsg.getOldPos(), moveTrackMsg.getNewPos());
	}

	public record PageEvent(int pageIndex, int pageSize) {
		public PageEvent(int pageIndex, int pageSize) {
			this.pageIndex = Math.max(pageIndex, 0);
			this.pageSize = (pageSize < 20) ? Integer.parseInt(DEFAULT_PAGE_SIZE_REQ_PARAM) : pageSize;
		}
	}

}
