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

  private final List<MpdFile> directories = new ArrayList<>();

  private final List<Playlist> playlists = new ArrayList<>();

  private final List<MpdSong> tracks = new ArrayList<>();

  public void addDirectory(final MpdFile mpdFile) {
    directories.add(mpdFile);
  }

  public void addPlaylists(final Collection<Playlist> inputPlaylists) {
    playlists.addAll(inputPlaylists);
  }

  public void addTrack(final MpdSong track) {
    tracks.add(track);
  }

  public List<MpdFile> getDirectories() {
    return Collections.unmodifiableList(directories);
  }

  public List<Playlist> getPlaylists() {
    return Collections.unmodifiableList(playlists);
  }

  public List<MpdSong> getTracks() {
    return Collections.unmodifiableList(tracks);
  }
}
