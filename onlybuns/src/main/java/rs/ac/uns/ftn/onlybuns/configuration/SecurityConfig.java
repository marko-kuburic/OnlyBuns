package rs.ac.uns.ftn.onlybuns.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import rs.ac.uns.ftn.onlybuns.util.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(authorize -> authorize
                        // Allow unrestricted access to the following user-related routes
                        .requestMatchers(
                                "/api/users/register",
                                "/api/users/login",
                                "/api/users/activate/**",
                                "/api/users/username/**",
                                "/api/users/id/**"
                        ).permitAll()

                        // Allow unrestricted access to public post listing
                        .requestMatchers("/api/posts").permitAll()

                        // Protect specific post interaction routes for authenticated users only
                        .requestMatchers(
                                "/api/posts/*/like",
                                "/api/posts/*/comment",
                                "/api/posts/create",
                                "/api/posts/update/*",
                                "/api/posts/delete/*"
                        ).authenticated()

                        // Allow read-only access to posts by ID and location
                        .requestMatchers(
                                "/api/posts/user/**",
                                "/api/posts/location/**",
                                "/api/posts/{id}"
                        ).permitAll()

                        // Secure all other user-related routes
                       // .requestMatchers("/api/users/**").authenticated()

                        // Apply general access rules for any remaining routes
                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtSecret), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
