package org.hihn.ampd.server.message.incoming;

import org.bff.javampd.server.ServerStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;

/**
 * Represents a MPD control panel.
 */
public class MpdModesPanelMsg {

	private static final Logger LOG = LoggerFactory.getLogger(MpdModesPanelMsg.class);

	private boolean consume;

	private boolean crossfade;

	private boolean random;

	private boolean repeat;

	private boolean single;

	/**
	 * Used for incoming message deserialization.
	 */
	public MpdModesPanelMsg() {
	}

	/**
	 * Represents a MPD control panel.
	 * @param serverStatus ServerStatus provided by MPD.
	 */
	public MpdModesPanelMsg(final ServerStatus serverStatus) {
		final Collection<String> statusList = serverStatus.getStatus();

		// crossfade is not part of the statusList so can't assign in it the for loop
		setCrossfade(serverStatus.getXFade() == 1);

		for (final String status : statusList) {
			final String[] splitted = status.split(":");
			final boolean newValue = "1".equals(splitted[1].trim());

			switch (splitted[0].trim()) {
				case "random":
					setRandom(newValue);
					break;
				case "consume":
					setConsume(newValue);
					break;
				case "single":
					setSingle(newValue);
					break;
				case "repeat":
					setRepeat(newValue);
					break;
				default:
					// Do nothing
			}
		}
	}

	public boolean isConsume() {
		return consume;
	}

	public void setConsume(boolean consume) {
		this.consume = consume;
	}

	public boolean isCrossfade() {
		return crossfade;
	}

	public void setCrossfade(boolean crossfade) {
		this.crossfade = crossfade;
	}

	public boolean isRandom() {
		return random;
	}

	public void setRandom(boolean random) {
		this.random = random;
	}

	public boolean isRepeat() {
		return repeat;
	}

	public void setRepeat(boolean repeat) {
		this.repeat = repeat;
	}

	public boolean isSingle() {
		return single;
	}

	public void setSingle(boolean single) {
		this.single = single;
	}

}
