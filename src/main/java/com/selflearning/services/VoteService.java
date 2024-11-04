package com.selflearning.services;

import com.selflearning.dtos.AnswerVoteDto;
import com.selflearning.dtos.QuestionVoteDto;

public interface VoteService {
    QuestionVoteDto addVoteToQuestion(QuestionVoteDto questionVoteDto);

    AnswerVoteDto addVoteToAnswer(AnswerVoteDto answerVoteDto);
}
