// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/services/AdminService.java
package br.edu.ufop.web.scoutpro.services;

import br.edu.ufop.web.scoutpro.dto.DTOs.UserResponse;
import br.edu.ufop.web.scoutpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<UserResponse> listAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> UserResponse.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .role(u.getRole().name())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}