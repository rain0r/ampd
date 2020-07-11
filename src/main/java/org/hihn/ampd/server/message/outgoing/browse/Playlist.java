package org.hihn.ampd.server.message.outgoing.browse;

/**
 * Represents the structure of the payload payload returned to the frontend.
 */
public class Playlist implements Comparable<Playlist> {

  private int count = 0;
  private String name;

  public Playlist(String name, int count) {
    this.name = name;
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

  public int getCount() {
    return count;
  }

  public void setCount(int count) {
    this.count = count;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Override
  public int hashCode() {
    int result = name != null ? name.hashCode() : 0;
    result = 31 * result + count;
    return result;
  }
}
