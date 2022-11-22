package org.hihn.ampd.server.message.outgoing;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.song.MPDSong;
import org.springframework.data.domain.PageImpl;

public class GenrePayload {

	private final String genre;

	private final PageImpl<MPDSong> tracks;

	private final PageImpl<MPDAlbum> albums;

	public GenrePayload(String genre, PageImpl<MPDSong> songs, PageImpl<MPDAlbum> albums) {
		this.genre = genre;
		tracks = songs;
		this.albums = albums;
	}

	public PageImpl<MPDSong> getTracks() {
		return tracks;
	}

	public PageImpl<MPDAlbum> getAlbums() {
		return albums;
	}

	public String getGenre() {
		return genre;
	}

}
