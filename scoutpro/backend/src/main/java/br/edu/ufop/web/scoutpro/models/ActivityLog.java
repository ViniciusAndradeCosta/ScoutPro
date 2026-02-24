package br.edu.ufop.web.scoutpro.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // "report", "player_added", "message"
    private String title;
    private String description;
    
    @Column(name = "user_name")
    private String user; // Nome de quem fez a ação

    private LocalDateTime createdAt;

    // Metadados opcionais para exibir as "Badges" coloridas
    private String metadataPlayerName;
    private Double metadataRating;
    private String metadataBadge;
}