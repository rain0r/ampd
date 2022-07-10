package org.hihn.ampd.server.message.outgoing;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.song.MPDSong;

import java.util.Collection;

public class GenrePayload {

	private final String genre;

	private final Collection<MPDSong> tracks;

	private final Collection<MPDAlbum> albums;

	public GenrePayload(String genre, Collection<MPDSong> songs, Collection<MPDAlbum> albums) {
		this.genre = genre;
		this.tracks = songs;
		this.albums = albums;
	}

	public Collection<MPDSong> getTracks() {
		return tracks;
	}

	public Collection<MPDAlbum> getAlbums() {
		return albums;
	}

	public String getGenre() {
		return genre;
	}

}
