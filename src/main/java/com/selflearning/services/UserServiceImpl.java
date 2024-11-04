package com.selflearning.services;

import com.selflearning.dtos.SignupDto;
import com.selflearning.dtos.UserDto;
import com.selflearning.entities.User;
import com.selflearning.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDto createUser(SignupDto signupDto) {

        User user = new User();
        user.setName(signupDto.getName());
        user.setEmail(signupDto.getEmail());
        //Use Password encoder to save it in encoded form as we defined in config
        user.setPassword(new BCryptPasswordEncoder().encode(signupDto.getPassword()));
       User savedUser = userRepository.save(user);

        UserDto createdUser = UserDto.builder()
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .build();
        return createdUser;
    }

    @Override
    public boolean hasUserWithEmail(String email) {
        return userRepository.findFirstByEmail(email).isPresent();
    }

    @Override
    public Optional<User> findUserByUserName(String email) {
        return userRepository.findFirstByEmail(email);
    }
}
