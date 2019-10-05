package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.message.Message;

import java.util.Optional;

public interface AmpdCommandRunner {

  Optional<Message> run(Object pPayload);

}
