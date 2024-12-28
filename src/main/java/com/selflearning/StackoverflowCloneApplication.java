package com.selflearning;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@SpringBootApplication
public class StackoverflowCloneApplication {

    public static void main(String[] args) {
        SpringApplication.run(StackoverflowCloneApplication.class, args);
        ZonedDateTime germanTime = ZonedDateTime.now(ZoneId.of("Europe/Berlin"));
        System.out.println("Task running at German time: " + germanTime);
    }

}
