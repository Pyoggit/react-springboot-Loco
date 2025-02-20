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
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // ✅ CSRF 보호 없음
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/users/signup",  
                    "/api/users/check-email", 
                    "/api/users/find-email", 
                    "/api/users/login", 
                    "/api/auth/kakao/**", 
                    "/api/auth/google/**", 
                    "/ws-chat/**",
                    "/api/circles/**", 
                    "/api/market/**",
                    "/api/board/**",
                    "/api/payment/**",
                    "/upload/**", 
                    "/api/auth/**",
                    "/api/users/request-verification", 
                    "/api/users/verify-code", 
                    "/api/users/reset-password",
                    "/api/adminpage/login",
                    "/api/adminpage/login",
                    "/api/chat/room",
                    "/api/chat/rooms/**"
                ).permitAll() // ✅ 누구나 접근 가능
                .requestMatchers(
                    "/api/users/mypage/**",
                    "/api/users/update",
                    "/api/users/logout",
                    "/api/user/me"
                ).authenticated() // ✅ 로그인 필요
                .requestMatchers(
                    "/api/users/mypage/**",
                    "/api/users/update"
                ).hasAuthority("ROLE_USER") // ✅ USER 권한 필요
                .requestMatchers("/api/adminpage/**", "/api/admin/**").hasAuthority("ROLE_ADMIN") // ✅ ADMIN 권한 필요
                .anyRequest().authenticated() // ✅ 그 외 요청은 로그인 필요
            )
            .exceptionHandling(ex -> ex.accessDeniedPage("/error/403"))
            .logout(logout -> logout
                .logoutUrl("/api/users/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(200);
                    response.getWriter().write("로그아웃 성공!");
                    response.getWriter().flush();
                })
                .invalidateHttpSession(true) // ✅ 세션 무효화
                .clearAuthentication(true) // ✅ 인증 정보 초기화
            )
            .formLogin(form -> form.disable()) // ✅ 폼 로그인 비활성화 (JWT 사용)
            .httpBasic(basic -> basic.disable()) // ✅ 기본 인증 비활성화
            .addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class); // ✅ JWT 필터 추가

        return http.build();
    }
    
    
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
	 * ✅ CORS 설정 (프론트엔드 도메인 허용)
	 */
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(List.of("http://localhost:5173")); // ✅ 프론트엔드 도메인 허용
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // ✅ HTTP 메서드 허용
		configuration.setAllowedHeaders(List.of("*")); // ✅ 모든 헤더 허용
		configuration.setAllowCredentials(true); // ✅ 쿠키 허용
		configuration.addExposedHeader("Authorization"); // ✅ JWT 헤더 노출 (프론트에서 접근 가능)
		configuration.addExposedHeader("Set-Cookie"); // ✅ 쿠키 노출 (쿠키 기반 인증 가능)
		configuration.addExposedHeader("Content-Type"); // ✅ JSON, 이미지 등 Content-Type 허용

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

    /**
	 * ✅ Spring MVC CORS 설정 (쿠키 허용)
	 */
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins("http://localhost:5173")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowedHeaders("*")
						.exposedHeaders("Authorization", "Set-Cookie") // ✅ JWT & 쿠키 헤더 노출
						.allowCredentials(true); // ✅ 쿠키 허용

			}

			@Override
			public void addResourceHandlers(ResourceHandlerRegistry registry) {
			    // ✅ 업로드된 파일 접근 가능하게 설정
			    registry.addResourceHandler("/upload/**")
			            .addResourceLocations("file:///C:/upload/")
			            .setCachePeriod(3600) // 1시간 캐시
			            .resourceChain(true);

			    // ✅ 기본 프로필 이미지 경로 추가
			    registry.addResourceHandler("/images/**")
			            .addResourceLocations("classpath:/static/images/");
			}


		};
	}
    
    // 종호 주말  corsFilter 추가
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // ✅ 모든 HTTP 메서드 허용 (POST 포함)
        config.setAllowedHeaders(List.of("*")); // ✅ 모든 헤더 허용
        config.setAllowCredentials(true); // ✅ 쿠키 포함 허용
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    } 
    
    
}