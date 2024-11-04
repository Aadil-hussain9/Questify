package com.selflearning.controllers;

import com.selflearning.dtos.AnswerVoteDto;
import com.selflearning.dtos.QuestionVoteDto;
import com.selflearning.services.VoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping("/vote")
    public ResponseEntity<?> addVoteToQuestion(@RequestBody QuestionVoteDto questionVoteDto){
       QuestionVoteDto dto =  voteService.addVoteToQuestion(questionVoteDto);
       if(dto == null){
           return ResponseEntity.badRequest().body("Unfortunately vote not Saved");
       }
       return ResponseEntity.ok().body(dto);
    }

    @PostMapping("/answer-vote")
    public ResponseEntity<?> addVoteToAnswer(@RequestBody AnswerVoteDto answerVoteDto){
        AnswerVoteDto dto = voteService.addVoteToAnswer(answerVoteDto);
        if(dto == null){
            return ResponseEntity.badRequest().body("Unfortunately vote not Saved");
        }
        return ResponseEntity.ok().body(dto);
    }
}
