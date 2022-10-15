package org.hihn.ampd.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

/**
 * Defines the outgoing topics and incoming endpoints.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private static final int ONE_MB = 1048576;

	@Override
	public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
		// WebSocketMessageBrokerConfigurer.super.configureWebSocketTransport(registry);
		registry.setMessageSizeLimit(ONE_MB);
		registry.setSendTimeLimit(45 * 1000).setSendBufferSizeLimit(ONE_MB);
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/topic");
		registry.setApplicationDestinationPrefixes("/app");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/mpd").setAllowedOrigins("*");
		registry.addEndpoint("/mpd").setAllowedOrigins("*").withSockJS();
	}

}
