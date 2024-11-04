package com.selflearning.controllers;

import com.selflearning.dtos.AnswerCommentDto;
import com.selflearning.dtos.AnswerDto;
import com.selflearning.services.AnswerService;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping ("/api/answer")
public class AnswerController {

    private final AnswerService answerService;

    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @PostMapping
    public ResponseEntity<?> addAnswer(@RequestBody AnswerDto answerDto){
       AnswerDto dto = answerService.postAnswer(answerDto);
       if(dto == null){
           return ResponseEntity.badRequest().body("Something Went Wrong! ");
       }
       return ResponseEntity.ok().body(dto);
    }

    @PostMapping("/image/{answerId}")
    public ResponseEntity<?> uploadImage(@PathVariable Long answerId ,
                                         @RequestParam MultipartFile multipartFile){
        answerService.storeImage(answerId,multipartFile);
      return ResponseEntity.ok().body("Image Saved Successfully! ");
    }

    @GetMapping("/approve/{answerId}")
    public ResponseEntity<Boolean> approveAnswer(@PathVariable Long answerId){
        return new ResponseEntity<>(answerService.approveAnswer(answerId), HttpStatusCode.valueOf(200));
    }

    @PostMapping("/answer-comment")
    public ResponseEntity<?> postCommentToAnswer(@RequestBody AnswerCommentDto answerCommentDto){
        AnswerCommentDto dto =  answerService.postCommentToAnswer(answerCommentDto);
        if(dto == null){
            return ResponseEntity.badRequest().body("Something Went Wrong");
        }
        return ResponseEntity.ok().body(dto);
    }

}
