package br.edu.ufop.web.scoutpro.services;

import br.edu.ufop.web.scoutpro.dto.DTOs.ReportRequest;
import br.edu.ufop.web.scoutpro.dto.DTOs.ReportResponse;
import br.edu.ufop.web.scoutpro.models.Athlete;
import br.edu.ufop.web.scoutpro.models.Report;
import br.edu.ufop.web.scoutpro.models.Scout;
import br.edu.ufop.web.scoutpro.models.User;
import br.edu.ufop.web.scoutpro.repository.AthleteRepository;
import br.edu.ufop.web.scoutpro.repository.ReportRepository;
import br.edu.ufop.web.scoutpro.repository.ScoutRepository;
import br.edu.ufop.web.scoutpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final AthleteRepository athleteRepository;
    private final ScoutRepository scoutRepository;
    private final UserRepository userRepository;

    public ReportResponse createReport(ReportRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Scout scout = scoutRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Apenas Scouts podem criar relatórios"));

        Athlete athlete = athleteRepository.findById(request.getAthleteId())
                .orElseThrow(() -> new RuntimeException("Atleta não encontrado"));

        Report report = Report.builder()
                .athlete(athlete)
                .scout(scout)
                .matchDate(request.getMatchDate())
                .technicalRating(request.getTechnicalRating())
                .tacticalRating(request.getTacticalRating())
                .physicalRating(request.getPhysicalRating())
                .strengths(request.getStrengths())
                .weaknesses(request.getWeaknesses())
                .notes(request.getNotes())
                .status(request.getStatus() != null ? request.getStatus() : "pending")
                .build();

        reportRepository.save(report);
        return mapToResponse(report);
    }

    public List<ReportResponse> listAll() {
        return reportRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // CORREÇÃO: Método para o Admin atualizar o Status
    public ReportResponse updateReportStatus(Long id, String newStatus) {
        Report report = reportRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Relatório não encontrado"));
        
        report.setStatus(newStatus);
        reportRepository.save(report);
        return mapToResponse(report);
    }

    private ReportResponse mapToResponse(Report report) {
        String realScoutName = "Desconhecido";
        if (report.getScout() != null && report.getScout().getUser() != null) {
            realScoutName = report.getScout().getUser().getName();
        }

        return ReportResponse.builder()
                .id(report.getId())
                .athleteId(report.getAthlete() != null ? report.getAthlete().getId() : null)
                .scoutId(report.getScout() != null ? report.getScout().getId() : null)
                .scoutName(realScoutName)
                .matchDate(report.getMatchDate())
                .technicalRating(report.getTechnicalRating())
                .tacticalRating(report.getTacticalRating())
                .physicalRating(report.getPhysicalRating())
                .strengths(report.getStrengths())
                .weaknesses(report.getWeaknesses())
                .notes(report.getNotes())
                .status(report.getStatus()) // Mapeando Status
                .createdAt(report.getCreatedAt())
                .build();
    }
}