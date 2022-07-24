package org.hihn.ampd.server.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.bff.javampd.server.ServerStatus;
import org.hihn.ampd.server.serializer.AbstractServerStatusMixIn;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

/**
 * Exclude mixRampDb until this issue is resolved:
 * <a href="https://github.com/finnyb/javampd/issues/73">#73</a>
 */
@Configuration
public class MvcConfig {

	@Bean
	public Jackson2ObjectMapperBuilder jackson2ObjectMapperBuilder() {
		Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder()
				.serializationInclusion(JsonInclude.Include.NON_NULL);
		builder.mixIn(ServerStatus.class, AbstractServerStatusMixIn.class);
		return builder;
	}

}
