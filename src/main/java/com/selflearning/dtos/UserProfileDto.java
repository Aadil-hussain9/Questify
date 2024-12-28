package com.selflearning.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserProfileDto {
    private String name;
    private String email;
    private String photoUrl;
    private String designation;
    private String location;
    private List<Skill> skills;
    private String bio;
}
