package com.selflearning.services;

import com.selflearning.dtos.SignupDto;
import com.selflearning.dtos.UserDto;
import com.selflearning.dtos.UserLeaderBoardResponse;
import com.selflearning.dtos.UserProfileDto;
import com.selflearning.entities.User;
import com.selflearning.entities.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserDto createUser(SignupDto signupDto);

    boolean hasUserWithEmail(String email);

    Optional<User> findUserByUserName(String email);

    List<UserLeaderBoardResponse> getUserLeaderBoard();

    UserProfileDto getUserDetails(Long userId);
}
