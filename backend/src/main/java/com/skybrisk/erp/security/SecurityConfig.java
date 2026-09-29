
        package com.skybrisk.erp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // Authentication
                        // =========================
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // =========================
                        // Swagger
                        // =========================
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        )
                        .permitAll()


                        // =========================
                        // PRODUCT APIs
                        // =========================

                        // Create Product
                        // ADMIN + INVENTORY_MANAGER
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "INVENTORY_MANAGER"
                        )

                        // Update Product
                        // ADMIN + INVENTORY_MANAGER
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "INVENTORY_MANAGER"
                        )

                        // Delete Product
                        // ADMIN + INVENTORY_MANAGER
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "INVENTORY_MANAGER"
                        )

                        // Read-only product access for Sales Orders
                        // ADMIN + INVENTORY_MANAGER + SALES_EXECUTIVE
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/for-sales"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "INVENTORY_MANAGER",
                                "SALES_EXECUTIVE"
                        )

                        // Normal Product Management GET
                        // ADMIN + INVENTORY_MANAGER
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "INVENTORY_MANAGER",
                                "PURCHASE_MANAGER"
                        )


                        // =========================
                        // GRN APIs
                        // ADMIN + PURCHASE_MANAGER
                        // + INVENTORY_MANAGER
                        // =========================
                        .requestMatchers("/api/grns/**")
                        .hasAnyRole(
                                "ADMIN",
                                "PURCHASE_MANAGER",
                                "INVENTORY_MANAGER"
                        )


                        // =========================
                        // PURCHASE ORDER APIs
                        // =========================

                        // Read-only Purchase Order access
                        // specifically for GRN
                        // ADMIN + PURCHASE_MANAGER
                        // + INVENTORY_MANAGER
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/purchase-orders/for-grn"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PURCHASE_MANAGER",
                                "INVENTORY_MANAGER"
                        )

                        // Normal Purchase Order APIs
                        // ADMIN + PURCHASE_MANAGER only
                                // =========================
// Purchase Order - VIEW
// ADMIN + PURCHASE_MANAGER + INVENTORY_MANAGER
// =========================
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/purchase-orders/**"
                                )
                                .hasAnyRole(
                                        "ADMIN",
                                        "PURCHASE_MANAGER",
                                        "INVENTORY_MANAGER"
                                )

// =========================
// Purchase Order - CREATE
// ADMIN + PURCHASE_MANAGER
// =========================
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/purchase-orders/**"
                                )
                                .hasAnyRole(
                                        "ADMIN",
                                        "PURCHASE_MANAGER"
                                )

// =========================
// Purchase Order - UPDATE
// ADMIN + PURCHASE_MANAGER
// =========================
                                .requestMatchers(
                                        HttpMethod.PUT,
                                        "/api/purchase-orders/**"
                                )
                                .hasAnyRole(
                                        "ADMIN",
                                        "PURCHASE_MANAGER"
                                )

// =========================
// Purchase Order - DELETE
// ADMIN + PURCHASE_MANAGER
// =========================
                                .requestMatchers(
                                        HttpMethod.DELETE,
                                        "/api/purchase-orders/**"
                                )
                                .hasAnyRole(
                                        "ADMIN",
                                        "PURCHASE_MANAGER"
                                )


                        // =========================
                        // SALES ORDER APIs
                        // ADMIN + SALES_EXECUTIVE
                        // =========================
                        .requestMatchers("/api/sales-orders/**")
                        .hasAnyRole(
                                "ADMIN",
                                "SALES_EXECUTIVE"
                        )


                        // =========================
                        // SUPPLIER APIs
                        // ADMIN + PURCHASE_MANAGER
                        // =========================
                        .requestMatchers("/api/suppliers/**")
                        .hasAnyRole(
                                "ADMIN",
                                "PURCHASE_MANAGER"
                        )


                        // =========================
                        // CUSTOMER APIs
                        // ADMIN + SALES_EXECUTIVE
                        // =========================
                        .requestMatchers("/api/customers/**")
                        .hasAnyRole(
                                "ADMIN",
                                "SALES_EXECUTIVE"
                        )


                        // =========================
                        // INVOICE APIs
                        // ADMIN + SALES_EXECUTIVE
                        // + ACCOUNTANT
                        // =========================
                        .requestMatchers("/api/invoices/**")
                        .hasAnyRole(
                                "ADMIN",
                                "SALES_EXECUTIVE",
                                "ACCOUNTANT"
                        )

                                .requestMatchers("/api/reports/**")
                                .hasAnyRole(
                                        "ADMIN",
                                        "ACCOUNTANT"
                                )

                        // =========================
                        // ALL OTHER APIs
                        // =========================
                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // =========================
    // CORS CONFIGURATION
    // =========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}

