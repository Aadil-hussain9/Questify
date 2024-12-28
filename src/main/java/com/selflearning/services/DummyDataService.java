package com.selflearning.services;

import com.selflearning.entities.Answer;
import com.selflearning.entities.Question;
import com.selflearning.entities.User;
import com.selflearning.repositories.AnswerRepository;
import com.selflearning.repositories.QuestionRepository;
import com.selflearning.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.IntStream;

@Service
@Slf4j
@RequiredArgsConstructor
public class DummyDataService {

    private final Random random = new Random();
    private static final String[] ADJECTIVES = {
            "Mysterious", "Crazy", "Stealthy", "Silent", "Swift", "Dark",
            "Shadowy", "Clever", "Sly", "Witty", "Brave", "Evil", "Savage"
    };

    private static final String[] NOUNS = {
            "Hacker", "Joker", "Ninja", "Wizard", "Sniper", "Ghost",
            "Rogue", "Phantom", "Beast", "Shadow", "Hunter", "Warrior", "Rebel"
    };
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final PasswordEncoder passwordEncoder;

    public static String getRandomUserName() {
        Random random = new Random();
        String adjective = ADJECTIVES[random.nextInt(ADJECTIVES.length)];
        String noun = NOUNS[random.nextInt(NOUNS.length)];
        return adjective + " " + noun;
    }

    public List<User> generateDummyUsers(int count) {
        log.info("Generating {} dummy users", count);
        List<User> users = new ArrayList<>();

        IntStream.range(0, count).forEach(i -> {
            User user = new User();
            String name = getRandomUserName();
            user.setName(name);
            user.setEmail(name.replaceAll("\\s+", "").toLowerCase() + "@example.com");
            user.setPassword(new BCryptPasswordEncoder().encode("1234"));
            user.setCreatedDate(getRandomDate());
            users.add(user);

            log.debug("Generated user: {}", user.getName());
        });

        log.info("Generated {} users successfully", users.size());
        userRepository.saveAll(users);
        return users;
    }

