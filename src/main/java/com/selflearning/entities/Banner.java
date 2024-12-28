package com.selflearning.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Banner {

    @Id
    private Long id;
    private String message;
    private boolean active;
}
