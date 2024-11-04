package com.selflearning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.selflearning.dtos.AnswerDto;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;
import java.util.List;

@Entity
@Data
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType. IDENTITY)
    private Long id;

    @Lob
    @Column (name = "body", length = 512)
    private String body;


    private Date createdDate;

    private Boolean approved = false;

    private Integer voteCount = 0;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn (name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    @ToString.Exclude
    private User user;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn (name = "question_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    @ToString.Exclude
    private Question question;

    @OneToMany(mappedBy = "answer",cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<AnswerVote> answerVotes;

    public AnswerDto getAnswerDto() {
        return AnswerDto.builder()
                .id(id)
                .body(body)
                .questionId(question.getId())
                .userId(user.getId())
                .userName(user.getName())
                .postedDate(createdDate)
                .approved(approved)
                .voteCount(voteCount==null?0:voteCount)
                .build();
    }
}
