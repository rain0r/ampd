package org.hihn.ampd.server.controller;

import java.util.Optional;
import org.hihn.ampd.server.message.Message;

public interface AmpdCommandRunner {

  Optional<Message> run(Object pPayload);

}
