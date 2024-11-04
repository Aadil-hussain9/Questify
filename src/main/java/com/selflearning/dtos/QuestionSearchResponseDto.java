package com.selflearning.dtos;

import lombok.Data;

import java.util.List;

@Data
public class QuestionSearchResponseDto {
    List<QuestionDto> questionDtoList;
    Integer totalPages;
    Integer pageNumber;
}
