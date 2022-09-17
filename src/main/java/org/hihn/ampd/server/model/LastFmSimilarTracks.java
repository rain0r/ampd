package org.hihn.ampd.server.model;

import de.umass.lastfm.Track;

import java.util.Collection;

/**
 * Holds info about Last.fm credential settings sent to the frontend.
 */
public class LastFmSimilarTracks {

	private String apiKey;

	private Collection<Track> similarTracks;

	public LastFmSimilarTracks(String apiKey, Collection<Track> similarTracks) {
		this.apiKey = apiKey;
		this.similarTracks = similarTracks;
	}

	public String getApiKey() {
		return apiKey;
	}

	public void setApiKey(String apiKey) {
		this.apiKey = apiKey;
	}

	public Collection<Track> getSimilarTracks() {
		return similarTracks;
	}

	public void setSimilarTracks(Collection<Track> similarTracks) {
		this.similarTracks = similarTracks;
	}

}
