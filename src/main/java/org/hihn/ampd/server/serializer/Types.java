package org.hihn.ampd.server.serializer;

public enum Types {

	INT("int"), BOOL("bool"), STR("str");

	private final String type;

	Types(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

}
