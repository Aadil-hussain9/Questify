package com.selflearning.dtos;

import com.selflearning.enums.VoteType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerVoteDto {
    private Long id;

    private VoteType voteType;

    private Long userId;

    private Long answerId;
}
