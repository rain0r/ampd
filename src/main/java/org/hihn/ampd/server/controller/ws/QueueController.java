package org.hihn.ampd.server.controller.ws;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.file.MPDFile;
import org.bff.javampd.playlist.MPDPlaylistSong;
import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.message.incoming.MoveTrackMsg;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.QueuePageImpl;
import org.hihn.ampd.server.service.QueueService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;

/**
 * Websocket endpoint to control the queue. Besides getting the current queue, it also
 * provides endpoints to add directories, tracks and playlists.
 */
@Controller
@MessageMapping("/queue")
public class QueueController {

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

	@MessageMapping("/")
	@SendTo("/topic/queue")
	public QueuePageImpl<MPDPlaylistSong> getQueue() {
		return queueService.getQueue();
	}

	@MessageMapping("/page")
	// @SendTo("/topic/page")
	@SendTo("/topic/queue")
	public QueuePageImpl<MPDPlaylistSong> getPage(PageEvent pageEvent) {
		return queueService.getQueue(pageEvent.getPageIndex(), pageEvent.getPageSize());
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
	public void addTracks(ArrayList<String> tracks) {
		queueService.addTracks(tracks);
	}

	@MessageMapping("/add-dir")
	public void addDir(String dir) {
		mpd.getPlaylist().addFileOrDirectory(MPDFile.builder(dir).directory(true).build());
	}

	@MessageMapping("/add-album")
	public void addAlbum(MPDAlbum mpdAlbum) {
		mpd.getPlaylist().insertAlbum(mpdAlbum);
	}

	/**
	 * Adds all tracks from a playlist to the queue.
	 * @param playlist The name of the playlist.
	 */
	@MessageMapping("/add-playlist")
	public void addPlaylist(String playlist) {
		queueService.addPlaylist(playlist);
	}

	@MessageMapping("/add-play-track")
	public void addPlayTrack(String file) {
		queueService.addTrack(file);
		queueService.playTrack(file);
	}

	@MessageMapping("/remove-track")
	public void removeTrack(int position) {
		mpd.getPlaylist().removeSong(position);
	}

	@MessageMapping("/play-track")
	public void playTrack(String file) {
		queueService.playTrack(file);
	}

	@MessageMapping("/move-track")
	public void moveTrack(MoveTrackMsg moveTrackMsg) {
		queueService.moveTrack(moveTrackMsg.getOldPos(), moveTrackMsg.getNewPos());
	}

	public static final class PageEvent {

		private int pageIndex;

		private int pageSize;

		public int getPageIndex() {
			return pageIndex;
		}

		public void setPageIndex(int pageIndex) {
			this.pageIndex = pageIndex;
		}

		public int getPageSize() {
			return pageSize;
		}

		public void setPageSize(int pageSize) {
			this.pageSize = pageSize;
		}

	}

}
