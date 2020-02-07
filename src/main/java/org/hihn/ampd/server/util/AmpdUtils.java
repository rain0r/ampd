package org.hihn.ampd.server.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.Normalizer;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AmpdUtils {

  private static final Logger LOG = LoggerFactory.getLogger(AmpdUtils.class);

  private static final String EMPTY = "";

  public static byte[] loadFile(Path path) {
    byte[] ret = null;
    try {
      ret = Files.readAllBytes(path);
    } catch (IOException e) {
      LOG.info("File not found: " + path);
    }
    return ret;
  }

  public static String stripAccents(final String input) {
    if (input == null) {
      return null;
    }
    final Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+"); // $NON-NLS-1$
    final StringBuilder decomposed =
        new StringBuilder(Normalizer.normalize(input, Normalizer.Form.NFD));
    return pattern.matcher(decomposed).replaceAll(EMPTY);
  }
}
