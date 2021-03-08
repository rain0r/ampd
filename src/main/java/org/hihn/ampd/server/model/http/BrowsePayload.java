package org.hihn.ampd.server.model.http;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import org.bff.javampd.file.MPDFile;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.outgoing.browse.Playlist;


/**
 * Represents the structure of the browse payload returned to the frontend.
 */
public class BrowsePayload {

  private final List<MPDFile> directories = new ArrayList<>();

  private final List<Playlist> playlists = new ArrayList<>();

  private final List<MPDSong> tracks = new ArrayList<>();

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

}
