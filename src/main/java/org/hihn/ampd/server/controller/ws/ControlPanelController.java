package org.hihn.ampd.server.controller.ws;

import org.hihn.ampd.server.message.AmpdMessage.MessageType;
import org.hihn.ampd.server.sender.ControlPanelService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;

public class ControlPanelController {

  private static final Logger LOG = LoggerFactory.getLogger(ControlPanelController.class);

  public static final String CONTROL_PANEL_PATH = "/control-panel";

  private final ControlPanelService controlPanelService;

  public ControlPanelController(
      ControlPanelService controlPanelService) {
    this.controlPanelService = controlPanelService;
  }

  @MessageMapping(CONTROL_PANEL_PATH)
  @SendTo("/topic" + CONTROL_PANEL_PATH)
  public void controlPanel(@Payload MessageType messageType) {
    LOG.debug("Got messageType: {}", messageType);
    controlPanelService.handle(messageType);
  }
}
