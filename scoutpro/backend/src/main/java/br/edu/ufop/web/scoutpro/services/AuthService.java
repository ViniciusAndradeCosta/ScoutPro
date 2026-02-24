package br.edu.ufop.web.scoutpro.services;

import br.edu.ufop.web.scoutpro.dto.AuthDTOs.*;
import br.edu.ufop.web.scoutpro.models.Scout;
import br.edu.ufop.web.scoutpro.models.User;
import br.edu.ufop.web.scoutpro.enums.Role;
import br.edu.ufop.web.scoutpro.repository.ScoutRepository;
import br.edu.ufop.web.scoutpro.repository.UserRepository;
import br.edu.ufop.web.scoutpro.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- IMPORTANTE!

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ScoutRepository scoutRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional // <-- Garante que a transação inteira tenha sucesso ou seja cancelada
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já cadastrado.");
        }

        Role role = request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN") ? Role.ADMIN : Role.SCOUT;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
        
        // CORREÇÃO 1: Atualiza a variável com o usuário salvo para obter o ID gerado pelo banco!
        user = userRepository.save(user);

        // CORREÇÃO 2: Cria o Scout passando valores padrão caso eles venham nulos do Frontend
        if (role == Role.SCOUT) {
            Scout scout = Scout.builder()
                    .user(user)
                    .club(request.getClub() != null ? request.getClub() : "Sem Clube")
                    .region(request.getRegion() != null ? request.getRegion() : "Não informada")
                    .build();
            scoutRepository.save(scout);
        }

        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }
}