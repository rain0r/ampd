package org.hihn.ampd.server.config;

import org.cache2k.extra.spring.SpringCache2kCacheManager;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@EnableCaching
@Configuration(proxyBeanMethods = false)
public class CachingConfig {

	@Bean
	public CacheManager cacheManager() {
		SpringCache2kCacheManager manager = new SpringCache2kCacheManager();
		manager = manager.defaultSetup((builder) -> builder.entryCapacity(200).expireAfterWrite(20, TimeUnit.MINUTES));
		return manager;
	}

}
