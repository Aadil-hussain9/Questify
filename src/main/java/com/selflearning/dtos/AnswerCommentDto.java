package com.selflearning.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class AnswerCommentDto {
    private String body;
    private Date createdDate;
    private Long answerId;
    private Long userId;
    private String userName;
}
