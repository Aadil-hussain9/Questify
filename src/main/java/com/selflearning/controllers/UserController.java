package com.selflearning.controllers;

import com.selflearning.dtos.SignupDto;
import com.selflearning.dtos.UserDto;
import com.selflearning.dtos.UserLeaderBoardResponse;
import com.selflearning.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
