package org.hihn.ampd.server.model;

import java.util.Collection;
import org.bff.javampd.song.MPDSong;

/**
 * Holds information about a saved playlist.
 */
public class PlaylistInfo {

	private String name;

	private int trackCount;

	private Collection<MPDSong> tracks;

	/**
	 * Holds information about a saved playlist.
	 * @param name The name of the saved playlist.
	 * @param trackCount Number of tracks in this playlist.
	 * @param tracks The tracks in this playlist.
	 */
	public PlaylistInfo(final String name, final int trackCount, final Collection<MPDSong> tracks) {
		this.name = name;
		this.trackCount = trackCount;
		this.tracks = tracks;
	}

	public String getName() {
		return name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public int getTrackCount() {
		return trackCount;
	}

	public void setTrackCount(final int trackCount) {
		this.trackCount = trackCount;
	}

	public Collection<MPDSong> getTracks() {
		return tracks;
	}

	public void setTracks(final Collection<MPDSong> tracks) {
		this.tracks = tracks;
	}

}
