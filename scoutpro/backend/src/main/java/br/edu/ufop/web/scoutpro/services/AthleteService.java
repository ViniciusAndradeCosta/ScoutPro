package br.edu.ufop.web.scoutpro.services;

import br.edu.ufop.web.scoutpro.dto.DTOs.AthleteRequest;
import br.edu.ufop.web.scoutpro.dto.DTOs.AthleteResponse;
import br.edu.ufop.web.scoutpro.enums.DominantFoot;
import br.edu.ufop.web.scoutpro.enums.Position;
import br.edu.ufop.web.scoutpro.models.Athlete;
import br.edu.ufop.web.scoutpro.models.User;
import br.edu.ufop.web.scoutpro.repository.AthleteRepository;
import br.edu.ufop.web.scoutpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AthleteService {

    private final AthleteRepository athleteRepository;
    private final UserRepository userRepository;

    public AthleteResponse createAthlete(AthleteRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Athlete athlete = Athlete.builder()
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
                .isFavorite(false)
                .addedBy(user)
                
                // Salvar Estatísticas
                .matchesPlayed(request.getMatchesPlayed() != null ? request.getMatchesPlayed() : 0)
                .goals(request.getGoals() != null ? request.getGoals() : 0)
                .assists(request.getAssists() != null ? request.getAssists() : 0)
                .yellowCards(request.getYellowCards() != null ? request.getYellowCards() : 0)

                // Salvar Atributos
                .finishing(request.getFinishing() != null ? request.getFinishing() : 50)
                .dribbling(request.getDribbling() != null ? request.getDribbling() : 50)
                .positioning(request.getPositioning() != null ? request.getPositioning() : 50)
                .pace(request.getPace() != null ? request.getPace() : 50)
                .strength(request.getStrength() != null ? request.getStrength() : 50)
                .stamina(request.getStamina() != null ? request.getStamina() : 50)
                .passing(request.getPassing() != null ? request.getPassing() : 50)
                
                // Mapeamento das Lesões
                .injuries(request.getInjuries())
                
                .build();
        
        athleteRepository.save(athlete);
        return mapToResponse(athlete);
    }

    public AthleteResponse updateAthlete(Long id, AthleteRequest request) {
        Athlete athlete = athleteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Athlete not found with id: " + id));

        athlete.setName(request.getName());
        athlete.setBirthDate(request.getBirthDate());
        athlete.setNationality(request.getNationality());
        athlete.setHeight(request.getHeight());
        athlete.setWeight(request.getWeight());
        athlete.setDominantFoot(request.getDominantFoot() != null ? DominantFoot.valueOf(request.getDominantFoot().toUpperCase()) : null);
        athlete.setPosition(request.getPosition() != null ? Position.valueOf(request.getPosition().toUpperCase()) : null);
        athlete.setClub(request.getClub());
        athlete.setPreviousClub(request.getPreviousClub());
        athlete.setContractEnd(request.getContractEnd());
        athlete.setPhone(request.getPhone());
        athlete.setEmail(request.getEmail());
        athlete.setNotes(request.getNotes());
        
        // Atualizar Estatísticas
        if(request.getMatchesPlayed() != null) athlete.setMatchesPlayed(request.getMatchesPlayed());
        if(request.getGoals() != null) athlete.setGoals(request.getGoals());
        if(request.getAssists() != null) athlete.setAssists(request.getAssists());
        if(request.getYellowCards() != null) athlete.setYellowCards(request.getYellowCards());

        // Atualizar Atributos
        if(request.getFinishing() != null) athlete.setFinishing(request.getFinishing());
        if(request.getDribbling() != null) athlete.setDribbling(request.getDribbling());
        if(request.getPositioning() != null) athlete.setPositioning(request.getPositioning());
        if(request.getPace() != null) athlete.setPace(request.getPace());
        if(request.getStrength() != null) athlete.setStrength(request.getStrength());
        if(request.getStamina() != null) athlete.setStamina(request.getStamina());
        if(request.getPassing() != null) athlete.setPassing(request.getPassing());
        
        // Atualizar Lesões
        if(request.getInjuries() != null) {
            athlete.setInjuries(request.getInjuries());
        }
        
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            athlete.setImage(request.getImage());
        }
        
        athleteRepository.save(athlete);
        return mapToResponse(athlete);
    }

    public List<AthleteResponse> listAll() {
        return athleteRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AthleteResponse findById(Long id) {
        Athlete athlete = athleteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Athlete not found with id: " + id));
        
        return mapToResponse(athlete);
    }

    private AthleteResponse mapToResponse(Athlete athlete) {
        return AthleteResponse.builder()
                .id(athlete.getId())
                .name(athlete.getName())
                .birthDate(athlete.getBirthDate())
                .nationality(athlete.getNationality())
                .height(athlete.getHeight())
                .weight(athlete.getWeight())
                .dominantFoot(athlete.getDominantFoot() != null ? athlete.getDominantFoot().name() : null)
                .position(athlete.getPosition() != null ? athlete.getPosition().name() : null)
                .club(athlete.getClub())
                .previousClub(athlete.getPreviousClub())
                .contractEnd(athlete.getContractEnd())
                .phone(athlete.getPhone())
                .email(athlete.getEmail())
                .notes(athlete.getNotes())
                .image(athlete.getImage())
                .rating(athlete.getRating())
                .isFavorite(athlete.getIsFavorite())
                .scoutId(athlete.getAddedBy() != null ? athlete.getAddedBy().getId() : null)
                .addedBy(athlete.getAddedBy() != null ? athlete.getAddedBy().getName() : "Sistema") 
                
                // Mapear Estatísticas para a Resposta
                .matchesPlayed(athlete.getMatchesPlayed())
                .goals(athlete.getGoals())
                .assists(athlete.getAssists())
                .yellowCards(athlete.getYellowCards())
                
                // Mapear Atributos para a Resposta
                .finishing(athlete.getFinishing())
                .dribbling(athlete.getDribbling())
                .positioning(athlete.getPositioning())
                .pace(athlete.getPace())
                .strength(athlete.getStrength())
                .stamina(athlete.getStamina())
                .passing(athlete.getPassing())
                
                // Mapear Lesões para a Resposta
                .injuries(athlete.getInjuries())
                
                .build();
    }
}