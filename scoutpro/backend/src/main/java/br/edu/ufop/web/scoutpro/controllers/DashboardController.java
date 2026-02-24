package br.edu.ufop.web.scoutpro.controllers;

import br.edu.ufop.web.scoutpro.repository.AthleteRepository;
import br.edu.ufop.web.scoutpro.repository.ReportRepository;
import br.edu.ufop.web.scoutpro.repository.ScoutRepository; // <-- Importamos o repositório correto
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AthleteRepository athleteRepository;
    private final ReportRepository reportRepository;
    private final ScoutRepository scoutRepository; // <-- Trocamos UserRepository por ScoutRepository

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getLandingPageStats() {
        Map<String, Long> stats = new HashMap<>();
        
        try { stats.put("totalAthletes", athleteRepository.count()); } catch (Exception e) { stats.put("totalAthletes", 0L); }
        try { stats.put("totalReports", reportRepository.count()); } catch (Exception e) { stats.put("totalReports", 0L); }
        
        // CORRIGIDO: Agora conta diretamente da tabela de olheiros, sem conflito de texto/enum!
        try { stats.put("totalScouts", scoutRepository.count()); } catch (Exception e) { stats.put("totalScouts", 0L); } 
        
        try { stats.put("totalClubs", athleteRepository.countDistinctClubs()); } catch (Exception e) { stats.put("totalClubs", 0L); } 
        
        return ResponseEntity.ok(stats);
    }
}
