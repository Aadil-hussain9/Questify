package com.selflearning.services;

import com.selflearning.dtos.AnswerCommentDto;
import com.selflearning.dtos.AnswerDto;
import com.selflearning.entities.*;
import com.selflearning.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;

@Service
public class AnswerServiceImpl implements AnswerService {

    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final ImageRepository imageRepository;
    private final AnswerCommentRepository answerCommentRepository;

    public AnswerServiceImpl(AnswerRepository answerRepository, UserRepository userRepository, QuestionRepository questionRepository, ImageRepository imageRepository, AnswerCommentRepository answerCommentRepository) {
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.imageRepository = imageRepository;
        this.answerCommentRepository = answerCommentRepository;
    }

    @Override
    public AnswerDto postAnswer(AnswerDto answerDto) {
        Optional<User> optionalUser = userRepository.findById(answerDto.getUserId());
        Optional<Question> optionalQuestion = questionRepository.findById(answerDto.getQuestionId());
        if (optionalUser.isPresent() && optionalQuestion.isPresent()) {
            Answer answer = new Answer();
            answer.setUser(optionalUser.get());
            answer.setQuestion(optionalQuestion.get());
            answer.setBody(answerDto.getBody());
            answer.setCreatedDate(new Date());
            Answer savedAnswer = answerRepository.save(answer);

            return AnswerDto.builder()
                    .id(savedAnswer.getId())
                    .body(savedAnswer.getBody())
                    .questionId(savedAnswer.getQuestion().getId())
                    .userId(savedAnswer.getUser().getId()).build();
        }
        ;
        return null;
    }

    @Override
    public void storeImage(Long answerId, MultipartFile multipartFile) {
        Optional<Answer> answer = answerRepository.findById(answerId);
        try {
            if (answer.isPresent()) {
                String fileName = StringUtils.cleanPath(Objects.requireNonNull(multipartFile.getOriginalFilename()));
                Image image = new Image();
                image.setAnswer(answer.get());
                image.setData(multipartFile.getBytes());
                image.setName(fileName);
                image.setType(multipartFile.getContentType());
                imageRepository.save(image);
            }else {
                throw new IOException("answer not found");
            }
        }catch (IOException ignored){}
    }

    public Boolean approveAnswer(Long answerId){
       Optional<Answer> optionalAnswer =  answerRepository.findById(answerId);
       if(optionalAnswer.isPresent()){
           Answer answer = optionalAnswer.get();
           answer.setApproved(true);
           answerRepository.save(answer);
           return true;
       }
       return false;
    }

    @Override
    public AnswerCommentDto postCommentToAnswer(AnswerCommentDto answerCommentDto) {
        Optional<User> optionalUser = userRepository.findById(answerCommentDto.getUserId());
        Optional<Answer> optionalAnswer = answerRepository.findById(answerCommentDto.getAnswerId());

        if(optionalAnswer.isPresent() && optionalUser.isPresent()){
            AnswerComment answerComment = new AnswerComment();
            answerComment.setBody(answerCommentDto.getBody());
            answerComment.setAnswer(optionalAnswer.get());
            answerComment.setUser(optionalUser.get());
            answerComment.setCreatedDate(new Date());
            AnswerComment savedAnswerComment = answerCommentRepository.save(answerComment);
            return AnswerCommentDto.builder().body(savedAnswerComment.getBody()).build();
        }

        return null;
    }
}