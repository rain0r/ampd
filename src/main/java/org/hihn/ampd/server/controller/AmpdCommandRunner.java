package org.hihn.ampd.server.controller;

import java.util.Optional;
import org.hihn.ampd.server.message.Message;

/**
 * Defines the structure of the endpoint processing.
 */
public interface AmpdCommandRunner {

  Optional<Message> run(Object inputPayload);
}
