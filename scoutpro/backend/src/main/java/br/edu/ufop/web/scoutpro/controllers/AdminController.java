// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/controllers/AdminController.java
package br.edu.ufop.web.scoutpro.controllers;

import br.edu.ufop.web.scoutpro.dto.DTOs.UserResponse;
import br.edu.ufop.web.scoutpro.services.AdminService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> listUsers() {
        return ResponseEntity.ok(adminService.listAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<String> dashboard() {
        return ResponseEntity.ok("Dashboard Admin Access OK");
    }
}