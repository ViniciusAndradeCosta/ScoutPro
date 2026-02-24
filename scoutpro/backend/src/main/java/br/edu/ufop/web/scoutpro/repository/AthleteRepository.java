package br.edu.ufop.web.scoutpro.repository;

import br.edu.ufop.web.scoutpro.models.Athlete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AthleteRepository extends JpaRepository<Athlete, Long> {
    
    // Conta os clubes distintos que não são nulos nem vazios
    @Query("SELECT COUNT(DISTINCT a.club) FROM Athlete a WHERE a.club IS NOT NULL AND TRIM(a.club) <> ''")
    long countDistinctClubs();
}