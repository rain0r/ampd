package org.hihn.ampd.server.message.outgoing.browse;

import java.util.Objects;

/**
 * Represents the structure of the payload payload returned to the frontend.
 */
public class Playlist implements Comparable<Playlist> {

  private int count;

  private String name;

  public Playlist(final String name, final int count) {
    this.name = name;
    this.count = count;
  }

  @Override
  public int compareTo(final Playlist o) {
    return name.compareTo(o.getName());
  }

  @Override
  public boolean equals(final Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    final Playlist playlist = (Playlist) o;

    if (count != playlist.count) {
      return false;
    }
    return Objects.equals(name, playlist.name);
  }

  public int getCount() {
    return count;
  }

  public void setCount(final int count) {
    this.count = count;
  }

  public String getName() {
    return name;
  }

  public void setName(final String name) {
    this.name = name;
  }

  @Override
  public int hashCode() {
    int result = name != null ? name.hashCode() : 0;
    result = 31 * result + count;
    return result;
  }

  @Override
  public String toString() {
    return "Playlist{" +
        "count=" + count +
        ", name='" + name + '\'' +
        '}';
  }
}
