// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/converters/ReportConverter.java
package br.edu.ufop.web.scoutpro.converters;

import org.springframework.stereotype.Component;

import br.edu.ufop.web.scoutpro.domain.ReportDomain;
import br.edu.ufop.web.scoutpro.dto.DTOs.ReportRequest;
import br.edu.ufop.web.scoutpro.dto.DTOs.ReportResponse;
import br.edu.ufop.web.scoutpro.models.Report;

@Component
public class ReportConverter {

    public ReportDomain toDomain(Report model) {
        if (model == null) return null;
        return ReportDomain.builder()
                .id(model.getId())
                .athleteId(model.getAthlete() != null ? model.getAthlete().getId() : null)
                .scoutId(model.getScout() != null ? model.getScout().getId() : null)
                .matchDate(model.getMatchDate())
                .technicalRating(model.getTechnicalRating())
                .tacticalRating(model.getTacticalRating())
                .physicalRating(model.getPhysicalRating())
                .strengths(model.getStrengths())
                .weaknesses(model.getWeaknesses())
                .notes(model.getNotes())
                .createdAt(model.getCreatedAt())
                .build();
    }

    public ReportDomain toDomain(ReportRequest request) {
        if (request == null) return null;
        return ReportDomain.builder()
                .athleteId(request.getAthleteId())
                .matchDate(request.getMatchDate())
                .technicalRating(request.getTechnicalRating())
                .tacticalRating(request.getTacticalRating())
                .physicalRating(request.getPhysicalRating())
                .strengths(request.getStrengths())
                .weaknesses(request.getWeaknesses())
                .notes(request.getNotes())
                .build();
    }

    // Mapeando a entidade Report direta para pegar o Scout Name de forma segura
    public ReportResponse toDto(Report model) {
        if (model == null) return null;
        
        // Caminho correto para o banco de dados
        String realScoutName = "Sistema";
        if (model.getScout() != null && model.getScout().getUser() != null) {
            realScoutName = model.getScout().getUser().getName();
        }

        return ReportResponse.builder()
                .id(model.getId())
                .athleteId(model.getAthlete() != null ? model.getAthlete().getId() : null)
                .scoutId(model.getScout() != null ? model.getScout().getId() : null)
                .scoutName(realScoutName) // Usa o nome real
                .matchDate(model.getMatchDate())
                .technicalRating(model.getTechnicalRating())
                .tacticalRating(model.getTacticalRating())
                .physicalRating(model.getPhysicalRating())
                .strengths(model.getStrengths())
                .weaknesses(model.getWeaknesses())
                .notes(model.getNotes())
                .createdAt(model.getCreatedAt())
                .build();
    }
}