package org.hihn.ampd.server.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Saves and loads cover files locally.
 */
@Service
public class FileStorageService {

  private static final Logger LOG = LoggerFactory.getLogger(FileStorageService.class);

  @Value("${mpd.music.directory:}")
  // ':' sets an empty str if the prop is not set
  private String musicDirectory;


}
