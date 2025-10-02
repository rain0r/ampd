package org.hihn.ampd.server.message.outgoing.browse;

import org.bff.javampd.file.MPDFile;
import org.bff.javampd.song.MPDSong;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Represents the structure of the browse payload returned to the frontend, containing
 * directories, tracks and playlists.
 */
public class BrowsePayload {

	private final List<MPDFile> directories = new ArrayList<>();

	private final List<Playlist> playlists = new ArrayList<>();

	private final List<MPDSong> tracks = new ArrayList<>();

	private String dirParam = "/";

	public void addDirectory(final MPDFile mpdFile) {
		directories.add(mpdFile);
	}

	public void addPlaylists(final Collection<Playlist> inputPlaylists) {
		playlists.addAll(inputPlaylists);
	}

	public void addTrack(final MPDSong track) {
		tracks.add(track);
	}

	public List<MPDFile> getDirectories() {
		return Collections.unmodifiableList(directories);
	}

	public List<Playlist> getPlaylists() {
		return Collections.unmodifiableList(playlists);
	}

	public List<MPDSong> getTracks() {
		return Collections.unmodifiableList(tracks);
	}

	public String getDirParam() {
		return dirParam;
	}

	public void setDirParam(String dirParam) {
		this.dirParam = dirParam;
	}

}
