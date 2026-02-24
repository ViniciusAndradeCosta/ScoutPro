// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/domain/AthleteDomain.java
package br.edu.ufop.web.scoutpro.domain;

import java.time.LocalDateTime;

import br.edu.ufop.web.scoutpro.enums.DominantFoot;
import br.edu.ufop.web.scoutpro.enums.Position;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AthleteDomain {
    private Long id;
    private String name;
    private Integer age;
    private Double height;
    private Double weight;
    private DominantFoot dominantFoot;
    private Position position;
    private String club;
    private Long createdByScoutId;
    private LocalDateTime createdAt;
}