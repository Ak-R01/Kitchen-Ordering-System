package com.restaurant.server.security;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Runs on every inbound STOMP frame across BOTH the SockJS endpoint (/ws) and
 * the plain endpoint (/ws-raw) - channel interceptors apply to the whole
 * inbound message channel regardless of which HTTP endpoint the connection
 * came in through.
 *
 * Only the CONNECT frame is checked. STOMP clients (@stomp/stompjs) send
 * custom headers via `connectHeaders` on that first frame - we read the
 * Authorization header from THAT, not from an HTTP header, since after the
 * initial handshake this is a persistent connection, not a series of HTTP
 * requests.
 *
 * Before this existed, the HTTP handshake for /ws and /ws-raw was permitAll()
 * in SecurityConfig (required, since SockJS's initial info/polling requests
 * need to succeed before a socket even exists) - but that meant anyone who
 * found the URL could subscribe to /topic/kitchen with zero authentication.
 * This interceptor is what actually closes that gap.
 */
@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new BadCredentialsException("Missing or malformed Authorization header on STOMP CONNECT");
            }

            String token = authHeader.substring(7);

            try {
                String username = jwtService.extractUsername(token);
                if (!jwtService.isTokenValid(token, username)) {
                    throw new BadCredentialsException("Invalid or expired token");
                }

                String role = jwtService.extractRole(token);
                Authentication auth = new UsernamePasswordAuthenticationToken(
                        username, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));

                // Attaching the principal here means every subsequent frame on THIS
                // connection is associated with this authenticated user for the
                // lifetime of the socket - not re-checked per message, only at CONNECT.
                accessor.setUser(auth);
            } catch (BadCredentialsException e) {
                throw e;
            } catch (Exception e) {
                throw new BadCredentialsException("Could not validate token", e);
            }
        }

        return message;
    }
}