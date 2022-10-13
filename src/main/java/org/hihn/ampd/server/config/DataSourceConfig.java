package org.hihn.ampd.server.config;

import org.hihn.ampd.server.service.AmpdDirService;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

	private final AmpdDirService ampdDirService;

	public DataSourceConfig(AmpdDirService ampdDirService) {
		this.ampdDirService = ampdDirService;
	}

	@Bean
	public DataSource getDataSource() {

		DataSourceBuilder<?> dataSourceBuilder = DataSourceBuilder.create();
		dataSourceBuilder.driverClassName("org.h2.Driver");

		System.out.println();

		dataSourceBuilder.url("jdbc:h2:file:" + ampdDirService.getDbPath());
		return dataSourceBuilder.build();
	}

}