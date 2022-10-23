package org.hihn.ampd.server.util;

public class StringUtils {

	public static boolean isNullOrEmpty(String s) {
		// Null-safe, short-circuit evaluation.
		return s == null || s.trim().isEmpty();
	}

}
