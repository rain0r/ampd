package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.playlist.MPDPlaylistSong;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.incoming.AddPlayAlbum;
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

	private static final Logger LOG = LoggerFactory.getLogger(QueueService.class);

	private final MPD mpd;

	/**
	 * Service to manage the queue.
	 * @param mpd Represents a connection to an MPD server.
	 */
	public QueueService(final MPD mpd) {
		this.mpd = mpd;
	}

	/**
	 * Adds a track to the queue.
	 * @param file The path of the track.
	 */
	public void addTrack(final String file) {
		mpd.getPlaylist().addSong(file.trim());
	}

	/**
	 * Adds tracks to the queue.
	 * @param tracks The path of the tracks.
	 */
	public void addTracks(final List<String> tracks) {
		mpd.getPlaylist()
			.addSongs(tracks.stream()
				.map(track -> MPDSong.builder().file(track.trim()).build())
				.collect(Collectors.toList()));
	}

	/**
	 * Plays a track.
	 * @param path The path of the track.
	 */
	public void playTrack(final String path) {
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

	public void moveTrack(final int oldPos, final int newPos) {
		MPDPlaylistSong track = mpd.getPlaylist().getSongList().get(oldPos);
		mpd.getPlaylist().move(track, newPos);
	}

	public QueuePageImpl<MPDPlaylistSong> getQueue(final int pageIndex, final int pageSize) {
		LOG.trace("getQueue pageIndex: {}, pageSize: {}", pageIndex, pageSize);
		List<MPDPlaylistSong> songList = mpd.getPlaylist().getSongList();

		PagedListHolder<MPDPlaylistSong> pagedListHolder = new PagedListHolder<>(songList);
		pagedListHolder.setPage(pageIndex);
		pagedListHolder.setPageSize(pageSize);

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		QueuePageImpl<MPDPlaylistSong> page = new QueuePageImpl<>(pagedListHolder.getPageList(), pageable,
				songList.size(), sumQueuePlayTime(songList));

		LOG.trace("Page size: {}", page.getSize());

		return page;
	}

	public void addAlbum(final AddPlayAlbum addPlayAlbum) {
		mpd.getPlaylist()
			.insertAlbum(MPDAlbum.builder(addPlayAlbum.getName()).albumArtist(addPlayAlbum.getAlbumArtist()).build());
	}

	public void addPlayAlbum(final AddPlayAlbum addPlayAlbum) {
		addAlbum(addPlayAlbum);
		mpd.getPlayer().play();
	}

	private Integer sumQueuePlayTime(final List<MPDPlaylistSong> songList) {
		return songList.stream().map(MPDPlaylistSong::getLength).mapToInt(Integer::intValue).sum();
	}

}
