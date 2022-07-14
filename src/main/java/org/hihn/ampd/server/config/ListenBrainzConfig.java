package org.hihn.ampd.server.config;

import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.listenbrainz.LbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ListenBrainzConfig {

	@Autowired
	private AmpdSettings ampdSettings;

	@Bean
	public LbService buildListenBrainz() {
		return new LbService(ampdSettings.getListenbrainzToken());
	}

}
