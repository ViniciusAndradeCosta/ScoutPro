package br.edu.ufop.web.scoutpro.controllers;

import br.edu.ufop.web.scoutpro.dto.DTOs.ActivityResponse;
import br.edu.ufop.web.scoutpro.models.ActivityLog;
import br.edu.ufop.web.scoutpro.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityRepository activityRepository;

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getActivities() {
        List<ActivityLog> logs = activityRepository.findAllByOrderByCreatedAtDesc();
        
        List<ActivityResponse> response = logs.stream().map(log -> {
            // Calcula o tempo relativo (ex: "2h", "5 min")
            String timeAgo = calculateTimeAgo(log.getCreatedAt());

            ActivityResponse.ActivityMetadata meta = ActivityResponse.ActivityMetadata.builder()
                .playerName(log.getMetadataPlayerName())
                .rating(log.getMetadataRating())
                .badge(log.getMetadataBadge())
                .build();

            return ActivityResponse.builder()
                .id(log.getId().toString())
                .type(log.getType())
                .title(log.getTitle())
                .description(log.getDescription())
                .time(timeAgo)
                .user(log.getUser())
                .metadata(meta)
                .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private String calculateTimeAgo(LocalDateTime past) {
        if (past == null) return "agora";
        Duration duration = Duration.between(past, LocalDateTime.now());
        long minutes = duration.toMinutes();
        if (minutes < 60) return minutes + " min";
        long hours = duration.toHours();
        if (hours < 24) return hours + "h";
        return duration.toDays() + " dias";
    }
}