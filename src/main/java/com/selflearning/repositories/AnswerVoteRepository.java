package com.selflearning.repositories;

import com.selflearning.entities.AnswerVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerVoteRepository extends JpaRepository<AnswerVote,Long> {
}
