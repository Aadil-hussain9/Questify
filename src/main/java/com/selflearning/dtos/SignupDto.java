package com.selflearning.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class SignupDto {
    private String name;
    private String email;
    private String password;
    @JsonProperty("photoUrlSeed")
    private String photoUrl;
    private String designation;
    private String location;
    private List<Skill> skills;
    private String bio;
}

