package com.selflearning.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.ZoneId;
import java.util.Date;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;
    private Date createdDate = new Date();

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "user")
    private UserDetails userDetails;

    // Utility method to get the year
    public int getCreatedYear() {
        return createdDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate()
                .getYear();
    }


}
