package com.selflearning.controllers;

import com.selflearning.dtos.AllQuestionsResponseDto;
import com.selflearning.dtos.QuestionDto;
import com.selflearning.dtos.QuestionSearchResponseDto;
import com.selflearning.dtos.SingleQuestionDto;
import com.selflearning.entities.Answer;
import com.selflearning.entities.Question;
import com.selflearning.entities.User;
import com.selflearning.services.DummyDataService;
import com.selflearning.services.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question")
public class QuestionController {

    private final QuestionService questionService;
    private final DummyDataService dummyDataService;

    public QuestionController(QuestionService questionService, DummyDataService dummyDataService) {
        this.questionService = questionService;
        this.dummyDataService = dummyDataService;
    }

    @PostMapping
    public ResponseEntity<?> postQuestion(@RequestBody QuestionDto questionDto){
       QuestionDto createdQuestionDto =  questionService.addQuestion(questionDto);
       if(createdQuestionDto == null){
          return ResponseEntity.badRequest().body("Something went Wrong");
       }
       return ResponseEntity.ok().body(createdQuestionDto);
    }

    @GetMapping("/questions/{pageNumber}")
    public ResponseEntity<AllQuestionsResponseDto> getAllQuestions(@PathVariable Integer pageNumber,
                                                                   @RequestParam(value = "sort", required = false) String sortParam){
        AllQuestionsResponseDto allQuestions = questionService.getAllQuestions(pageNumber, sortParam);
        return ResponseEntity.ok().body(allQuestions);
    }

    @GetMapping("/questions/{userId}/{pageNumber}")
    public ResponseEntity<AllQuestionsResponseDto> getQuestionsByUserId(@PathVariable Integer pageNumber,
                                                                        @PathVariable Integer userId){
        AllQuestionsResponseDto allQuestions = questionService.getQuestionsByUserId(pageNumber,userId);
        return ResponseEntity.ok().body(allQuestions);
    }

    @GetMapping("/{questionId}/{userId}")
    public ResponseEntity<?> getQuestionById(@PathVariable Long questionId , @PathVariable Long userId){
        SingleQuestionDto questionDto = questionService.getQuestionById(questionId, userId);
        if(questionDto == null){
            return ResponseEntity.badRequest().body("Something went Wrong");
        }
        return ResponseEntity.ok().body(questionDto);
    }

    @GetMapping("/search/{title}/{pageNumber}")
    public ResponseEntity<?> searchQuestionByTitle(@PathVariable String title,
                                                   @PathVariable Integer pageNumber){
        QuestionSearchResponseDto dto = questionService.searchQuestionByTitle(title,pageNumber);
        if(dto == null){
            return ResponseEntity.badRequest().body("Title is empty ");
        }
        return ResponseEntity.ok().body(dto);
    }

    @PutMapping("/incrementView/{questionId}")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Long questionId) {
        questionService.incrementViewCount(questionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/generate-questions")
    public ResponseEntity<List<Question>> generateQuestions() {

        // First generate users

        // Then generate questions
        List<Question> questions = dummyDataService.generateDummyQuestions(100);

        return ResponseEntity.ok(questions);
    }

    @PostMapping("/generate-users")
    public ResponseEntity<List<User>> generateUsers() {
        List<User> users = dummyDataService.generateDummyUsers(100);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/generate-answers")
    public ResponseEntity<List<Answer>> generateAnswers(
            @RequestParam(defaultValue = "5") int answersPerQuestion) {
        List<Answer> answerList =  dummyDataService.generateDummyAnswers(2);
        // Note: This assumes you have users and questions already in the database
        // You'll need to inject the appropriate repositories and fetch existing users/questions
        return ResponseEntity.ok().body(answerList);
    }
}
