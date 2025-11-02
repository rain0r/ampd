package org.hihn.ampd.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.PostConstruct;
import org.hihn.ampd.server.serializer.HelpText;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;

import java.util.Set;
import java.util.TreeSet;

/**
 * Represents all possible ampd settings. Can't be changed during runtime.
 */
@Component
public class AmpdSettings {

	private static final Logger LOG = LoggerFactory.getLogger(AmpdSettings.class);

	/**
	 * If true, covers that have been downloaded from MusicBrainz will be saved to disk
	 * and used the next time the cached cover will be displayed.
	 */
	@HelpText(name = "Cover cache", hint = "Cache covers on disk.")
	@Value("${local.cover.cache:true}")
	private boolean localCoverCache;

	/**
	 * If true, covers that couldn't be found in the directory of the track will be
	 * downloaded from MusicBrainz.
	 */
	@HelpText(name = "MusicBrainz cover service", hint = "Download covers from MusicBrainz")
	@Value("${mb.cover.service:true}")
	private boolean mbCoverService;

	/**
	 * The password needed to access the MPD server. Optional.
	 */
	@Value("${mpd.password:}")
	@JsonIgnore
	private String mpdPassword;

	/**
	 * The port needed to access the MPD server. Default 6600.
	 */
	@HelpText(name = "MPD port", hint = " The port on which MPD runs.")
	@Value("${mpd.port:660}")
	private int mpdPort;

	/**
	 * The name or ip of the computer running the MPD server.
	 */
	@HelpText(name = "MPD server", hint = "The name or ip of the computer that runs MPD.")
	@Value("${mpd.server:localhost}")
	private String mpdServer;

	/**
	 * The directory where all the tracks are stored. This setting is needed for ampd to
	 * display the covers that usually lie in the direcotry of the tracks.
	 */
	@HelpText(name = "Music directory", hint = "Corresponds to the value of music_directory in the mpd.conf.")
	@Value("${mpd.music.directory:}")
	private String musicDirectory;

	/**
	 * When true, all active MPD modes (shuffle, consume, ...) will be turned off, when
	 * the playlist is cleared.
	 */
	@HelpText(name = "Reset MPD modes on \"Clear Queue\"", hint = "Reset shuffle etc when playlist is cleared")
	@Value("${reset.modes.on.clear:false}")
	private boolean resetModesOnClear;

	/**
	 * When true, users will be allowed to save the queue as a new playlist on the MPD
	 * server.
	 */
	@HelpText(name = "Create playlists", hint = "Users are allowed to create playlists.")
	@Value("${create.new.playlists:true}")
	private boolean createPlaylists;

	/**
	 * When true, users will be allowed to delete existing playlists on the MPD server.
	 */
	@HelpText(name = "Delete playlists", hint = "Users are allowed to delete playlists.")
	@Value("${delete.existing.playlists:true}")
	private boolean deletePlaylists;

	/**
	 * Strictness of the cover-search. A low value will propably load wrong cover.
	 */
	@Value("${min.score:75}")
	private int minScore;

	/**
	 * Artwork finder: filename pattern for glob.
	 */
	@Value("${artwork.filename.pattern}")
	private String coverNamePattern;

	/**
	 * Version of ampd as specified in pom.xml.
	 */
	@Value("${application.version}")
	private String version;

	/**
	 * Least amount of tracks that an album must have to be considered such
	 */
	@Value("${albums.qualify.min.tracks}")
	private int albumsQualifyMinTracks;

	/**
	 * Page size for the album cover browse view.
	 */
	@HelpText(name = "Albums page size", hint = "Page size for the album cover browse view.")
	@Value("${albums.page.size:30}")
	private int albumsPageSize;

	/**
	 * Page size for advanced search results.
	 */
	@HelpText(name = "Albums page size", hint = "Page size for advanced search results.")
	@Value("${search.page.size:50}")
	private int searchPageSize;

	@HelpText(name = "Queue page size", hint = "Page size for the queue.")
	@Value("${queue.page.size:100}")
	private int queuePageSize;

