package com.restaurant.server.config;

import com.restaurant.server.security.CustomAccessDeniedHandler;
import com.restaurant.server.security.CustomAuthenticationEntryPoint;
import com.restaurant.server.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // stateless REST API, no CSRF tokens needed
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions
                        // No/invalid/expired token -> clean 401 JSON instead of Spring's default
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                        // Valid token but wrong role -> clean 403 JSON instead of Spring's default
                        .accessDeniedHandler(customAccessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                        // Customer-facing, no auth required
                        .requestMatchers("/api/tables/by-token/**").permitAll()
                        .requestMatchers("/api/menu/**").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/orders").permitAll() // POST: placing an order
                        .requestMatchers("/api/admin/login").permitAll()
                        .requestMatchers("/ws/**").permitAll() // WebSocket handshake (SockJS)
                        .requestMatchers("/ws-raw/**").permitAll() // WebSocket handshake (native, for Postman testing)

                        // Kitchen display: viewing/updating orders
                        .requestMatchers("/api/orders/**").hasAnyRole("ADMIN", "KITCHEN")

                        // Menu/table management: admin only
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Allows the React apps (served from a different origin during development,
     * e.g. localhost:5173) to call this API and open the WebSocket connection.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}