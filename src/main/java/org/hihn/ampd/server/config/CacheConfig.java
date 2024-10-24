package org.hihn.ampd.server.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;

@EnableCaching
public class CacheConfig {

	@Bean
	public CacheManager cacheManager() {
		return new org.springframework.cache.concurrent.ConcurrentMapCacheManager();
	}

}
