package org.hihn.ampd.server.model;

import de.umass.lastfm.Track;

import java.util.List;

/**
 * Holds info about Last.fm credential settings sent to the frontend.
 */
public class LastFmSimilarTracks {

	private String apiKey;

	private List<Track> similarTracks;

	public LastFmSimilarTracks(String apiKey, List<Track> similarTracks) {
		this.apiKey = apiKey;
		this.similarTracks = similarTracks;
	}

	public String getApiKey() {
		return apiKey;
	}

	public void setApiKey(String apiKey) {
		this.apiKey = apiKey;
	}

	public List<Track> getSimilarTracks() {
		return List.copyOf(similarTracks);
	}

	public void setSimilarTracks(List<Track> similarTracks) {
		this.similarTracks = similarTracks;
	}

}
