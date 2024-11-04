package com.selflearning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.selflearning.dtos.AnswerVoteDto;
import com.selflearning.enums.VoteType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
public class AnswerVote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private VoteType voteType;

    @ManyToOne(fetch = FetchType.LAZY , optional = false)
    @JoinColumn(name = "user_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    @ToString.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY , optional = false)
    @JoinColumn(name = "answer_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    @ToString.Exclude
    private Answer answer;

    public AnswerVoteDto mapToDto(AnswerVote savedAnswerVote) {
        return AnswerVoteDto.builder()
                .id(savedAnswerVote.id)
                .userId(savedAnswerVote.user.getId())
                .voteType(savedAnswerVote.voteType)
                .answerId(savedAnswerVote.answer.getId())
                .build();
    }
}
