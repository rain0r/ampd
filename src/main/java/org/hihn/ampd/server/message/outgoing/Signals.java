package org.hihn.ampd.server.message.outgoing;

public enum Signals {

	UPDATE_QUEUE("UPDATE_QUEUE");

	private final String name;

	Signals(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

}
