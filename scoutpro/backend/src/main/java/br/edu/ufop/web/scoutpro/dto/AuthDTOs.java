package br.edu.ufop.web.scoutpro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDTOs {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String role;
        private String club;
        private String region;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuthRequest {
        private String email;
        private String password;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuthResponse {
        private String token;

        // GARANTIA ANTI-FALHA: Getter manual para o Spring Boot não enviar resposta vazia!
        public String getToken() {
            return this.token;
        }
    }
}