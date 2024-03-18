package org.hihn.ampd.server.config;

import org.hihn.ampd.server.service.cache.DirService;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

	private final DirService dirService;

	public DataSourceConfig(DirService dirService) {
		this.dirService = dirService;
	}

	@Bean
	public DataSource getDataSource() {
		DataSourceBuilder<?> dataSourceBuilder = DataSourceBuilder.create();
		dataSourceBuilder.driverClassName("org.h2.Driver");
		dataSourceBuilder.url("jdbc:h2:file:" + dirService.getDbPath());
		return dataSourceBuilder.build();
	}

}