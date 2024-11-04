package com.selflearning.services;

import com.selflearning.dtos.AllQuestionsResponseDto;
import com.selflearning.dtos.QuestionDto;
import com.selflearning.dtos.QuestionSearchResponseDto;
import com.selflearning.dtos.SingleQuestionDto;

public interface QuestionService {
    QuestionDto addQuestion(QuestionDto questionDto);

    AllQuestionsResponseDto getAllQuestions(Integer pageNumber, String sortParam);

    SingleQuestionDto getQuestionById(Long questionId, Long userId);

    AllQuestionsResponseDto getQuestionsByUserId(Integer pageNumber, Integer userId);

    QuestionSearchResponseDto searchQuestionByTitle(String title, Integer pageNumber);

    void incrementViewCount(Long questionId);
}
