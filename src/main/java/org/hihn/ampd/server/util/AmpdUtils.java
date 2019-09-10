package org.hihn.ampd.server.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.Normalizer;
import java.util.Optional;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AmpdUtils {

  private static final Logger LOG = LoggerFactory.getLogger(AmpdUtils.class);

  private static final String EMPTY = "";

  public static Optional<byte[]> loadFile(Path path) {
    Optional<byte[]> ret = Optional.empty();
    try {
      ret = Optional.of(Files.readAllBytes(path));
    } catch (IOException e) {
      LOG.error("File not found: " + path);
    }
    return ret;
  }

  public static String stripAccents(final String input) {
    if (input == null) {
      return null;
    }
    final Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+"); //$NON-NLS-1$
    final StringBuilder decomposed =
        new StringBuilder(Normalizer.normalize(input, Normalizer.Form.NFD));
    convertRemainingAccentCharacters(decomposed);
    // Note that this doesn't correctly remove ligatures...
    return pattern.matcher(decomposed).replaceAll(EMPTY);
  }

  private static void convertRemainingAccentCharacters(final StringBuilder decomposed) {
    for (int i = 0; i < decomposed.length(); i++) {
      if (decomposed.charAt(i) == '\u0141') {
        decomposed.deleteCharAt(i);
        decomposed.insert(i, 'L');
      } else if (decomposed.charAt(i) == '\u0142') {
        decomposed.deleteCharAt(i);
        decomposed.insert(i, 'l');
      }
    }
  }
}
