package com.selflearning.services;

import com.selflearning.dtos.AnswerVoteDto;
import com.selflearning.dtos.QuestionVoteDto;
import com.selflearning.entities.*;
import com.selflearning.enums.VoteType;
import com.selflearning.repositories.*;

import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class VoteServiceImpl implements VoteService{

   private final QuestionVoteRepository questionVoteRepository;
   private final UserRepository userRepository;
   private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final AnswerVoteRepository answerVoteRepository;

    public VoteServiceImpl(QuestionVoteRepository questionVoteRepository, UserRepository userRepository, QuestionRepository questionRepository, AnswerRepository answerRepository, AnswerVoteRepository answerVoteRepository) {
        this.questionVoteRepository = questionVoteRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.answerVoteRepository = answerVoteRepository;
    }


    @Override
    public QuestionVoteDto addVoteToQuestion(QuestionVoteDto questionVoteDto) {
        Optional<User> optionalUser = userRepository.findById(questionVoteDto.getUserId());
        Optional<Question> optionalQuestion = questionRepository.findById(questionVoteDto.getQuestionId());
        if(optionalUser.isPresent() && optionalQuestion.isPresent()){
            QuestionVote questionVote = new QuestionVote();
            questionVote.setQuestion(optionalQuestion.get());
            questionVote.setVoteType(questionVoteDto.getVoteType());
            //update vote count in questionRepository
            Question existingQuestion = optionalQuestion.get();
            if(questionVote.getVoteType() == VoteType.UPVOTE){
                existingQuestion.setVoteCount(existingQuestion.getVoteCount() + 1);
            }else {
                existingQuestion.setVoteCount(existingQuestion.getVoteCount() - 1);
            }
            questionVote.setUser(optionalUser.get());
            //update vote count
            questionRepository.save(existingQuestion);
            QuestionVote savedVote= questionVoteRepository.save(questionVote);
            return QuestionVoteDto.builder()
                    .id(savedVote.getId())
                    .build();
        }
        return null;
    }

    @Override
    public AnswerVoteDto addVoteToAnswer(AnswerVoteDto answerVoteDto) {
        Optional<User> optionalUser = userRepository.findById(answerVoteDto.getUserId());
        if(optionalUser.isPresent()){
            Optional<Answer> optionalAnswer = answerRepository.findById(answerVoteDto.getAnswerId());
            if(optionalAnswer.isPresent()){
                Answer answerEntity = optionalAnswer.get();
                AnswerVote answerVote = new AnswerVote();
                answerVote.setUser(optionalUser.get());
                answerVote.setVoteType(answerVoteDto.getVoteType());
                Integer currentVoteCount = answerEntity.getVoteCount();
                if(answerVoteDto.getVoteType().equals(VoteType.UPVOTE)){
                    answerEntity.setVoteCount((currentVoteCount == null ? 0 : currentVoteCount) + 1);
                }else {
                    answerEntity.setVoteCount((currentVoteCount == null ? 0 : currentVoteCount) - 1);
                }
                answerVote.setAnswer(answerEntity);
                AnswerVote savedAnswerVote = answerVoteRepository.save(answerVote);

                return savedAnswerVote.mapToDto(savedAnswerVote);

            }
        }
        return null;
    }
}
