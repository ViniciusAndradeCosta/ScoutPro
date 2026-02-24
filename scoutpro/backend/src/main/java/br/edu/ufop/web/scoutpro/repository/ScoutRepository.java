// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/repository/ScoutRepository.java
package br.edu.ufop.web.scoutpro.repository;

import br.edu.ufop.web.scoutpro.models.Scout;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ScoutRepository extends JpaRepository<Scout, Long> {
    Optional<Scout> findByUserId(Long userId);
}