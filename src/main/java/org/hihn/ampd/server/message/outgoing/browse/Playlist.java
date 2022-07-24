package org.hihn.ampd.server.message.outgoing.browse;

import java.util.Objects;

/**
 * Represents the structure of the payload payload returned to the frontend.
 */
public class Playlist implements Comparable<Playlist> {

	private int count;

	private String name;

	public Playlist(String name, int count) {
		this.name = name;
		this.count = count;
	}

	@Override
	public int compareTo(Playlist playlist) {
		return name.compareTo(playlist.getName());
	}

	@Override
	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (other == null || getClass() != other.getClass()) {
			return false;
		}

		Playlist playlist = (Playlist) other;

		if (count != playlist.count) {
			return false;
		}
		return Objects.equals(name, playlist.name);
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
