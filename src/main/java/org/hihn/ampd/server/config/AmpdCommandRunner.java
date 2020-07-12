package org.hihn.ampd.server.config;

import java.util.Map;
import java.util.Optional;
import org.hihn.ampd.server.message.Message;

/**
 * Defines the structure of the websocket endpoint processing.
 */
public interface AmpdCommandRunner {

  Optional<Message> run(Map<String, Object> inputPayload);
}
