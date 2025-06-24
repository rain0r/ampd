package org.hihn.ampd.server.util;

public class StringUtils {

	public static boolean isNullOrEmpty(String input) {
		// Null-safe, short-circuit evaluation.
		return input == null || input.trim().isEmpty();
	}

	public static String hexToAscii(char... hexStr) {
		return hexToAscii(String.valueOf(hexStr));
	}

	/**
	 * Converts a hexadecimal string to an ASCII string.
	 * @param hexStr The hexadecimal string to convert.
	 * @return ASCII representation of the input string.
	 */
	public static String hexToAscii(String hexStr) {
		StringBuilder output = new StringBuilder();

		for (int i = 0; i < hexStr.length(); i += 2) {
			String str = hexStr.substring(i, i + 2);
			output.append((char) Integer.parseInt(str, 16));
		}

		return output.toString();
	}

	public static String byteToHex(byte num) {
		char[] hexDigits = new char[2];
		hexDigits[0] = Character.forDigit((num >> 4) & 0xF, 16);
		hexDigits[1] = Character.forDigit((num & 0xF), 16);
		return new String(hexDigits);
	}

	public static String bytesToHex(byte[] nums) {
		StringBuilder hexLine = new StringBuilder();
		for (byte b : nums) {
			hexLine.append(byteToHex(b));
		}
		return hexLine.toString();
	}

}
