// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/domain/UserDomain.java
package br.edu.ufop.web.scoutpro.domain;

import java.time.LocalDateTime;

import br.edu.ufop.web.scoutpro.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDomain {
    private Long id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private LocalDateTime createdAt;
}