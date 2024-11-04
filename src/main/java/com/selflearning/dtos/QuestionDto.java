package com.selflearning.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Builder
public class QuestionDto {
    private Long id;
    private String title;
    private String body;
    private List<String> tags;
    private Long userId;
    private String userName;
    private Date datePosted;
    private Integer voteCount;
    private Integer voted;
    private Boolean hasApprovedAnswer;
    private int viewCount;
}
