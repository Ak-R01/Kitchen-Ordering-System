package com.restaurant.server.config;

import com.restaurant.server.security.StompAuthChannelInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompAuthChannelInterceptor stompAuthChannelInterceptor;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Clients (KDS, and later a customer status screen) connect here.
        // SockJS is a fallback for networks/proxies that block raw WebSocket.
        // NOTE: the HTTP handshake itself stays permitAll() in SecurityConfig -
        // real auth now happens per-connection at the STOMP CONNECT frame level,
        // via the interceptor registered below.
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:*") // match your React dev origins
                .withSockJS();

        // Plain WebSocket, no SockJS handshake - for native clients that can't do the
        // SockJS negotiation protocol (Postman, mobile apps, etc). Same broker underneath.
        registry.addEndpoint("/ws-raw")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Anything published to /topic/* is broadcast to every subscriber.
        // /topic/kitchen is where new orders and status updates get pushed.
        config.enableSimpleBroker("/topic");

        // Reserved for future client -> server messages over the socket (not needed yet,
        // since order placement still goes through the REST POST /api/orders endpoint).
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // This is what actually enforces auth on the CONNECT frame - without this
        // line, StompAuthChannelInterceptor exists but is never invoked.
        registration.interceptors(stompAuthChannelInterceptor);
    }
}