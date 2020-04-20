package org.hihn.ampd.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Needed to send websocket messages repeatedly.
 */
@Configuration
@EnableScheduling
public class SchedulerConfiguration {

}
