package org.hihn.ampd.server.message.outgoing.browse;

import org.bff.javampd.file.MPDFile;
import org.bff.javampd.song.MPDSong;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class BrowsePayload {

  private final ArrayList<MPDFile> directories = new ArrayList<>();

  private final ArrayList<MPDSong> songs = new ArrayList<>();

  private final ArrayList<Playlist> playlists = new ArrayList<>();


  public void addDirectory(MPDFile mpdFile) {
    directories.add(mpdFile);
  }

  public void addSong(MPDSong mpdSong) {
    songs.add(mpdSong);
  }

  public void addPlaylists(Collection<Playlist> pPlaylists) {
    playlists.addAll(pPlaylists);
  }

  public List<MPDFile> getDirectories() {
    return Collections.unmodifiableList(directories);
  }

  public List<MPDSong> getSongs() {
    return Collections.unmodifiableList(songs);
  }

  public List<Playlist> getPlaylists() {
    return Collections.unmodifiableList(playlists);
  }
}
