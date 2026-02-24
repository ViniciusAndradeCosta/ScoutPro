// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/converters/MessageConverter.java
package br.edu.ufop.web.scoutpro.converters;

import org.springframework.stereotype.Component;

import br.edu.ufop.web.scoutpro.domain.MessageDomain;
import br.edu.ufop.web.scoutpro.dto.DTOs.MessageRequest;
import br.edu.ufop.web.scoutpro.dto.DTOs.MessageResponse;
import br.edu.ufop.web.scoutpro.models.Message;

@Component
public class MessageConverter {

    public MessageDomain toDomain(Message model) {
        if (model == null) return null;
        return MessageDomain.builder()
                .id(model.getId())
                .senderId(model.getSender() != null ? model.getSender().getId() : null)
                .receiverId(model.getReceiver() != null ? model.getReceiver().getId() : null)
                .content(model.getContent())
                .timestamp(model.getTimestamp())
                .build();
    }

    public MessageDomain toDomain(MessageRequest request) {
        if (request == null) return null;
        return MessageDomain.builder()
                .receiverId(request.getReceiverId())
                .content(request.getContent())
                .build();
    }

    public MessageResponse toDto(MessageDomain domain) {
        if (domain == null) return null;
        return MessageResponse.builder()
                .id(domain.getId())
                .senderId(domain.getSenderId())
                .receiverId(domain.getReceiverId())
                .content(domain.getContent())
                .timestamp(domain.getTimestamp())
                .build();
    }
}