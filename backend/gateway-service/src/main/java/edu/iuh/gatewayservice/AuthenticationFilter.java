package edu.iuh.gatewayservice;

import io.jsonwebtoken.Jwt;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;

import java.lang.annotation.Annotation;

@Service
@Slf4j
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> implements Order {


    @Autowired
    AntPathMatcher pathMatcher;

    @Autowired
    JwtService jwtService;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain)->{
            String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (token != null && token.startsWith("Bearer "))
                token = token.substring(7);
            boolean tokenExpired = jwtService.isTokenExpired(token);
            if(!tokenExpired) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            return chain.filter(exchange);
        };
    }

    @Override
    public Class<? extends Annotation> annotationType() {
        return null;
    }

    @Override
    public int value() {
        return -2;
    }

    public static class Config {
    }

}
