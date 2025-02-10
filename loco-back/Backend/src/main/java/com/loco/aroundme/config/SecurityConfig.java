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
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.loco.aroundme.common.security.jwt.JwtAuthenticationFilter;
import com.loco.aroundme.common.security.jwt.JwtUtil;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtUtil jwtUtil; // JWT 유틸리티 주입

	// Spring Security 필터 체인 설정
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()) // CSRF 비활성화
				.cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/users/signup", "/api/users/check-email", "/api/auth/login", "/api/auth/kakao/**",
								"/api/auth/google/**")
						.permitAll() // 일반 로그인 및 회원가입 허용
						.requestMatchers("/api/adminpage/login").permitAll() // 관리자 로그인은 모두 접근 가능
//						.requestMatchers("/api/adminpage/**").hasAuthority("ROLE_1") // roleId = 1 (관리자)만 접근 가능
						.requestMatchers("/api/adminpage/**").hasAuthority("ROLE_ADMIN") 
						.anyRequest().authenticated()) // 그 외 요청은 인증 필요
				.logout(logout -> logout.logoutUrl("/api/adminpage/logout") // 로그아웃 URL 설정
						.invalidateHttpSession(true) // 세션 무효화
				).formLogin(form -> form.disable()) // 폼 로그인 비활성화
				.httpBasic(basic -> basic.disable()); // 기본 인증 비활성화
//            .addFilter(new JwtAuthenticationFilter(jwtUtil)); // JWT 필터
		http.addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	// 비밀번호 암호화 처리기 (BCrypt 사용)
	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// CORS 설정 (React, Kakao API 연동 시 필요)
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(List.of("http://localhost:5173")); // cors허용 도메
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // OPTIONS 허용 추가
		configuration.setAllowedHeaders(List.of("*")); // 모든 헤더 허용
		configuration.setAllowCredentials(true); // withCredentials 사용 시 필요

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	// 추가 CORS 설정 (React 연동 시 필요)
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOriginPatterns("http://localhost:5173") // allowedOriginsd아니고allowedOriginPatterns
																							// 사용
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // OPTIONS 추가
						.allowCredentials(true);
			}
		};
	}

}
