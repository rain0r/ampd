package org.hihn.ampd.server.message.outgoing.browse;


import org.bff.javampd.file.MPDFile;

/**
 * Represents a directory returned to the frontend.
 */
public class Directory extends MPDFile {

  public Directory(final String path) {
    super(path);
  }
}
