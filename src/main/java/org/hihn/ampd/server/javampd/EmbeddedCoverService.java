package org.hihn.ampd.server.javampd;

import org.apache.commons.codec.binary.Hex;
import org.bff.javampd.server.MPDConnectionException;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.util.List;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.hihn.ampd.server.util.StringUtils.bytesToHex;
import static org.hihn.ampd.server.util.StringUtils.isNullOrEmpty;

/**
 * Establishes an extra connection to the MPD server to send the command
 * {@code readpicture}. The MPD server will then reply with the embedded cover art.
 */
@Service
@CacheConfig(cacheNames = "EmbeddedCoverServiceCovers")
public class EmbeddedCoverService {

	private static final Logger LOG = LoggerFactory.getLogger(EmbeddedCoverService.class);

	private Socket socket;

	private final AmpdSettings ampdSettings;

	public EmbeddedCoverService(AmpdSettings ampdSettings) {
		this.ampdSettings = ampdSettings;
	}

	/**
	 * Sends a {@code readpicture} command to the MPD server.
	 * @param file The file passed as argument to {@code readpicture}.
	 * @return The embedded cover image as byte array.
	 */
	@Cacheable
	public synchronized byte[] getEmbeddedCover(String file) {
		connectSocket();

		Picture ret = new Picture();

		// Total size of the cover image
		int size = 0;

		do {
			// Position of the next chunk
			int offset = ret.getBinary().size();
			try {
				sendCommand(file, offset);
			}
			catch (IOException e) {
				LOG.error("Could not send command to MPD server: {}, parameters={}", "readpicture",
						List.of(String.valueOf(offset)));
				LOG.error(e.getMessage());
				connectSocket();
			}

			Picture p = loopReadSocket();

			try {
				ret.getBinary().write(p.getBinary().toByteArray());
				if (p.getSize() > 0 && ret.getSize() == 0) {
					size = p.getSize();
					ret.setSize(size);
				}
				if (isNullOrEmpty(ret.getType()) && !isNullOrEmpty(p.getType())) {
					ret.setType(p.getType());
				}
			}
			catch (IOException e) {
				LOG.error("Could not write to return ByteArrayOutputStream");
			}

			LOG.debug("size: {}", size);
			LOG.debug("ret.getBinary().size(): {}", ret.getBinary().size());
		}
		while (size > ret.getBinary().size());

		return ret.getBinary().toByteArray();
	}

	/**
	 * Try to read the incoming message in a loop to be sure to get the message.
	 * @return A {@code Picture} object that contains a chunk of the cover image.
	 */
	private Picture loopReadSocket() {
		Picture p = new Picture();
		for (int i = 0; i <= 10; i++) {
			try {
				p = readSocket();
			}
			catch (IOException e) {
				LOG.error("Error reading socket input stream");
				LOG.error(e.getMessage(), e);
			}
			if (p.getSize() > 0) {
				break;
			}
			try {
				// Wait a little before trying again
				Thread.sleep(100);
			}
			catch (InterruptedException e) {
				LOG.error("Error sleeping");
			}
		}
		return p;
	}

	private void sendCommand(String file, int offset) throws IOException {
		String command = "readpicture \"" + file + "\"";
		socket.getOutputStream().write(convertCommand(command, List.of(String.valueOf(offset))).getBytes(UTF_8));
	}

