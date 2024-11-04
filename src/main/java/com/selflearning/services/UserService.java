package com.selflearning.services;

import com.selflearning.dtos.SignupDto;
import com.selflearning.dtos.UserDto;
import com.selflearning.entities.User;

import java.util.Optional;

public interface UserService {
    UserDto createUser(SignupDto signupDto);

    boolean hasUserWithEmail(String email);

    Optional<User> findUserByUserName(String email);
}
