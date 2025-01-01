package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.playlist.MPDPlaylistSong;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.incoming.AddPlayAlbum;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.QueuePageImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Provides methods to manage the queue.
 */
@Service
public class QueueService {

	private final AmpdSettings ampdSettings;

	private static final Logger LOG = LoggerFactory.getLogger(QueueService.class);

	private final MPD mpd;

	private int pageSize;

	/**
	 * Service to manage the queue.
	 * @param ampdSettings
	 * @param mpd Represents a connection to a MPD server.
	 */
	public QueueService(AmpdSettings ampdSettings, MPD mpd) {
		this.ampdSettings = ampdSettings;
		this.mpd = mpd;
		this.pageSize = ampdSettings.getQueuePageSize();
	}

	/**
	 * Adds a track to the queue.
	 * @param file The path of the track.
	 */
	public void addTrack(String file) {
		mpd.getPlaylist().addSong(file.trim());
	}

	/**
	 * Adds tracks to the queue.
	 * @param tracks The path of the tracks.
	 */
	public void addTracks(List<String> tracks) {
		mpd.getPlaylist()
			.addSongs(tracks.stream()
				.map(track -> MPDSong.builder().file(track.trim()).build())
				.collect(Collectors.toList()));
	}

	/**
	 * Plays a track.
	 * @param path The path of the track.
	 */
	public void playTrack(String path) {
		mpd.getPlaylist()
			.getSongList()
			.stream()
			.filter(song -> song.getFile().equals(path))
			.findFirst()
			.ifPresentOrElse(song -> mpd.getPlayer().playSong(song),
					() -> LOG.info("Could not find playlist track: {}", path));
	}

	/**
	 * Adds a saved playlist to the queue.
	 * @param playlist Name of the playlist to add.
	 */
	public void addPlaylist(String playlist) {
		mpd.getPlaylist().loadPlaylist(playlist);
	}

	public void moveTrack(int oldPos, int newPos) {
		MPDPlaylistSong track = mpd.getPlaylist().getSongList().get(oldPos);
		mpd.getPlaylist().move(track, newPos);
	}

	public QueuePageImpl<MPDPlaylistSong> getQueue() {
		return getQueue(0, pageSize);
	}

	public QueuePageImpl<MPDPlaylistSong> getQueue(final int pageIndex, final Integer pageSize) {
		final int sanitizedPageSize = sanitizePageSize(pageSize);
		List<MPDPlaylistSong> songList = mpd.getPlaylist().getSongList();
		PagedListHolder<MPDPlaylistSong> pages = new PagedListHolder<>(songList);
		Pageable pageable = PageRequest.of(pageIndex, sanitizedPageSize);
		pages.setPage(pageIndex);
		pages.setPageSize(sanitizedPageSize);
		QueuePageImpl<MPDPlaylistSong> page = new QueuePageImpl<>(pages.getPageList(), pageable, songList.size());
		page.setTotalPlayTime(sumQueuePlayTime(songList));
		return page;
	}

	public void addAlbum(AddPlayAlbum addPlayAlbum) {
		mpd.getPlaylist()
			.insertAlbum(MPDAlbum.builder(addPlayAlbum.getName()).albumArtist(addPlayAlbum.getAlbumArtist()).build());
	}

	public void addPlayAlbum(AddPlayAlbum addPlayAlbum) {
		addAlbum(addPlayAlbum);
		mpd.getPlayer().play();
	}

	private Integer sumQueuePlayTime(List<MPDPlaylistSong> songList) {
		return songList.stream().map(MPDPlaylistSong::getLength).mapToInt(Integer::intValue).sum();
	}

	private int sanitizePageSize(final Integer pageSize) {
		final int sanitizedPageSize = pageSize == null || pageSize < 1 ? this.pageSize : pageSize;
		this.pageSize = sanitizedPageSize;
		return sanitizedPageSize;
	}

}
