package org.hihn.ampd.server.message;

public interface Message {

  AmpdMessage.MESSAGE_TYPE getType();

  Object getPayload();

}
