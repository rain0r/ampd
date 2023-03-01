package org.hihn.ampd.server.config;

import org.bff.javampd.server.MPD;
import org.hihn.ampd.server.model.AmpdSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Wrapper around the {@link MPD} library.
 */
@Configuration
public class MpdConfig {

	@Autowired
	private AmpdSettings ampdSettings;

	/**
	 * Builds an {@link MPD} instance.
	 * @return A connection to the MPD server defined in the application.properties.
	 */
	@Bean
	public MPD buildMpd() {
		if (ampdSettings.getMpdPassword().equals("")) {
			return MPD.builder().server(ampdSettings.getMpdServer()).port(ampdSettings.getMpdPort()).build();
		}
		else {
			return MPD.builder()
				.server(ampdSettings.getMpdServer())
				.port(ampdSettings.getMpdPort())
				.password(ampdSettings.getMpdPassword())
				.build();
		}
	}

}
