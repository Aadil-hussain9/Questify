package com.selflearning.repositories;

import com.selflearning.entities.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question,Long> {
    Page<Question> findAllByUserId(Pageable paging, Integer userId);

    Page<Question> findAllByTitleContaining(String title, Pageable pageable);
}
