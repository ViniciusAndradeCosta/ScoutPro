// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/models/Message.java
package br.edu.ufop.web.scoutpro.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    // CORREÇÃO: referenciando "id_user"
    @JoinColumn(name = "sender_id", referencedColumnName = "id_user")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    // CORREÇÃO: referenciando "id_user"
    @JoinColumn(name = "receiver_id", referencedColumnName = "id_user")
    private User receiver;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() { this.timestamp = LocalDateTime.now(); }
}