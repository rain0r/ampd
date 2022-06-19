package org.hihn.ampd.server.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.bff.javampd.server.ServerStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class MvcConfiguration {

	@Bean
	public Jackson2ObjectMapperBuilder jackson2ObjectMapperBuilder() {
		Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder()
				.serializationInclusion(JsonInclude.Include.NON_NULL);
		builder.mixIn(ServerStatus.class, ServerStatusMixIn.class);
		return builder;
	}

}
