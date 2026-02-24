package br.edu.ufop.web.scoutpro.controllers;

import br.edu.ufop.web.scoutpro.models.User;
import br.edu.ufop.web.scoutpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());
        
        userData.put("image", user.getImage());
        userData.put("phone", user.getPhone());
        userData.put("location", user.getLocation());
        userData.put("club", user.getClub());
        userData.put("bio", user.getBio());
        
        return ResponseEntity.ok(userData);
    }

    // CORREÇÃO: Alterado de "/all" para a raiz, assim o frontend consegue chamar /api/v1/users diretamente
    @GetMapping
    public ResponseEntity<java.util.List<Map<String, Object>>> getAllUsers() {
        java.util.List<Map<String, Object>> usersList = userRepository.findAll().stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("name", user.getName());
            map.put("email", user.getEmail());
            map.put("role", user.getRole().name()); 
            map.put("image", user.getImage());
            map.put("location", user.getLocation());
            return map;
        }).toList();
        
        return ResponseEntity.ok(usersList);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (request.containsKey("name")) user.setName(request.get("name"));
        if (request.containsKey("phone")) user.setPhone(request.get("phone"));
        if (request.containsKey("location")) user.setLocation(request.get("location"));
        if (request.containsKey("club")) user.setClub(request.get("club"));
        if (request.containsKey("bio")) user.setBio(request.get("bio"));
        if (request.containsKey("image")) user.setImage(request.get("image"));

        userRepository.save(user);
        return ResponseEntity.ok().body(Map.of("message", "Perfil atualizado com sucesso!"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (!passwordEncoder.matches(request.get("currentPassword"), user.getPassword())) {
            return ResponseEntity.badRequest().body("A senha atual está incorreta.");
        }
        
        user.setPassword(passwordEncoder.encode(request.get("newPassword")));
        userRepository.save(user);
        
        return ResponseEntity.ok().body(Map.of("message", "Senha atualizada com sucesso!"));
    }
}