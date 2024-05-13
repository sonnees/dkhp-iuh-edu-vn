package edu.iuh.studentservice.config;

import edu.iuh.studentservice.jwt.AuthenticationManager;
import edu.iuh.studentservice.jwt.SecurityContextRepository;
import io.netty.resolver.DefaultAddressResolverGroup;
import lombok.AllArgsConstructor;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.util.Arrays;
import java.util.List;


@Configuration
@EnableWebFluxSecurity
@AllArgsConstructor
public class SecurityConfig {
    private AuthenticationManager authenticationManager;
    private SecurityContextRepository securityContextRepository;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) throws Exception {
        return http.authorizeExchange(
                        auth -> auth
                                .pathMatchers("/v3/**","/swagger-ui/**", "/context-path/**","/webjars/**","/swagger-ui.html").permitAll()
                                .anyExchange().hasAnyAuthority("ADMIN", "ADMINISTRATOR","STUDENT")
                )
                .authenticationManager(authenticationManager)
                .securityContextRepository(securityContextRepository)
                .formLogin(Customizer.withDefaults())
                .httpBasic(Customizer.withDefaults())
                .anonymous(Customizer.withDefaults())
//                .cors(customizer -> {
//                    CorsConfiguration corsConfiguration = new CorsConfiguration();
//                    corsConfiguration.setAllowCredentials(true);
//                    corsConfiguration.setAllowedOrigins(List.of("http://127.0.0.1:5500"));
//                    corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST"));
//                    corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization"));
//                    customizer.configurationSource(request -> corsConfiguration);
//                })
                .cors(ServerHttpSecurity.CorsSpec::disable)
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public HttpClient httpClientReactor() {
        return HttpClient.create()
                .resolver(DefaultAddressResolverGroup.INSTANCE);
    }

    @Bean
    @LoadBalanced
    public WebClient.Builder loadBalancedWebClientBuilder(HttpClient httpClient) {
        return WebClient.builder().clientConnector(new ReactorClientHttpConnector(httpClient));
    }

    @Bean
    public TaskExecutor taskExecutor() {
        return new SimpleAsyncTaskExecutor();
    }

}
