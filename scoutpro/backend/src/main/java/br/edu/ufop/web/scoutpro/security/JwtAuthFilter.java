package br.edu.ufop.web.scoutpro.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        String userEmail = null;

        // Log da rota
        System.out.println("--- Iniciando Filtro JWT para: " + request.getMethod() + " " + request.getRequestURI() + " ---");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Resultado: Sem header ou Bearer. Passando...");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            userEmail = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            System.err.println("ERRO ao extrair email: " + e.getMessage());
        }

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            try {
                // AQUI a variável userDetails é criada
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    System.out.println("Token VÁLIDO para: " + userDetails.getUsername());
                    
                    // AQUI nós imprimimos as permissões com a variável ainda viva
                    System.out.println("PERMISSÕES CARREGADAS DO BANCO: " + userDetails.getAuthorities());
                    
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                } else {
                    System.err.println("Token INVÁLIDO para o user.");
                }
            } catch (Exception e) {
                System.err.println("ERRO ao carregar user: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}