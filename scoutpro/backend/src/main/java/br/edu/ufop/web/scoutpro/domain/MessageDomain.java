// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/domain/MessageDomain.java
package br.edu.ufop.web.scoutpro.domain;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MessageDomain {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String content;
    private LocalDateTime timestamp;
}