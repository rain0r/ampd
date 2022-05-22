package org.hihn.ampd.server.message.outgoing.browse;

import java.time.LocalDateTime;

/**
 * Represents a directory returned to the frontend.
 */
public class Directory {

	private boolean directory;

	private String path;

	private LocalDateTime lastModified;

	public Directory(final String path) {
		// super(path);
		setDirectory(true);
	}

	public boolean isDirectory() {
		return directory;
	}

	public void setDirectory(boolean directory) {
		this.directory = directory;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public LocalDateTime getLastModified() {
		return lastModified;
	}

	public void setLastModified(LocalDateTime lastModified) {
		this.lastModified = lastModified;
	}

}
