package org.hihn.ampd.server.message.outgoing.browse;

import java.util.ArrayList;
import org.bff.javampd.file.MPDFile;
import org.bff.javampd.song.MPDSong;

public class BrowsePayload {

  private final ArrayList<MPDFile> directories = new ArrayList<>();

  private final ArrayList<MPDSong> songs = new ArrayList<>();

  private final ArrayList<Playlist> playlists = new ArrayList<>();

  public ArrayList<MPDFile> getDirectories() {
    return directories;
  }

  public ArrayList<MPDSong> getSongs() {
    return songs;
  }

  public ArrayList<Playlist> getPlaylists() {
    return playlists;
  }
}
