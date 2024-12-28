package com.selflearning.controllers;

import com.selflearning.dtos.SignupDto;
import com.selflearning.dtos.UserDto;
import com.selflearning.dtos.UserLeaderBoardResponse;
import com.selflearning.dtos.UserProfileDto;
import com.selflearning.entities.UserDetails;
import com.selflearning.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping(value = "/api/user-leaderboard")
    public ResponseEntity<List<UserLeaderBoardResponse>> getUserLeaderBoard(){
        List<UserLeaderBoardResponse> responseList = userService.getUserLeaderBoard();
        if(responseList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
       return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    @GetMapping(value = "/api/user-details/{userId}")
    public ResponseEntity<UserProfileDto> getUserDetails(@PathVariable Long userId){
       Optional<UserProfileDto> responseList = Optional.of(userService.getUserDetails(userId));
        return new ResponseEntity<>(responseList.get(), HttpStatus.OK);
    }
}
