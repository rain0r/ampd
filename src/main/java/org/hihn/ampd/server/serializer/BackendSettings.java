package org.hihn.ampd.server.serializer;

/**
 * Definiert ein Feld im Suchformular im Frontend
 */
public class BackendSettings {

	private final String name;

	private final String hint;

	private final String key;

	private final String type;

	private final String value;

	public BackendSettings(String name, String hint, String key, String type, String value) {
		this.name = name;
		this.hint = hint;
		this.key = key;
		this.type = type;
		this.value = value;
	}

	public String getName() {
		return name;
	}

	public String getHint() {
		return hint;
	}

	public String getKey() {
		return key;
	}

	public String getType() {
		return type;
	}

	public String getValue() {
		return value;
	}

}
