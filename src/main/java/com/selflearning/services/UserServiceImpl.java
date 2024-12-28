package com.selflearning.services;

import com.selflearning.dtos.*;
import com.selflearning.entities.Answer;
import com.selflearning.entities.SkillEntity;
import com.selflearning.entities.User;
import com.selflearning.entities.UserDetails;
import com.selflearning.repositories.AnswerRepository;
import com.selflearning.repositories.QuestionRepository;
import com.selflearning.repositories.UserDetailsRepository;
import com.selflearning.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final UserDetailsRepository userDetailsRepository;

    public UserServiceImpl(UserRepository userRepository, AnswerRepository answerRepository, QuestionRepository questionRepository, UserDetailsRepository userDetailsRepository){
        this.userRepository = userRepository;
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.userDetailsRepository = userDetailsRepository;
    }

    @Override
    public UserDto createUser(SignupDto signupDto) {

        User user = new User();
        user.setName(signupDto.getName());
        user.setEmail(signupDto.getEmail());
        //Use Password encoder to save it in encoded form as we defined in config
        user.setPassword(new BCryptPasswordEncoder().encode(signupDto.getPassword()));
       User savedUser = userRepository.save(user);

       UserDetails userDetails = dtoToEntity(signupDto);
       userDetails.setUser(user);
       userDetailsRepository.save(userDetails);

        return UserDto.builder()
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .build();
    }

    public static UserDetails dtoToEntity(SignupDto dto) {
        UserDetails userProfile = new UserDetails();
        userProfile.setPhotoAvtarUrl(dto.getPhotoUrl());
        userProfile.setDesignation(dto.getDesignation());
        userProfile.setLocation(dto.getLocation());
        userProfile.setBio(dto.getBio());
        userProfile.setSkills(
                dto.getSkills().stream()
                        .map(skill -> {
                            SkillEntity skillEntity = new SkillEntity();
                            skillEntity.setUserDetails(userProfile);
                            skillEntity.setName(skill.getName());
                            skillEntity.setProficiency(skill.getProficiency());
                            return skillEntity;
                        })
                        .collect(Collectors.toList())
        );
        return userProfile;
    }

    @Override
    public boolean hasUserWithEmail(String email) {
        return userRepository.findFirstByEmail(email).isPresent();
    }

    @Override
    public Optional<User> findUserByUserName(String email) {
        return userRepository.findFirstByEmail(email);
    }

