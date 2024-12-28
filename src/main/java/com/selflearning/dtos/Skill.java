package com.selflearning.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Skill {
    private String name;
    private int proficiency;
}
