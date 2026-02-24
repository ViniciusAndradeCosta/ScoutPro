// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/controllers/AuthController.java
package br.edu.ufop.web.scoutpro.controllers;

import br.edu.ufop.web.scoutpro.dto.AuthDTOs.*;
import br.edu.ufop.web.scoutpro.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}