	/**
	 * Receives the actual cover image from the MPD server. Handles the reply to the
	 * {@code readpicture} command.
	 * @return A @{code Picture} object which holds a chunk of the whole cover image.
	 * @throws IOException If the socket to the MPD server could not be read.
	 */
	private Picture readSocket() throws IOException {
		// Holds the bytes of the current line from the MPD server response
		ByteArrayOutputStream line = new ByteArrayOutputStream();

		// Holds the bytes of the actual cover image
		ByteArrayOutputStream image = new ByteArrayOutputStream();

		// Type of the image (jpeg/png/...)
		String imageType = "";

		// Chunk size
		int binarySize = 0;

		// Total size of the cover
		int totalSize = 0;

		while (true) {
			if (socket.getInputStream().available() == 0) {
				break;
			}

			byte[] buf = new byte[1];
			if (socket.getInputStream().read(buf) == -1) {
				LOG.error("Error reading a byte from the socket input stream while trying to read one byte.");
				break;
			}

			// Read the input stream byte by byte until a newline is reached
			String c = StringUtils.hexToAscii(Hex.encodeHex(buf));
			LOG.debug("Received: {}", c);

			if (c.equals("\n")) {

				// Create a string from the previously received data
				String text = line.toString(UTF_8);

				if (text.contains("type: ")) {
					String[] split = text.split("type: ");
					imageType = split[1];
					LOG.debug("Image type: >{}<", imageType);
				}

				if (text.contains("size: ")) {
					String[] split = text.split("size: ");
					totalSize = Integer.parseInt(split[1]);
					LOG.debug("totalSize: >{}<", totalSize);
				}

				if (text.contains("binary: ")) {
					String[] split = text.split("binary: ");
					binarySize = Integer.parseInt(split[1]);
					LOG.debug("binarySize: >{}<", binarySize);
					break;
				}

				// Reset current line after a newline
				line = new ByteArrayOutputStream();
			}
			else {
				// Append to the currently read line
				line.write(buf);
			}
		}

		// The response included a chunk size so we read the specified amount of bytes
		// from the socket
		// This is the actual cover image
		if (binarySize > 0) {
			byte[] imgBuf = new byte[binarySize];
			if (socket.getInputStream().read(imgBuf) == -1) {
				LOG.debug("Error reading chunk size (cover image) from input stream");
			}
			else {
				image.write(imgBuf);
			}
		}

		// Finish the reply from the MPD server by checking if it ends with "OK"
		while (true) {
			int available = socket.getInputStream().available();
			if (available == 0) {
				break;
			}

			byte[] buf = new byte[available];
			if (socket.getInputStream().read(buf) == -1) {
				LOG.debug("Error reading end of message");
				break;
			}

			if (!isResponseOK(buf)) {
				LOG.debug("Response was not OK: {}", bytesToHex(buf));
				break;
			}
		}

		// Assemble a Picture object with all received information
		Picture p = new Picture(totalSize, imageType);
		p.getBinary().write(image.toByteArray());
		return p;
	}

	private synchronized void connectSocket() {
		LOG.debug("attempting to connect socket to {} with timeout of {}", ampdSettings.getMpdServer(), 0);
		socket = new Socket();
		SocketAddress socketAddress = new InetSocketAddress(ampdSettings.getMpdServer(), ampdSettings.getMpdPort());
		try {
			socket.connect(socketAddress, 0);
		}
		catch (Exception ioe) {
			LOG.error("failed to connect socket to {}", ampdSettings.getMpdServer());
			throw new MPDConnectionException(ioe);
		}
	}

	private static String convertCommand(String command, List<String> params) {
		var sb = new StringBuilder(command);
		for (String param : params) {
			param = param.replace("\"", "\\\\\"");
			sb.append(" \"").append(param).append("\"");
		}

		return sb.append("\n").toString();
	}

	private static boolean isResponseOK(byte[] buf) {
		if (buf.length == 0) {
			LOG.info("Response check failed. Line is null");
			return false;
		}

		// Is response "OK" or "list_OK"
		return bytesToHex(buf).endsWith("0a4f4b0a") || bytesToHex(buf).endsWith("6c6973745f4f4b");
	}

	/**
	 * Holds information about an embedded cover.
	 */
	public static class Picture {

		private ByteArrayOutputStream binary = new ByteArrayOutputStream();

		private String type;

		private int size;

		public Picture() {
		}

		public Picture(int size, String type) {

			this.size = size;
			this.type = type;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public int getSize() {
			return size;
		}

		public void setSize(int size) {
			this.size = size;
		}

		public ByteArrayOutputStream getBinary() {
			return binary;
		}

		public void setBinary(ByteArrayOutputStream binary) {
			this.binary = binary;
		}

	}

}
