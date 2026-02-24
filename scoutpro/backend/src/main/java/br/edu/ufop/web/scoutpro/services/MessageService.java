// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/services/MessageService.java
package br.edu.ufop.web.scoutpro.services;

import br.edu.ufop.web.scoutpro.dto.DTOs.MessageRequest;
import br.edu.ufop.web.scoutpro.dto.DTOs.MessageResponse;
import br.edu.ufop.web.scoutpro.models.Message;
import br.edu.ufop.web.scoutpro.models.User;
import br.edu.ufop.web.scoutpro.repository.MessageRepository;
import br.edu.ufop.web.scoutpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageResponse sendMessage(MessageRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User sender = userRepository.findByEmail(email).orElseThrow();
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Destinatário não encontrado"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .build();

        messageRepository.save(message);
        return mapToResponse(message);
    }

    public List<MessageResponse> getMyMessages() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return messageRepository.findBySenderIdOrReceiverId(user.getId(), user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private MessageResponse mapToResponse(Message msg) {
        return MessageResponse.builder()
                .id(msg.getId())
                .senderId(msg.getSender().getId())
                .receiverId(msg.getReceiver().getId())
                .content(msg.getContent())
                .timestamp(msg.getTimestamp())
                .build();
    }
}