package br.edu.ufop.web.scoutpro.repository;

import br.edu.ufop.web.scoutpro.models.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<ActivityLog, Long> {
    // Busca todas as atividades ordenadas das mais recentes para as mais antigas
    List<ActivityLog> findAllByOrderByCreatedAtDesc();
}