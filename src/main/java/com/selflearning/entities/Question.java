package com.selflearning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.selflearning.dtos.QuestionDto;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    @Column(name = "body",length = 512)
    private String body;

    private Date createdDate;

    private Integer voteCount = 0;
    private int viewCount = 0;

    @ElementCollection
    @CollectionTable(name = "question_tags", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "tag")
    @ToString.Exclude
    private List<String> tags = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    @ToString.Exclude
    private User user;


    @OneToMany(mappedBy = "question",cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<QuestionVote> questionVoteList;

    public QuestionDto getQuestionDto(){
       return QuestionDto.builder()
                .id(id)
                .body(body)
                .title(title)
                .tags(tags)
                .userId(user.getId())
               .userName(user.getName())
               .datePosted(createdDate)
               .voteCount(voteCount )
               .viewCount(viewCount)
                .build();
    }
}
