package org.hihn.ampd.server.message.incoming;

public class AddPlayAlbum {

	private String albumArtist;

	private String name;

	public AddPlayAlbum() {
	}

	public AddPlayAlbum(String albumArtist, String name) {
		this.albumArtist = albumArtist;
		this.name = name;
	}

	public String getAlbumArtist() {
		return albumArtist;
	}

	public void setAlbumArtist(String albumArtist) {
		this.albumArtist = albumArtist;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
