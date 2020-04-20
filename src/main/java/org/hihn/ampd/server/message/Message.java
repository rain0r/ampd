package org.hihn.ampd.server.message;

/**
 * Defines the structure of a message exchanged between backend and frontend.
 */
public interface Message {

  AmpdMessage.MESSAGE_TYPE getType();

  Object getPayload();
}
