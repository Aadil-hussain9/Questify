package com.selflearning.controllers;

import com.selflearning.dtos.SignupDto;
import com.selflearning.dtos.UserDto;
import com.selflearning.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignUpController {

    private final UserService userService;

    public SignUpController(UserService userService){
        this.userService = userService;
    }

    @PostMapping(value = "/signup")
    public ResponseEntity<?> createUser(@RequestBody SignupDto signupDto){
        if(userService.hasUserWithEmail(signupDto.getEmail())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                    .body("user already exists with email: "+signupDto.getEmail());
        }
       UserDto createdUser =  userService.createUser(signupDto);
       if(createdUser == null){
           return ResponseEntity.badRequest().body("user not created, Try again");
       }
       return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
}