    public List<Answer> generateDummyAnswers(int answersPerQuestion) {

        List<User> users = userRepository.findAll();
        List<Question> questions = questionRepository.findAll();
        log.info("Generating dummy answers for {} questions, {} answers per question", questions.size(), answersPerQuestion);
        List<Answer> answers = new ArrayList<>();

        questions.forEach(question -> {
            IntStream.range(0, answersPerQuestion).forEach(i -> {
                Answer answer = new Answer();
                answer.setBody("This is answer " + (i + 1) + " for question: " + question.getId() +
                        ". Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
                answer.setCreatedDate(getRandomDate());
                answer.setApproved(random.nextBoolean());
                answer.setVoteCount(random.nextInt(100));
                answer.setUser(users.get(random.nextInt(users.size())));
                answer.setQuestion(question);
                answers.add(answer);

                log.debug("Generated answer for question {}: {}", question.getId(), answer.getBody().substring(0, 20) + "...");
            });
        });

        log.info("Generated {} answers successfully", answers.size());
        answerRepository.saveAll(answers);
        return answers;
    }

    private Date getRandomDate() {
        LocalDateTime start = LocalDateTime.now().minusYears(2);
        LocalDateTime end = LocalDateTime.now();
        long startEpochDay = start.toLocalDate().toEpochDay();
        long endEpochDay = end.toLocalDate().toEpochDay();
        long randomDay = startEpochDay + random.nextInt((int) (endEpochDay - startEpochDay));

        return Date.from(LocalDateTime.now()
                .minusDays(random.nextInt(365 * 2))
                .minusHours(random.nextInt(24))
                .minusMinutes(random.nextInt(60))
                .atZone(ZoneId.systemDefault())
                .toInstant());
    }



    private static final List<String> SAMPLE_TAGS = Arrays.asList(
            "java", "spring", "hibernate", "javascript", "react", "angular",
            "python", "docker", "kubernetes", "aws", "microservices", "rest"
    );

    private static final String[] TITLE_PREFIXES = {
            "How to", "What is", "Best practices for", "Understanding",
            "Implementing", "Debugging", "Optimizing", "Working with"
    };

    public List<Question> generateDummyQuestions(int count) {
        List<User> users = userRepository.findAll();
        String batchId = UUID.randomUUID().toString();
        log.info("Starting to generate {} dummy questions with batch ID: {}", count, batchId);

        List<Question> questions = new ArrayList<>();
        AtomicInteger processedCount = new AtomicInteger(0);
        long startTime = System.currentTimeMillis();

        IntStream.range(0, count)
                .parallel()
                .forEach(i -> {
                    try {
                        MDC.put("questionId", String.valueOf(i));
                        MDC.put("batchId", batchId);

                        Question question = createQuestion(i, users);
                        questions.add(question);

                        int currentCount = processedCount.incrementAndGet();
                        long processingTime = System.currentTimeMillis() - startTime;

                        // Log specific milestones
                        if (currentCount == 1 || currentCount == 10 || currentCount == 11 ||
                                currentCount % 100 == 0 || currentCount == count) {

                            log.info("Generated question {}/{}: Title='{}', Tags={}, ProcessingTime={}ms",
                                    currentCount,
                                    count,
                                    question.getTitle(),
                                    question.getTags(),
                                    processingTime);
                        }

                        // Detailed debug logging for every question
                        log.debug("Generated question details: ID={}, Title='{}', Body length={}, Tags={}",
                                question.getId(),
                                question.getTitle(),
                                question.getBody().length(),
                                question.getTags());

                    } catch (Exception e) {
                        log.error("Error generating question {}: {}", i, e.getMessage(), e);
                    } finally {
                        MDC.clear();
                    }
                });

        long totalTime = System.currentTimeMillis() - startTime;
        log.info("Completed generating {} questions in {}ms. Batch ID: {}",
                questions.size(), totalTime, batchId);

        questionRepository.saveAll(questions);
        return questions;
    }

    private Question createQuestion(int index, List<User> users) {
        Question question = new Question();
        question.setId((long) index);
        question.setTitle(generateTitle());
        question.setBody(generateBody());
        question.setCreatedDate(generateRandomDate());
        question.setVoteCount(random.nextInt(100));
        question.setViewCount(random.nextInt(1000));
        question.setTags(generateRandomTags());
        question.setUser(users.get(random.nextInt(users.size())));
        question.setQuestionVoteList(new ArrayList<>());

        return question;
    }

    private String generateTitle() {
        String prefix = TITLE_PREFIXES[random.nextInt(TITLE_PREFIXES.length)];
        String tag = SAMPLE_TAGS.get(random.nextInt(SAMPLE_TAGS.size()));
        return prefix + " " + tag + " in " + generateContext();
    }

    private String generateBody() {
        StringBuilder body = new StringBuilder();
        body.append("I'm working on a project using ").append(SAMPLE_TAGS.get(random.nextInt(SAMPLE_TAGS.size())))
                .append(" and I've encountered the following situation:\n\n");

        // Add random paragraphs
        int paragraphs = 2 + random.nextInt(3);
        for (int i = 0; i < paragraphs; i++) {
            body.append(generateParagraph()).append("\n\n");
        }

        body.append("Has anyone encountered this before? Any help would be appreciated.");
        return body.toString();
    }

    private String generateParagraph() {
        String[] sentences = {
                "I've tried multiple approaches but none seem to work.",
                "The documentation isn't clear about this specific use case.",
                "I'm getting an unexpected error when running this code.",
                "The performance isn't what I expected it to be.",
                "I need to optimize this for production use.",
                "The current implementation feels wrong.",
                "I'm not sure if this is the best practice.",
                "The system behaves differently in different environments."
        };

        StringBuilder paragraph = new StringBuilder();
        int sentenceCount = 2 + random.nextInt(3);
        for (int i = 0; i < sentenceCount; i++) {
            paragraph.append(sentences[random.nextInt(sentences.length)]).append(" ");
        }
        return paragraph.toString().trim();
    }

    private String generateContext() {
        String[] contexts = {
                "production environment",
                "microservices architecture",
                "legacy system",
                "cloud infrastructure",
                "enterprise application",
                "distributed system",
                "containerized environment"
        };
        return contexts[random.nextInt(contexts.length)];
    }

    private List<String> generateRandomTags() {
        List<String> tags = new ArrayList<>();
        int tagCount = 2 + random.nextInt(3); // 2-4 tags per question

        while (tags.size() < tagCount) {
            String tag = SAMPLE_TAGS.get(random.nextInt(SAMPLE_TAGS.size()));
            if (!tags.contains(tag)) {
                tags.add(tag);
            }
        }

        return tags;
    }

    private Date generateRandomDate() {
        LocalDateTime start = LocalDateTime.now().minusYears(2);
        LocalDateTime end = LocalDateTime.now();
        long startEpochDay = start.toLocalDate().toEpochDay();
        long endEpochDay = end.toLocalDate().toEpochDay();
        long randomDay = startEpochDay + random.nextInt((int) (endEpochDay - startEpochDay));

        return Date.from(LocalDateTime.now()
                .minusDays(random.nextInt(365 * 2))
                .minusHours(random.nextInt(24))
                .minusMinutes(random.nextInt(60))
                .atZone(ZoneId.systemDefault())
                .toInstant());
    }
}
