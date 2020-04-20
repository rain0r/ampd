package org.hihn.ampd.server.message.outgoing.browse;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import org.bff.javampd.file.MPDFile;
import org.bff.javampd.song.MPDSong;

/**
 * Represents the structure of the browse payload returned to the frontend.
 */
public class BrowsePayload {

  private final ArrayList<MPDFile> directories = new ArrayList<>();

  private final ArrayList<MPDSong> tracks = new ArrayList<>();

  private final ArrayList<Playlist> playlists = new ArrayList<>();

  public void addDirectory(MPDFile mpdFile) {
    directories.add(mpdFile);
  }

  public void addTrack(MPDSong track) {
    tracks.add(track);
  }

  public void addPlaylists(Collection<Playlist> inputPlaylists) {
    playlists.addAll(inputPlaylists);
  }

  public List<MPDFile> getDirectories() {
    return Collections.unmodifiableList(directories);
  }

  public List<MPDSong> getTracks() {
    return Collections.unmodifiableList(tracks);
  }

  public List<Playlist> getPlaylists() {
    return Collections.unmodifiableList(playlists);
  }
}
