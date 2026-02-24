// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/controllers/MessageController.java
package br.edu.ufop.web.scoutpro.controllers;

import br.edu.ufop.web.scoutpro.dto.DTOs.MessageRequest;
import br.edu.ufop.web.scoutpro.dto.DTOs.MessageResponse;
import br.edu.ufop.web.scoutpro.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getMessages() {
        return ResponseEntity.ok(messageService.getMyMessages());
    }

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@RequestBody MessageRequest request) {
        return ResponseEntity.ok(messageService.sendMessage(request));
    }
}