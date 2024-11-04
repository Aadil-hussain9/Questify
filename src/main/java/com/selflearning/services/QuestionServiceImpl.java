package com.selflearning.services;

import com.selflearning.dtos.*;
import com.selflearning.entities.*;
import com.selflearning.enums.VoteType;
import com.selflearning.repositories.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class QuestionServiceImpl implements QuestionService{

    private static final int SEARCH_RESULT_PER_PAGE = 5;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final AnswerRepository answerRepository;
    private final ImageRepository imageRepository;
    private final AnswerCommentRepository answerCommentRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository, UserRepository userRepository, AnswerRepository answerRepository, ImageRepository imageRepository, AnswerCommentRepository answerCommentRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.answerRepository = answerRepository;
        this.imageRepository = imageRepository;
        this.answerCommentRepository = answerCommentRepository;
    }

    @Override
    public QuestionDto addQuestion(QuestionDto questionDto) {
        Optional<User> optionalUser = userRepository.findById(questionDto.getUserId());
        if(optionalUser.isPresent()){
            Question question = new Question();
            question.setTitle(questionDto.getTitle());
            question.setBody(questionDto.getBody());
            question.setTags(questionDto.getTags());
            question.setCreatedDate(new Date());
            question.setUser(optionalUser.get());
            Question savedQuestion = questionRepository.save(question);

            return QuestionDto.builder()
                    .id(savedQuestion.getId())
                    .title(savedQuestion.getTitle())
                    .build();
        }
        return null;
    }

    @Override
    public AllQuestionsResponseDto getAllQuestions(Integer pageNumber, String sortParam) {
        Pageable pageable;
        if("date".equalsIgnoreCase(sortParam)){
           Sort sort =  Sort.by(Sort.Direction.DESC, "createdDate");
            pageable = PageRequest.of(pageNumber,SEARCH_RESULT_PER_PAGE, sort);
        }else {
            pageable = PageRequest.of(pageNumber,SEARCH_RESULT_PER_PAGE);
        }
        Page<Question> questionsPage = questionRepository.findAll(pageable);

        AllQuestionsResponseDto responseDto = AllQuestionsResponseDto.builder()
                .questionDtoList(questionsPage.stream().map(Question::getQuestionDto).toList())
                .pageNumber(questionsPage.getPageable().getPageNumber())
                .totalPages(questionsPage.getTotalPages())
                .build();

        return responseDto;
    }

    @Override
    public SingleQuestionDto getQuestionById(Long questionId, Long userId) {
        Optional<Question> question = questionRepository.findById(questionId);

        if(question.isPresent()){
            SingleQuestionDto singleQuestionDto = new SingleQuestionDto();
            Question existingQuestion = question.get();
            Optional<QuestionVote> hasUserVotedToQuestion = existingQuestion.getQuestionVoteList().stream()
                    .filter(vote -> vote.getUser().getId().equals(userId)).findFirst();

            QuestionDto questionDto = existingQuestion.getQuestionDto();

            if(hasUserVotedToQuestion.isPresent()){
                VoteType voteType = hasUserVotedToQuestion.get().getVoteType();
                questionDto.setVoted(voteType == VoteType.UPVOTE ? 1 : -1);
            }else {
                questionDto.setVoted(0);
            }

            singleQuestionDto.setQuestionDto(questionDto);
            List<Answer> answerList = answerRepository.findByQuestionId(question.get().getId());

            // Retrieve all votes made by the user, mapped by answer ID for quick lookup map<answerId,votes>
            Map<Long, AnswerVote> userVotedAnswersMap = answerList.stream()
                    .flatMap(answer -> answer.getAnswerVotes().stream())
                    .filter(voted -> voted.getUser().getId().equals(userId))
                    .collect(Collectors.toMap(vote -> vote.getAnswer().getId() ,
                            vote -> vote , (existing , replacement)-> replacement)); // Merge function: keep the latest vote

            List<AnswerDto> answerDtoList = answerList.stream()
                    .map(answer -> {
                        AnswerDto answerDto = answer.getAnswerDto();
                        answerDto.setVoted(0);
                        // Set voted status
                        AnswerVote answerVote = userVotedAnswersMap.get(answer.getId());
                        if(answerVote != null){
                            answerDto.setVoted(answerVote.getVoteType() == VoteType.UPVOTE ? 1 : -1);
                        }
                        // Set approved answer status
                        singleQuestionDto.getQuestionDto().setHasApprovedAnswer(answerDto.getApproved());

                        // Set optional image if exists
                        imageRepository.findByAnswerId(answerDto.getId())
                                .ifPresent(answerDto::setFile);
                        List<AnswerComment> answerComments =answerCommentRepository.findAllByAnswerId(answer.getId());
                        answerDto.setAnswerComments(answerComments.stream().map(AnswerComment::getAnswerCommentDto).toList());
                        return answerDto;
                    })
                    .toList();
            singleQuestionDto.setAnswerDtoList(answerDtoList);
            return singleQuestionDto;
        }
        return null;
    }

    @Override
    public AllQuestionsResponseDto getQuestionsByUserId(Integer pageNumber, Integer userId) {
        Pageable paging = PageRequest.of(pageNumber, SEARCH_RESULT_PER_PAGE);

        Page<Question> questionsPage = questionRepository.findAllByUserId(paging, userId);

        return AllQuestionsResponseDto.builder()
                .questionDtoList(questionsPage.stream().map(Question::getQuestionDto).toList())
                .pageNumber(questionsPage.getPageable().getPageNumber())
                .totalPages(questionsPage.getTotalPages())
                .build();
    }

    @Override
    public QuestionSearchResponseDto searchQuestionByTitle(String title, Integer pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, SEARCH_RESULT_PER_PAGE);
        Page<Question> questionPage = questionRepository.findAllByTitleContaining(title, pageable);
        QuestionSearchResponseDto responseDto = new QuestionSearchResponseDto();
        responseDto.setQuestionDtoList(questionPage.stream().map(Question::getQuestionDto).toList());
        responseDto.setPageNumber(questionPage.getPageable().getPageNumber());
        responseDto.setTotalPages(questionPage.getTotalPages());
        return (title != null)?responseDto:null;
    }

    @Override
    public void incrementViewCount(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(()->new RuntimeException("Question not found"));
       question.setViewCount(question.getViewCount() + 1);
       questionRepository.save(question);
    }

    private List<QuestionDto> getQuestionDtoList(List<Question> content) {
        List<QuestionDto> dtos = new ArrayList<>();
        content.forEach(question ->{
          dtos.add(QuestionDto.builder()
                          .id(question.getId())
                          .body(question.getBody())
                          .title(question.getTitle())
                          .tags(question.getTags())
                          .userId(question.getUser().getId())
                  .build());
        });
        return dtos;
    }
}
