package org.hihn.ampd.server.model;

/**
 * Holds info about Last.fm credential settings sent to the frontend.
 */
public class LastFmCred {

	private String apiKey;

	public String getApiKey() {
		return apiKey;
	}

	public void setApiKey(String apiKey) {
		this.apiKey = apiKey;
	}

}
