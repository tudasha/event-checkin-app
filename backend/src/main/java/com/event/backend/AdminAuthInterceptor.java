package com.event.backend;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    @Value("${app.admin.token}")
    private String adminToken;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        // Allow CORS preflight completely
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String uri = request.getRequestURI();

        // 1. Allow Stripe Webhooks
        if (uri.startsWith("/api/stripe")) {
            return true;
        }

        // 2. Allow open Web Registration (POST) and Server Ping
        if (uri.equals("/api/attendees/ping") || (uri.startsWith("/api/attendees") && "POST".equalsIgnoreCase(request.getMethod()))) {
            return true;
        }

        // 3. SECURE EVERYTHING ELSE under /api/
        if (uri.startsWith("/api/")) {
            String sentToken = request.getHeader("x-admin-token");
            if (sentToken == null || !sentToken.equals(adminToken)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: Invalid or missing admin token");
                return false;
            }
        }

        return true;
    }
}
