// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/converters/UserConverter.java
package br.edu.ufop.web.scoutpro.converters;

import org.springframework.stereotype.Component;

import br.edu.ufop.web.scoutpro.domain.UserDomain;
import br.edu.ufop.web.scoutpro.dto.DTOs.UserResponse;
import br.edu.ufop.web.scoutpro.models.User;

@Component
public class UserConverter {

    public UserDomain toDomain(User model) {
        if (model == null) return null;
        return UserDomain.builder()
                .id(model.getId())
                .name(model.getName())
                .email(model.getEmail())
                .password(model.getPassword())
                .role(model.getRole())
                .createdAt(model.getCreatedAt())
                .build();
    }

    public User toModel(UserDomain domain) {
        if (domain == null) return null;
        return User.builder()
                .id(domain.getId())
                .name(domain.getName())
                .email(domain.getEmail())
                .password(domain.getPassword())
                .role(domain.getRole())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    public UserResponse toDto(UserDomain domain) {
        if (domain == null) return null;
        return UserResponse.builder()
                .id(domain.getId())
                .name(domain.getName())
                .email(domain.getEmail())
                .role(domain.getRole() != null ? domain.getRole().name() : null)
                .createdAt(domain.getCreatedAt())
                .build();
    }
}