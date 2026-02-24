package br.edu.ufop.web.scoutpro.models;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerInjury {
    private String injuryType;
    private String startDate; 
    private String returnDate;
    private String severity;
}