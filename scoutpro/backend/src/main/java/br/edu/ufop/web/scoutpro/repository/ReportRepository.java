// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/repository/ReportRepository.java
package br.edu.ufop.web.scoutpro.repository;

import br.edu.ufop.web.scoutpro.models.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByScoutId(Long scoutId);
    List<Report> findByAthleteId(Long athleteId);
}