	/**
	 * If ListenBrainz scrobbling is enabled.
	 */
	@HelpText(name = "ListenBrainz", hint = "If scrobbling to ListenBrainz is enabled.")
	@Value("${listenbrainz.scrobble:false}")
	private boolean scrobbleLb;

	/**
	 * The ListenBrainz auth token.
	 */
	@Value("${listenbrainz.token:}")
	@JsonIgnore
	private String listenbrainzToken;

	/**
	 * API key for the Last.fm api
	 */
	@Value("${lastfm.api.key:}")
	@JsonIgnore
	private String lastfmApiKey;

	/**
	 * API secret for the Last.fm api
	 */
	@Value("${lastfm.api.secret:}")
	@JsonIgnore
	private String lastfmApiSecret;

	/**
	 * Last.fm username
	 */
	@HelpText(name = "Last.fm username", hint = "Last.fm username that will scrobble.")
	@Value("${lastfm.api.username:}")
	private String lastfmApiUsername;

	/**
	 * Last.fm password
	 */
	@Value("${lastfm.api.password:}")
	@JsonIgnore
	private String lastfmApiPassword;

	/**
	 * If Last.fm scrobbling is enabled.
	 */
	@HelpText(name = "Last.fm", hint = "If scrobbling to Last.fm is enabled.")
	@Value("${lastfm.api.scrobble:false}")
	private boolean lastfmApiScrobble;

	@HelpText(name = "Home dir", hint = "Directory where ampd stores its data.")
	@Value("${home.dir:}")
	private String homeDir;

	/**
	 * Prints the applied properties to the console.
	 */
	@PostConstruct
	public void printProperties() {
		Set<String> output = new TreeSet<>();
		ReflectionUtils.doWithFields(AmpdSettings.class, field -> {
			field.setAccessible(true);
			output.add(field.getName() + ": " + field.get(this));
		}, field -> {
			// Field Filter: exclude passwords and tokens
			return field.getAnnotation(JsonIgnore.class) == null;
		});
		LOG.info("Starting ampd with these settings:");
		output.forEach(LOG::info);
	}

	public String getMpdPassword() {
		return mpdPassword;
	}

	public int getMpdPort() {
		return mpdPort;
	}

	public String getMpdServer() {
		return mpdServer;
	}

	public String getMusicDirectory() {
		return musicDirectory.endsWith("/") ? musicDirectory : musicDirectory + "/";
	}

	public boolean isLocalCoverCache() {
		return localCoverCache;
	}

	public boolean isMbCoverService() {
		return mbCoverService;
	}

	public boolean isResetModesOnClear() {
		return resetModesOnClear;
	}

	public boolean isCreatePlaylists() {
		return createPlaylists;
	}

	public boolean isDeletePlaylists() {
		return deletePlaylists;
	}

	public int getMinScore() {
		return minScore;
	}

	public String getCoverNamePattern() {
		return coverNamePattern;
	}

	public int getAlbumsQualifyMinTracks() {
		return albumsQualifyMinTracks;
	}

	public String getVersion() {
		return version;
	}

	public int getAlbumsPageSize() {
		return albumsPageSize;
	}

	public boolean isScrobbleLb() {
		return scrobbleLb;
	}

	public String getListenbrainzToken() {
		return listenbrainzToken;
	}

	public String getLastfmApiKey() {
		return lastfmApiKey;
	}

	public String getLastfmApiSecret() {
		return lastfmApiSecret;
	}

	public String getLastfmApiUsername() {
		return lastfmApiUsername;
	}

	public String getLastfmApiPassword() {
		return lastfmApiPassword;
	}

	public boolean isLastfmApiScrobble() {
		return lastfmApiScrobble;
	}

	public String getHomeDir() {
		return homeDir;
	}

	public int getSearchPageSize() {
		return searchPageSize;
	}

	public int getQueuePageSize() {
		return queuePageSize;
	}

}
