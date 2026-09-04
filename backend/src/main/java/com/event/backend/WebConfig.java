package com.event.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private AdminAuthInterceptor adminAuthInterceptor;

    // Was allowedOrigins("*") — any website's visitor could be scripted into hitting this API
    // from their browser (spam registrations, each one firing a real email). The public
    // registration site is the only real browser caller (the admin app is a Capacitor/Android
    // WebView, not subject to CORS, and its local dev server proxies /api same-origin — see
    // frontend/vite.config.js). Configurable via env var so a future custom domain doesn't
    // need a code change.
    @Value("${app.cors.allowed-origins:https://oml-website.onrender.com}")
    private String[] allowedOrigins;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminAuthInterceptor).addPathPatterns("/api/**");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedHeaders("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
