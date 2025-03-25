package com.example.pollsterapi.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.DefaultCookieSerializer;

@Configuration
public class CookieConfig {
    @Bean
    public DefaultCookieSerializer cookieSerializer() {
        DefaultCookieSerializer cookieSerializer = new DefaultCookieSerializer();
        cookieSerializer.setCookieName("access_token");
        cookieSerializer.setCookiePath("/");
        cookieSerializer.setDomainNamePattern("^.+?\\.(\\w+\\.[a-z]+)$"); // Optional, restrict to certain domains
       // cookieSerializer.setUseHttpOnlyCookie(true); // Mark cookie as HttpOnly
        cookieSerializer.setUseSecureCookie(true);
       cookieSerializer.setSameSite("None"); // TODO: Fix this when app goes live
        return cookieSerializer;
    }
}
