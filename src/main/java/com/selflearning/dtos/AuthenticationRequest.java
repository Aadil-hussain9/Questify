package com.selflearning.dtos;

import lombok.Builder;
import lombok.Data;

@Data
public class AuthenticationRequest {
    private String email;
    private String password;
}

