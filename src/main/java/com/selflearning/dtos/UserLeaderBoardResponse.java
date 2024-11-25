package com.selflearning.dtos;

import lombok.Data;

@Data
public class UserLeaderBoardResponse {
    private Integer rank;
    private String UserName;
    private int memberSince;
    private Long reputation;
    private Integer totalAnswersGiven;
    private Long totalApprovedAnswers;
    private Long totalQuestionsPosted;
    private long responseRate;
}