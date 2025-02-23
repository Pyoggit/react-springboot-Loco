package com.loco.aroundme.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.loco.aroundme.common.security.jwt.JwtAuthenticationFilter;
import com.loco.aroundme.common.security.jwt.JwtUtil;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtUtil jwtUtil;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(corsConfigurationSource())).csrf(csrf -> csrf.disable()) 
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/users/signup", "/api/users/check-email", "/api/users/find-email",
								"/api/users/login", "/api/auth/kakao/**", "/api/auth/google/**", "/ws-chat/**",
								"/api/circles/**", "/api/market/**", "/api/board/**", "/api/payment/**", "/upload/**",
								"/api/auth/**", "/api/users/request-verification", "/api/users/verify-code",
								"/api/users/reset-password", "/api/adminpage/login", "/api/adminpage/login",
								"/api/chat/room", "/api/chat/rooms/**", "/api/users/getUserNames")
						.permitAll() 
						.requestMatchers("/api/users/mypage/**", "/api/users/update", "/api/users/logout",
								"/api/user/me")
						.authenticated() 
						.requestMatchers("/api/users/mypage/**", "/api/users/update").hasAuthority("ROLE_USER") 
						.requestMatchers("/api/adminpage/**", "/api/admin/**",
								"/api/users/mypage/**").hasAuthority("ROLE_ADMIN") 
						.anyRequest().authenticated() 
				).exceptionHandling(ex -> ex.accessDeniedPage("/error/403")).logout(logout -> logout
						.logoutUrl("/api/users/logout").logoutSuccessHandler((request, response, authentication) -> {
							response.setStatus(200);
							response.getWriter().write("로그아웃 성공!");
							response.getWriter().flush();
						}).invalidateHttpSession(true)
						.clearAuthentication(true) 
				).formLogin(form -> form.disable())
				.httpBasic(basic -> basic.disable()) 
				.addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class); 
		return http.build();
	}

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}


	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(List.of("http://localhost:5173")); 
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setAllowCredentials(true); 
		configuration.addExposedHeader("Authorization");
		configuration.addExposedHeader("Set-Cookie"); 
		configuration.addExposedHeader("Content-Type"); 

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOriginPatterns("http://localhost:5173")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowedHeaders("*")
						.exposedHeaders("Authorization", "Set-Cookie", "*") 
						.allowCredentials(true); 

			}

			@Override
			public void addResourceHandlers(ResourceHandlerRegistry registry) {
				registry.addResourceHandler("/upload/**").addResourceLocations("file:///C:/upload/")
						.setCachePeriod(21600)  // 6시간캐시
						.resourceChain(true);

			
				registry.addResourceHandler("/images/**").addResourceLocations("classpath:/static/images/");
			}

		};
	}

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOriginPatterns(List.of("http://localhost:5173"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); 
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}

}