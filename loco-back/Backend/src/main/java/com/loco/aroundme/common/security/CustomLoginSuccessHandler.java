package com.loco.aroundme.common.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomLoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

	private RequestCache requestCache = new HttpSessionRequestCache();

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth)
			throws IOException, ServletException {
		log.info("CustomLoginSuccessHandler onAuthenticationSuccess");
		User customUser = (User) auth.getPrincipal();
		log.info("CustomLoginSuccessHandler username = " + customUser.getUsername());
		// 인증 과정에서 발생한 예외 정보를 세션에서 제거
		clearAuthenticationAttribute(request);
		// 사용자가 인증되기 전에 접근을 시도했던 요청을 가져온다
		SavedRequest savedRequest = requestCache.getRequest(request, response);
		if (savedRequest != null) {
			String targetUrl = savedRequest.getRedirectUrl();
			log.info("CustomLoginSuccessHandler Login Success targetUrl = " + targetUrl);
			response.sendRedirect(targetUrl);
		} else {
			response.sendRedirect("/");
		}

	}

	// 인증 과정에서 발생한 예외 정보를 세션에서 제거합니다.
	private void clearAuthenticationAttribute(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session == null) {
			return;
		}
		// 세션에서 인증 예외 속성을 제거한다.
		session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
	}

}