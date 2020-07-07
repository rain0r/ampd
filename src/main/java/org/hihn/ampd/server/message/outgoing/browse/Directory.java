package org.hihn.ampd.server.message.outgoing.browse;


import org.bff.javampd.file.MpdFile;

/**
 * Represents a directory returned to the frontend.
 */
public class Directory extends MpdFile {

  public Directory(String path) {
    super(path);
  }
}
