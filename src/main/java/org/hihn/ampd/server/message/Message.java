package org.hihn.ampd.server.message;

import java.util.Map;
import org.hihn.ampd.server.message.AmpdMessage.MessageType;

/**
 * Defines the structure of a message exchanged between backend and frontend.
 */
public interface Message {

  Map<String, Object> getPayload();

  MessageType getType();
}
