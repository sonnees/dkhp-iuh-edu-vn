package edu.iuh.studentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StatisticScore {
    private String[] subjectNames;
    private Double[] finalScores;
}
