// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/repository/MessageRepository.java
package br.edu.ufop.web.scoutpro.repository;

import br.edu.ufop.web.scoutpro.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
}