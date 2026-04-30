package com.finsmart.Finsmart_Finances.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig implements WebMvcConfigurer {
	
	 @Bean
     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	        return http
	            .csrf(csrf -> csrf.disable())
	            .authorizeHttpRequests(auth -> auth
	                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow all OPTIONS requests
	                .requestMatchers(HttpMethod.POST, "/users").permitAll() // Allow signup
	                .requestMatchers(HttpMethod.POST, "/api/auth/forgot-password").permitAll()
	                .requestMatchers(HttpMethod.POST, "/api/auth/reset-password").permitAll()
	                .requestMatchers(HttpMethod.POST, "/login").permitAll() // Allow login
	                .requestMatchers("/api/auth/login").permitAll() // Allow custom login
	                .requestMatchers("/api/auth/logout").permitAll() // Allow logout
	                .requestMatchers("/api/chatbot/**").permitAll() // Allow chatbot requests
	                .requestMatchers("/goals/**").permitAll() // Allow investment goals requests
	                .requestMatchers("/transactions/**").permitAll() // Allow investment transactions requests
	                .requestMatchers("/stock-transactions/**").permitAll() // Allow all stock transaction requests for testing
	                .anyRequest().authenticated()
	            )
	            .formLogin(form -> form
	                .loginProcessingUrl("/login")
	                .successHandler((request, response, authentication) -> {
	                    response.setStatus(HttpServletResponse.SC_OK);
	                    response.setContentType("application/json");
	                    response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	                    response.setHeader("Access-Control-Allow-Credentials", "true");
	                    response.getWriter().write("{\"message\": \"Login successful\"}");
	                    response.getWriter().flush();
	                })
	                .failureHandler((request, response, exception) -> {
	                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	                    response.setContentType("application/json");
	                    response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	                    response.setHeader("Access-Control-Allow-Credentials", "true");
	                    response.getWriter().write("{\"error\": \"Invalid credentials\"}");
	                    response.getWriter().flush();
	                })
	            )
	            .httpBasic(Customizer.withDefaults()) // Enable HTTP Basic/session-based login for API
	            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
	            .build();
	    }
	
	@Autowired
	private UserDetailsService userdetailservice;
	
	
	@Bean
	public AuthenticationProvider authenPro() {
		DaoAuthenticationProvider pp = new DaoAuthenticationProvider();
		pp.setPasswordEncoder(new BCryptPasswordEncoder(12));
		pp.setUserDetailsService(userdetailservice);
		return pp;
	}

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
