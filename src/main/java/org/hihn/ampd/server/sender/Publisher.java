package org.hihn.ampd.server.sender;

import org.bff.javampd.playlist.MPDPlaylistSong;
import org.bff.javampd.server.MPD;
import org.bff.javampd.server.ServerStatus;
import org.hihn.ampd.server.message.incoming.MpdModesPanelMsg;
import org.hihn.ampd.server.message.outgoing.Signals;
import org.hihn.ampd.server.message.outgoing.StatePayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Repeatedly sends information via websocket. Keeps all conntected clients up to date.
 */
@Component
public class Publisher {

	private static final Logger LOG = LoggerFactory.getLogger(Publisher.class);

	private static final String SIGNALS_URL = "/topic/signals";

	private static final String STATE_URL = "/topic/state";

	private final MPD mpd;

	private final SimpMessagingTemplate template;

	@Autowired
	public Publisher(MPD mpd, SimpMessagingTemplate template) {
		this.mpd = mpd;
		this.template = template;

		try {
			buildChangeListener();
		}
		catch (Exception e) {
			LOG.error("Error building change listener", e);
		}
	}

	/**
	 * Publishes the Mpd server state every second.
	 */
	@Scheduled(fixedRateString = "${publisher.delay}")
	public void publishState() {
		if (!mpd.isConnected()) {
			return;
		}
		// Tells javampd to get fresh data every second
		mpd.getServerStatus().setExpiryInterval(1L);
		ServerStatus serverStatus = mpd.getServerStatus();
		MpdModesPanelMsg mpdModesPanelMsg = new MpdModesPanelMsg(serverStatus);
		MPDPlaylistSong song = mpd.getPlayer().getCurrentSong().orElse(null);
		StatePayload statePayload = new StatePayload(serverStatus, song, mpdModesPanelMsg);
		template.convertAndSend(STATE_URL, statePayload);
	}

	private void buildChangeListener() {
		// Tells javampd to get fresh data every second
		mpd.getServerStatus().setExpiryInterval(1L);
		mpd.getStandAloneMonitor().start();
		mpd.getStandAloneMonitor().addPlaylistChangeListener(event -> {
			LOG.trace("PlaylistBasicChangeEvent fired");
			// Send a signal to the clients that the queue should be updated
			template.convertAndSend(SIGNALS_URL, Signals.UPDATE_QUEUE.getName());
		});

	}

}
