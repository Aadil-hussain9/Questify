package com.selflearning.repositories;

import com.selflearning.entities.AnswerComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerCommentRepository extends JpaRepository<AnswerComment,Long> {
    List<AnswerComment> findAllByAnswerId(Long id);
}
