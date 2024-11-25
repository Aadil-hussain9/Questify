package com.selflearning.controllers;

import com.selflearning.dtos.AuthenticationRequest;
import com.selflearning.dtos.SignupDto;
import com.selflearning.dtos.UserDto;
import com.selflearning.entities.User;
import com.selflearning.services.USerDetailsServiceImpl;
import com.selflearning.services.UserService;
import com.selflearning.utils.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;

@RestController
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final USerDetailsServiceImpl uSerDetailsService;
    private final JwtUtil jwtUtil;

    private final String TOKEN_PREFIX = "Bearer";
    private final String HEADER_STRING = "Authorization";
    private final UserService userService;

    public AuthenticationController(AuthenticationManager authenticationManager, USerDetailsServiceImpl uSerDetailsService, JwtUtil jwtUtil, UserService service) {
        this.authenticationManager = authenticationManager;
        this.uSerDetailsService = uSerDetailsService;
        this.jwtUtil = jwtUtil;
        this.userService = service;
    }

    @PostMapping("/authentication")
    public void createAuthenticationToken(@RequestBody AuthenticationRequest request, HttpServletResponse response) throws IOException, JSONException {

        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
        }catch (BadCredentialsException e){
            throw new BadCredentialsException("Incorrect email or password");
        }catch (DisabledException exception){
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "User Is Not Created");
            return;
        }
      UserDetails userDetails =  uSerDetailsService.loadUserByUsername(request.getEmail());
        String jwtToken = jwtUtil.generateToken(userDetails.getUsername());
        Optional<User> optionalUser = userService.findUserByUserName(request.getEmail());
        // Create a JSON object to hold userId and userName
        JSONObject jsonResponse = new JSONObject();
        if (optionalUser.isPresent()) {
            jsonResponse.put("userId", optionalUser.get().getId());
            jsonResponse.put("userName", optionalUser.get().getName());
        }
        // Set response content type to JSON
        response.setContentType("application/json");
        // Write the combined JSON response to the response writer
        response.getWriter().write(jsonResponse.toString());

        response.addHeader("Access-Control-Expose-Headers","Authorization");
        response.setHeader("Access-Control-Allow-Headers","Authorization," +
                " X-PINGOTHER,X-Requested-With,Content-Type,Accept,X-Custom-header");
        response.setHeader(HEADER_STRING,TOKEN_PREFIX + jwtToken);
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
