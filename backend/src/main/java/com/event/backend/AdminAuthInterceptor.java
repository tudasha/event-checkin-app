package com.event.backend;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

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

        // 2. Allow open Web Registration (POST) and Server Ping — matched by exact path
        // (not startsWith) so a future POST sub-route under /api/attendees/** doesn't
        // accidentally inherit this exemption.
        if (uri.equals("/api/attendees/ping") || (uri.equals("/api/attendees") && "POST".equalsIgnoreCase(request.getMethod()))) {
            return true;
        }

        // 3. SECURE EVERYTHING ELSE under /api/
        if (uri.startsWith("/api/")) {
            String sentToken = request.getHeader("x-admin-token");
            if (sentToken == null || !constantTimeEquals(sentToken, adminToken)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: Invalid or missing admin token");
                return false;
            }
        }

        return true;
    }

    // Plain String.equals() short-circuits on the first mismatched byte, which leaks timing
    // info about how much of the token was guessed correctly. MessageDigest.isEqual runs in
    // time independent of where the mismatch is.
    private boolean constantTimeEquals(String a, String b) {
        return MessageDigest.isEqual(
                a.getBytes(StandardCharsets.UTF_8),
                b.getBytes(StandardCharsets.UTF_8)
        );
    }
}
