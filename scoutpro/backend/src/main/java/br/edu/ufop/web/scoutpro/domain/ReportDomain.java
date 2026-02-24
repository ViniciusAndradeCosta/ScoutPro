// scoutpro/src/main/java/br/edu/ufop/web/scoutpro/domain/ReportDomain.java
package br.edu.ufop.web.scoutpro.domain;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReportDomain {
    private Long id;
    private Long athleteId;
    private Long scoutId;
    private LocalDateTime matchDate;
    private Integer technicalRating;
    private Integer tacticalRating;
    private Integer physicalRating;
    private String strengths;
    private String weaknesses;
    private String notes;
    private LocalDateTime createdAt;
}