package org.hihn.ampd.server.model;

import org.bff.javampd.song.MPDSong;
import org.springframework.data.domain.PageImpl;

/**
 * Holds information about a saved playlist.
 */
public class PlaylistInfo {

	private String name;

	private PageImpl<MPDSong> tracks;

	/**
	 * Holds information about a saved playlist.
	 * @param name The name of the saved playlist.
	 * @param tracks The tracks in this playlist.
	 */
	public PlaylistInfo(String name, PageImpl<MPDSong> tracks) {
		this.name = name;
		this.tracks = tracks;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public PageImpl<MPDSong> getTracks() {
		return tracks;
	}

	public void setTracks(PageImpl<MPDSong> tracks) {
		this.tracks = tracks;
	}

}
