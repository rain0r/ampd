package org.hihn.ampd.server.message;

import org.hihn.ampd.server.message.AmpdMessage.MessageType;

/**
 * Defines the structure of a message exchanged between backend and frontend.
 */
public interface Message {

  MessageType getType();

  Object getPayload();
}
