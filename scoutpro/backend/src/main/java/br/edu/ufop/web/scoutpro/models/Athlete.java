package br.edu.ufop.web.scoutpro.models;

import br.edu.ufop.web.scoutpro.enums.DominantFoot;
import br.edu.ufop.web.scoutpro.enums.Position;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "players")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Athlete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_player")
    private Long id;

    private String name;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    private String nationality;
    private Double height;
    private Double weight;

    @Enumerated(EnumType.STRING)
    @Column(name = "dominant_foot")
    private DominantFoot dominantFoot;

    @Enumerated(EnumType.STRING)
    private Position position;

    private String club;

    @Column(name = "previous_club")
    private String previousClub;

    @Column(name = "contract_end")
    private LocalDate contractEnd;

    private String phone;
    private String email;
    
    @Column(columnDefinition="TEXT") 
    private String notes;
    
    @Column(columnDefinition="TEXT") 
    private String image;

    private Double rating;

    @Column(name = "is_favorite")
    private Boolean isFavorite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by", referencedColumnName = "id_user")
    private User addedBy; 

    // --- CAMPOS UNIFICADOS DE ESTATÍSTICAS (PlayerMatchStats) ---
    @Column(name = "matches_played")
    private Integer matchesPlayed = 0;
    
    @Column(name = "goals")
    private Integer goals = 0;
    
    @Column(name = "assists")
    private Integer assists = 0;
    
    @Column(name = "yellow_cards")
    private Integer yellowCards = 0;

    private Integer finishing = 50;
    private Integer dribbling = 50;
    private Integer positioning = 50;
    private Integer pace = 50;
    private Integer strength = 50;
    private Integer stamina = 50;
    private Integer passing = 50;

    // --- CAMPO DE LESÕES EM JSON ---
    @Convert(converter = br.edu.ufop.web.scoutpro.converters.InjuryListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<PlayerInjury> injuries;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }
}