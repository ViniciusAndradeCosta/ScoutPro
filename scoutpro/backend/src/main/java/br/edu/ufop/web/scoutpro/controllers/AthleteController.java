package br.edu.ufop.web.scoutpro.controllers;

import br.edu.ufop.web.scoutpro.dto.DTOs.AthleteRequest;
import br.edu.ufop.web.scoutpro.dto.DTOs.AthleteResponse;
import br.edu.ufop.web.scoutpro.services.AthleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/athletes")
@RequiredArgsConstructor
public class AthleteController {

    private final AthleteService athleteService;

    @GetMapping
    public ResponseEntity<List<AthleteResponse>> listAll() {
        return ResponseEntity.ok(athleteService.listAll());
    }

    // NOVO MÉTODO ADICIONADO AQUI: Permite buscar um atleta específico pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<AthleteResponse> getById(@PathVariable Long id) {
        // Certifique-se de que o método no seu AthleteService se chama findById (ou adapte para o nome que você usou, como getAthleteById)
        return ResponseEntity.ok(athleteService.findById(id)); 
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('SCOUT', 'ADMIN')")
    public ResponseEntity<AthleteResponse> create(@RequestBody AthleteRequest request) {
        return ResponseEntity.ok(athleteService.createAthlete(request));
    }   

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOUT', 'ADMIN')")
    public ResponseEntity<AthleteResponse> update(@PathVariable Long id, @RequestBody AthleteRequest request) {
        return ResponseEntity.ok(athleteService.updateAthlete(id, request));
    }
}