package com.selflearning.services;

import com.selflearning.dtos.AnswerCommentDto;
import com.selflearning.dtos.AnswerDto;
import org.springframework.web.multipart.MultipartFile;

public interface AnswerService {
    AnswerDto postAnswer(AnswerDto answerDto);

    void storeImage(Long answerId, MultipartFile multipartFile);

    Boolean approveAnswer(Long answerId);

    AnswerCommentDto postCommentToAnswer(AnswerCommentDto answerCommentDto);
}
