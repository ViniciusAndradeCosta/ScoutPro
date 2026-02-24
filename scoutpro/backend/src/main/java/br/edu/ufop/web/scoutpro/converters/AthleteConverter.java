package br.edu.ufop.web.scoutpro.converters;

import br.edu.ufop.web.scoutpro.dto.DTOs.AthleteRequest;
import br.edu.ufop.web.scoutpro.dto.DTOs.AthleteResponse;
import br.edu.ufop.web.scoutpro.enums.DominantFoot;
import br.edu.ufop.web.scoutpro.enums.Position;
import br.edu.ufop.web.scoutpro.models.Athlete;
import org.springframework.stereotype.Component;

@Component
public class AthleteConverter {

    public Athlete toEntity(AthleteRequest request) {
        if (request == null) {
            return null;
        }

        return Athlete.builder()
                .name(request.getName())
                .birthDate(request.getBirthDate())
                .nationality(request.getNationality())
                .height(request.getHeight())
                .weight(request.getWeight())
                .dominantFoot(request.getDominantFoot() != null ? DominantFoot.valueOf(request.getDominantFoot().toUpperCase()) : null)
                .position(request.getPosition() != null ? Position.valueOf(request.getPosition().toUpperCase()) : null)
                .club(request.getClub())
                .previousClub(request.getPreviousClub())
                .contractEnd(request.getContractEnd())
                .phone(request.getPhone())
                .email(request.getEmail())
                .notes(request.getNotes())
                .image(request.getImage())
                .matchesPlayed(request.getMatchesPlayed() != null ? request.getMatchesPlayed() : 0)
                .goals(request.getGoals() != null ? request.getGoals() : 0)
                .assists(request.getAssists() != null ? request.getAssists() : 0)
                .yellowCards(request.getYellowCards() != null ? request.getYellowCards() : 0)
                .finishing(request.getFinishing() != null ? request.getFinishing() : 50)
                .dribbling(request.getDribbling() != null ? request.getDribbling() : 50)
                .positioning(request.getPositioning() != null ? request.getPositioning() : 50)
                .pace(request.getPace() != null ? request.getPace() : 50)
                .strength(request.getStrength() != null ? request.getStrength() : 50)
                .stamina(request.getStamina() != null ? request.getStamina() : 50)
                .passing(request.getPassing() != null ? request.getPassing() : 50)
                .injuries(request.getInjuries()) // Mapeamento incluído
                .build();
    }

    public AthleteResponse toDto(Athlete model) {
        if (model == null) return null;
        
        return AthleteResponse.builder()
                .id(model.getId())
                .name(model.getName())
                .birthDate(model.getBirthDate())
                .nationality(model.getNationality())
                .height(model.getHeight())
                .weight(model.getWeight())
                .dominantFoot(model.getDominantFoot() != null ? model.getDominantFoot().name() : null)
                .position(model.getPosition() != null ? model.getPosition().name() : null)
                .club(model.getClub())
                .previousClub(model.getPreviousClub())
                .contractEnd(model.getContractEnd())
                .phone(model.getPhone())
                .email(model.getEmail())
                .notes(model.getNotes())
                .image(model.getImage())
                .rating(model.getRating())
                .isFavorite(model.getIsFavorite())
                .addedBy(model.getAddedBy() != null ? model.getAddedBy().getName() : "Sistema")
                .matchesPlayed(model.getMatchesPlayed())
                .goals(model.getGoals())
                .assists(model.getAssists())
                .yellowCards(model.getYellowCards())
                .finishing(model.getFinishing())
                .dribbling(model.getDribbling())
                .positioning(model.getPositioning())
                .pace(model.getPace())
                .strength(model.getStrength())
                .stamina(model.getStamina())
                .passing(model.getPassing())
                .injuries(model.getInjuries())
                .createdAt(model.getCreatedAt()) 
                .build();
    }
}