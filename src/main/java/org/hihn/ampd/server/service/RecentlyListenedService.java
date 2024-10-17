package org.hihn.ampd.server.service;

import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.listenbrainz.ApiException;
import org.hihn.listenbrainz.LbCoreApi;
import org.hihn.listenbrainz.ListensForUserPayloadListensInner;
import org.hihn.listenbrainz.ValidateToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecentlyListenedService {

	private static final Logger LOG = LoggerFactory.getLogger(RecentlyListenedService.class);

	private final AmpdSettings ampdSettings;

	private final LbCoreApi lbCoreApi = new LbCoreApi();

	private String lbUsername = null;

	public RecentlyListenedService(AmpdSettings ampdSettings) {
		this.ampdSettings = ampdSettings;
		buildAuth();
	}

	public List<ListensForUserPayloadListensInner> getRecentlyListened() {
		List<ListensForUserPayloadListensInner> ret = new ArrayList<>();
		try {
			ret = lbCoreApi.listensForUser(lbUsername).execute().getPayload().getListens();
		}
		catch (ApiException e) {
			LOG.error("Could not get listensForUser, username={}", lbUsername, e);
		}
		return ret;
	}

	private void buildAuth() {
		lbCoreApi.getApiClient().setApiKey("Token " + ampdSettings.getListenbrainzToken());
		try {
			ValidateToken a = lbCoreApi.validateToken().execute();
			lbUsername = a.getUserName();
		}
		catch (ApiException e) {
			LOG.error("Could not determine ListenBrainz username", e);
		}
	}

}
