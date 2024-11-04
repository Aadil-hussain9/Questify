package com.selflearning.dtos;

import com.selflearning.entities.Image;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Builder
public class AnswerDto {

    private Long id;
    private String body;
    private Long questionId;
    private Long userId;
    private String userName;
    private Image file;
    private Date postedDate;
    private Boolean approved;
    private Integer voteCount;
    private Integer voted;
    private List<AnswerCommentDto> answerComments;
}
