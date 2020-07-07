package org.hihn.ampd.server.message.outgoing.browse;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import org.bff.javampd.file.MpdFile;
import org.bff.javampd.song.MpdSong;

/**
 * Represents the structure of the browse payload returned to the frontend.
 */
public class BrowsePayload {

  private final ArrayList<MpdFile> directories = new ArrayList<>();

  private final ArrayList<MpdSong> tracks = new ArrayList<>();

  private final ArrayList<Playlist> playlists = new ArrayList<>();

  public void addDirectory(MpdFile mpdFile) {
    directories.add(mpdFile);
  }

  public void addTrack(MpdSong track) {
    tracks.add(track);
  }

  public void addPlaylists(Collection<Playlist> inputPlaylists) {
    playlists.addAll(inputPlaylists);
  }

  public List<MpdFile> getDirectories() {
    return Collections.unmodifiableList(directories);
  }

  public List<MpdSong> getTracks() {
    return Collections.unmodifiableList(tracks);
  }

  public List<Playlist> getPlaylists() {
    return Collections.unmodifiableList(playlists);
  }
}