//    @Override
//    public List<UserLeaderBoardResponse> getUserLeaderBoard() {
//        List<User> users = userRepository.findAll();
//        List<UserLeaderBoardResponse> userLeaderBoardResponses = new ArrayList<>();
//        if (!users.isEmpty()) {
//            users.forEach(user -> {
//               List<Answer> answerList =  answerRepository.findByUserId(user.getId());
//               Object[] QuestionResult = questionRepository.countTotalQuestionsAndQuestionVotesByUserId(user.getId());
//               UserLeaderBoardResponse response = new UserLeaderBoardResponse();
//               response.setUserName(user.getName());
//               int totalAnswersGiven = answerList.size();
//               response.setTotalAnswersGiven(totalAnswersGiven);
//               long totalApprovedAnswers = answerList.stream().filter(answer -> Boolean.TRUE.equals(answer.getApproved())).count();
//               response.setTotalApprovedAnswers(totalApprovedAnswers);
//               long totalQuestionsPosted = (((Object[]) QuestionResult[0])[0] != null ? (Long) ((Object[]) QuestionResult[0])[0] : 0L);
//               response.setTotalQuestionsPosted(totalQuestionsPosted);
//               int answerVoteCount = answerList.stream().mapToInt(Answer::getVoteCount).sum();
//
//                // Calculate Reputation
//                long reputation = (totalAnswersGiven * 10L) +  // 10 reputation per answer
//                        (totalApprovedAnswers * 20) + // 20 reputation for approved answers
//                        (answerVoteCount * 5L) + // 5 reputation per net vote on answers
//                        ((((Object[]) QuestionResult[0])[1] != null ? (Long) ((Object[]) QuestionResult[0])[1] : 0L) * 3L); // 3 reputation per net vote on questions
//
//                // Calculate Response Rate
//                long responseRate = (totalQuestionsPosted > 0)
//                        ? (totalAnswersGiven * 100L) / totalQuestionsPosted
//                        : 0;
//                response.setReputation(reputation);
//                response.setResponseRate(responseRate);
//                response.setMemberSince(Math.max(user.getCreatedYear(), 0));
//                userLeaderBoardResponses.add(response);
//            });
//            // Assign ranks based on sorted reputation
//            userLeaderBoardResponses.sort(Comparator.comparingLong(UserLeaderBoardResponse::getReputation).reversed());
//
//            for (int i = 0; i < userLeaderBoardResponses.size(); i++) {
//                UserLeaderBoardResponse userResponse = userLeaderBoardResponses.get(i);
//                userResponse.setRank(i + 1); // Rank starts from 1
//            }
//            return userLeaderBoardResponses;
//        }
//        return null;
//    }

    @Override
    public List<UserLeaderBoardResponse> getUserLeaderBoard() {
        List<User> users = userRepository.findAll();

        if (users.isEmpty()) {
            log.info("No users found for leaderboard calculation.");
            return Collections.emptyList();
        }

        log.info("Starting leaderboard calculation for {} users", users.size());
        Instant startTime = Instant.now();
        AtomicInteger processedCount = new AtomicInteger(0);

        // Process users in parallel
        List<UserLeaderBoardResponse> userLeaderBoardResponses = users.stream()
                .map(user -> processUserForLeaderboard(user, processedCount))
                .filter(Objects::nonNull) // Filter out any failed or null results
                .sorted(Comparator.comparingLong(UserLeaderBoardResponse::getReputation).reversed()) // Sort by reputation
                .collect(Collectors.toList());

        // Assign ranks after sorting
        for (int i = 0; i < userLeaderBoardResponses.size(); i++) {
            userLeaderBoardResponses.get(i).setRank(i + 1); // Rank starts from 1
        }

        log.info("Leaderboard calculation completed in {}ms for {} users",
                Instant.now().toEpochMilli() - startTime.toEpochMilli(),
                processedCount.get());

        return userLeaderBoardResponses;
    }

    @Override
    public UserProfileDto getUserDetails(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        UserDetails userDetails = userDetailsRepository.findByUserId(userId);

        if (user == null || userDetails == null) {
            return null;
        }

        return UserProfileDto.builder()
                .name(user.getName())
                .email(user.getEmail())
                .designation(userDetails.getDesignation())
                .location(userDetails.getLocation())
                .bio(userDetails.getBio())
                .photoUrl(userDetails.getPhotoAvtarUrl())
                .skills(mapToSkillsDto(userDetails.getSkills()))
                .build();
    }

    private static List<Skill> mapToSkillsDto(List<SkillEntity> skillEntityList) {
        return skillEntityList.stream()
                .map(skillEntity -> Skill.builder()
                        .name(skillEntity.getName())
                        .proficiency(skillEntity.getProficiency())
                        .build())
                .toList();
    }

    private UserLeaderBoardResponse processUserForLeaderboard(User user, AtomicInteger processedCount) {
        try {
            // Add context information to MDC
            MDC.put("userId", String.valueOf(user.getId()));
            MDC.put("userName", user.getName());
            if (user.getId() == 5L) {
                throw new RuntimeException("Simulated processing error for user with ID 5");
            }

            // Fetch data for the user
            List<Answer> answerList = answerRepository.findByUserId(user.getId());
            Object[] questionResult = questionRepository.countTotalQuestionsAndQuestionVotesByUserId(user.getId());

            // Create response object
            UserLeaderBoardResponse response = new UserLeaderBoardResponse();
            response.setUserName(user.getName());

            int totalAnswersGiven = answerList.size();
            response.setTotalAnswersGiven(totalAnswersGiven);

            long totalApprovedAnswers = answerList.stream()
                    .filter(answer -> Boolean.TRUE.equals(answer.getApproved()))
                    .count();
            response.setTotalApprovedAnswers(totalApprovedAnswers);

            long totalQuestionsPosted = ((Object[]) questionResult[0])[0] != null
                    ? (Long) ((Object[]) questionResult[0])[0]
                    : 0L;
            response.setTotalQuestionsPosted(totalQuestionsPosted);

            int answerVoteCount = answerList.stream().mapToInt(Answer::getVoteCount).sum();

            // Calculate reputation
            long reputation = (totalAnswersGiven * 10L) +
                    (totalApprovedAnswers * 20) +
                    (answerVoteCount * 5L) +
                    ((((Object[]) questionResult[0])[1] != null
                            ? (Long) ((Object[]) questionResult[0])[1]
                            : 0L) * 3L);
            response.setReputation(reputation);

            // Calculate response rate
            long responseRate = totalQuestionsPosted > 0
                    ? (totalAnswersGiven * 100L) / totalQuestionsPosted
                    : 0;
            response.setResponseRate(responseRate);

            // Set member since year
            response.setMemberSince(Math.max(user.getCreatedYear(), 0));

            // Increment processed count
            processedCount.incrementAndGet();

            log.info("Successfully processed user {}: reputation={}, responseRate={}",
                    user.getName(), reputation, responseRate);

            return response;

        } catch (Exception e) {
            log.error("Error processing user {}: {}", user.getId(), e.getMessage(), e);
            return null; // Return null for failed user processing
        } finally {
            MDC.clear(); // Clear MDC context
        }
    }


    // ScId -> uniqueNumber->end to end flow scId procesed , error , errorMessage , partComboLevel is
    //main focus scId->combo->parallel->combosProcessed->identify
    //logs way
    //UniqueIdentifier ->>Logging thread ->start to end of part combos
    //threads monitoring in AWS-Cloudwatch
    //all threads are executed successfully
}
