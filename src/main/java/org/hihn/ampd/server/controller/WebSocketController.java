package org.hihn.ampd.server.controller;

import java.util.Optional;
import org.hihn.ampd.server.message.Message;
import org.hihn.ampd.server.message.incoming.IncomingMessage;
import org.hihn.ampd.server.service.CoverBlacklistService;
import org.hihn.ampd.server.service.MpdService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

/**
 * Handles the incoming websocket messages.
 */
@Controller
public class WebSocketController {

  private static final Logger LOG = LoggerFactory.getLogger(WebSocketController.class);

  private final MpdService mpdService;

  @Autowired
  public WebSocketController(final MpdService mpdService,
      CoverBlacklistService coverBlacklistService) {
    this.mpdService = mpdService;
    coverBlacklistService.loadBlacklistFile();
  }

  /**
   * Takes an {@link IncomingMessage}, processes it and sends back the return value.
   *
   * @param incomingMessage Contains the message type and additional parameters.
   * @return The result for the incoming message.
   */
  @MessageMapping("/mpd")
  @SendTo("/topic/controller")
  public Optional<Message> send(final IncomingMessage incomingMessage) {
    Optional<Message> outgoingMessage = Optional.empty();
    try {

      outgoingMessage = mpdService.process(incomingMessage);
    } catch (final Exception e) {
      LOG.error("Error processing {}", incomingMessage.getType());
      LOG.error(e.getMessage(), e);
    }
    return outgoingMessage;
  }
}
