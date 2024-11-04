package com.selflearning.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AllQuestionsResponseDto {
    private List<QuestionDto> questionDtoList;
    private Integer totalPages;
    private Integer pageNumber;
}
