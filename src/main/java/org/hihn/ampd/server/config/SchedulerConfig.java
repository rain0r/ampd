package org.hihn.ampd.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

/**
 * Needed to send websocket messages repeatedly.
 */
@Configuration
@EnableScheduling
public class SchedulerConfig implements SchedulingConfigurer {

	/**
	 * The pool size.
	 */
	private final int POOL_SIZE = 4;

	/**
	 * Configures the scheduler to allow multiple pools.
	 * @param taskRegistrar The task registrar.
	 */
	@Override
	public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
		ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();

		threadPoolTaskScheduler.setPoolSize(POOL_SIZE);
		threadPoolTaskScheduler.setThreadNamePrefix("scheduled-task-pool-");
		threadPoolTaskScheduler.initialize();

		taskRegistrar.setTaskScheduler(threadPoolTaskScheduler);
	}

}
