package com.selflearning.dtos;

import lombok.Data;

import java.util.List;

@Data
public class SingleQuestionDto {
   private QuestionDto questionDto;
   private List<AnswerDto> answerDtoList;
}
