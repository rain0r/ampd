package org.hihn.ampd.server.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.List;

@Configuration
@EnableCaching
public class CachingConfig {

	public static final String LONG_LIVED = "longLived";

	public static final String MEDIUM_LIVED = "mediumLived";

	public static final String SHORT_LIVED = "shortLived";

	@Bean
	public CacheManager cacheManager() {
		SimpleCacheManager manager = new SimpleCacheManager();

		CaffeineCache shortLived = new CaffeineCache(SHORT_LIVED,
				Caffeine.newBuilder().expireAfterWrite(Duration.ofSeconds(30)).maximumSize(10_000).build());

		CaffeineCache mediumLived = new CaffeineCache(MEDIUM_LIVED,
				Caffeine.newBuilder().expireAfterWrite(Duration.ofMinutes(5)).maximumSize(50_000).build());

		CaffeineCache longLived = new CaffeineCache(LONG_LIVED,
				Caffeine.newBuilder().expireAfterWrite(Duration.ofHours(1)).maximumSize(100_000).build());

		manager.setCaches(List.of(shortLived, mediumLived, longLived));
		return manager;
	}

}