package com.awesomepizza.util;

import jakarta.servlet.http.HttpServletRequest;

public final class TokenUtil {

    private TokenUtil() {
    }

    public static String extractBearerToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }
}
