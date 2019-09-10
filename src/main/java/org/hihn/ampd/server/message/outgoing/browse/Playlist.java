package org.hihn.ampd.server.message.outgoing.browse;

public class Playlist implements Comparable<Playlist> {

  private String name;

  private int count = 0;

  public Playlist(String name, int count) {
    this.name = name;
    this.count = count;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getCount() {
    return count;
  }

  public void setCount(int count) {
    this.count = count;
  }

  @Override
  public int compareTo(Playlist o) {
    return name.compareTo(o.getName());
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Playlist playlist = (Playlist) o;

    if (count != playlist.count) {
      return false;
    }
    return name != null ? name.equals(playlist.name) : playlist.name == null;
  }

  @Override
  public int hashCode() {
    int result = name != null ? name.hashCode() : 0;
    result = 31 * result + count;
    return result;
  }
}
