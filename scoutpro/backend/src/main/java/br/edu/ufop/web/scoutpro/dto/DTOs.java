package br.edu.ufop.web.scoutpro.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class DTOs {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String role;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AthleteRequest {
        private String name;
        private LocalDate birthDate;
        private String nationality;
        private Double height;
        private Double weight;
        private String dominantFoot;
        private String position;
        private String club;
        private String previousClub;
        private LocalDate contractEnd;
        private String phone;
        private String email;
        private String notes;
        private String image;
        
        // Estatísticas Básicas
        private Integer matchesPlayed;
        private Integer goals;
        private Integer assists;
        private Integer yellowCards;

        // Atributos
        private Integer finishing;
        private Integer dribbling;
        private Integer positioning;
        private Integer pace;
        private Integer strength;
        private Integer stamina;
        private Integer passing;
        
        // Campo adicionado para receber as lesões do frontend
        private java.util.List<br.edu.ufop.web.scoutpro.models.PlayerInjury> injuries; 
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AthleteResponse {
        private Long id;
        private String name;
        private LocalDate birthDate;
        private String nationality;
        private Double height;
        private Double weight;
        private String dominantFoot;
        private String position;
        private String club;
        private String previousClub;
        private LocalDate contractEnd;
        private String phone;
        private String email;
        private String notes;
        private String image;
        private Double rating;
        private Boolean isFavorite;
        private Long scoutId;
        private String addedBy;
        private LocalDateTime createdAt;

        // Estatísticas Básicas
        private Integer matchesPlayed;
        private Integer goals;
        private Integer assists;
        private Integer yellowCards;

        // Atributos
        private Integer finishing;
        private Integer dribbling;
        private Integer positioning;
        private Integer pace;
        private Integer strength;
        private Integer stamina;
        private Integer passing;

        private java.util.List<br.edu.ufop.web.scoutpro.models.PlayerInjury> injuries; 
    }
    

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ReportRequest {
        private Long athleteId;
        private LocalDateTime matchDate;
        private Integer technicalRating;
        private Integer tacticalRating;
        private Integer physicalRating;
        private String strengths;
        private String weaknesses;
        private String notes;
        private String status;
        
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ReportResponse {
        private Long id;
        private Long athleteId;
        private Long scoutId;
        private String scoutName;
        private LocalDateTime matchDate;
        private Integer technicalRating;
        private Integer tacticalRating;
        private Integer physicalRating;
        private String strengths;
        private String weaknesses;
        private String notes;
        private String status; 
        private LocalDateTime createdAt;
        
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MessageRequest {
        private Long receiverId;
        private String content;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MessageResponse {
        private Long id;
        private Long senderId;
        private Long receiverId;
        private String content;
        private LocalDateTime timestamp;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class NotificationResponse {
        private Long id;
        private String type;
        private String title;
        private String description;
        private String time;
        private boolean read;
        private String priority;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ActivityResponse {
        private String id;
        private String type;
        private String title;
        private String description;
        private String time;
        private String user;
        private ActivityMetadata metadata;

        @Data @Builder @NoArgsConstructor @AllArgsConstructor
        public static class ActivityMetadata {
            private String playerName;
            private Double rating;
            private String badge;
        }
    }
}