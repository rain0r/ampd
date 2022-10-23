package org.hihn.ampd.server.util;

public class StringUtils {

	public static boolean isNullOrEmpty(String input) {
		// Null-safe, short-circuit evaluation.
		return input == null || input.trim().isEmpty();
	}

}
