package org.hihn.ampd.server.sender;

import org.bff.javampd.playlist.MPDPlaylistSong;
import org.bff.javampd.server.MPD;
import org.bff.javampd.server.ServerStatus;
import org.hihn.ampd.server.message.incoming.MpdModesPanelMsg;
import org.hihn.ampd.server.message.outgoing.StatePayload;
import org.hihn.ampd.server.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Repeatedly sends information via websocket. Keeps all conntected clients up to date.
 */
@Component
public class Publisher {

	private static final String QUEUE_URL = "/topic/queue";

	private static final String STATE_URL = "/topic/state";

	private final MPD mpd;

	private final SimpMessagingTemplate template;

	private final QueueService queueService;

	@Autowired

	public Publisher(MPD mpd, SimpMessagingTemplate template, QueueService queueService) {
		this.mpd = mpd;
		this.template = template;
		this.queueService = queueService;
	}

	/**
	 * Publishes the queue every second.
	 */
	@Scheduled(fixedRateString = "${publisher.delay}")
	public void publishQueue() {
		if (!mpd.isConnected()) {
			return;
		}
		// Tells javampd to get fresh data every second
		mpd.getServerStatus().setExpiryInterval(1L);
		template.convertAndSend(QUEUE_URL, queueService.getQueue());
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

}
