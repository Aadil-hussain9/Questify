package com.selflearning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.selflearning.dtos.AnswerCommentDto;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Entity
@Data
@Table(name = "answer_comment")
public class AnswerComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String body;

    private Date createdDate;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "answer_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    @ToString.Exclude
    private Answer answer;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "user_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    @ToString.Exclude
    private User user;

    public AnswerCommentDto getAnswerCommentDto(){
        return AnswerCommentDto.builder()
                .body(body)
                .createdDate(createdDate)
                .answerId(answer.getId())
                .userId(user.getId())
                .userName(user.getName())
                .build();
    }
}
