package org.hihn.ampd.server.util;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Misc utility methods.
 */
public class AmpdUtils {

  private static final Logger LOG = LoggerFactory.getLogger(AmpdUtils.class);

  /**
   * Reads a file from disk.
   *
   * @param path The path of a file.
   * @return The bytes of the file.
   */
  public static byte[] loadFile(Path path) {
    byte[] ret = null;
    try {
      ret = Files.readAllBytes(path);
    } catch (IOException e) {
      LOG.info("File not found: " + path);
    }
    return ret;
  }

  /**
   * Strips all unpleasant characters from a string.
   *
   * @param input Input string to strip.
   * @return The stripped string.
   */
  public static String stripAccents(final String input) {
    if (input == null) {
      return null;
    }
    final Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+"); // $NON-NLS-1$
    final StringBuilder decomposed =
        new StringBuilder(Normalizer.normalize(input, Normalizer.Form.NFD));
    return pattern.matcher(decomposed).replaceAll("");
  }

  /**
   * Scans given dir for covers.
   *
   * @param path The dir to search for covers.
   * @return A list of found covers.
   */
  @edu.umd.cs.findbugs.annotations.SuppressFBWarnings(
      value = "RCN_REDUNDANT_NULLCHECK_WOULD_HAVE_BEEN_A_NPE",
      justification = "It's a java 11 compiler bug")
  public static List<Path> scanDir(Path path) {
    List<Path> covers = new ArrayList<>();
    try (DirectoryStream<Path> stream = Files.newDirectoryStream(path, "cover.{jpg,jpeg,png}")) {
      stream.forEach(file -> covers.add(file));
    } catch (IOException e) {
      LOG.info("Error while search covers in: {}", path, e);
    }
    return covers;
  }
}
