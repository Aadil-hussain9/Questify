import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AnswerService} from '../../user-services/answer-services/answer.service';
import {UserLeaderBoardResponse} from '../shared/dtos/leaderBoardResponse';
import {StorageService} from '../../../auth-services/storage-service/storage.service';
import {SpinnerService} from '../../user-services/shared-service/spinner-service.service';

@Component({
  selector: 'app-users-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users-leaderboard.component.html',
  styleUrl: './users-leaderboard.component.css'
})
export class UsersLeaderboardComponent implements OnInit,AfterViewInit{
  users: UserLeaderBoardResponse[] = [];
  currentUser: string = '';
  showScrollButton = false;

  constructor(private answerService :AnswerService,
              private storageService: StorageService,
              private spinnerService:SpinnerService) {}

  ngOnInit() {
    this.storageService.userName$.subscribe((name) => {
      this.currentUser = name || 'A';
      console.log("current ",this.currentUser);
    });
    this.spinnerService.showSpinner('Loading users...');
    this.answerService.getUserLeaderBoard().subscribe((response:any) =>{
      this.users = response;
    })
    this.users = USERS;
    console.log("users ",this.users)
    // this.userService.getLeaderboard()
    //   .subscribe(users => this.users = users);
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'text-yellow-500 font-bold';
    if (rank === 2) return 'text-gray-400 font-bold';
    if (rank === 3) return 'text-amber-600 font-bold';
    return 'text-gray-600';
  }

  getBadgeClass(rank: number): string {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return '';
  }

  getBadgeIcon(rank: number): string {
    return '👑';
  }

  getAvatarUrl(username: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
  }

  getReputationTrend(reputation: any): string {
    // This would normally be calculated based on historical data
    if(reputation>100){
      return '↑ 20%';
    }else if(reputation>40){
      return '↑ 10%';
    }else if(reputation>10){
      return '↑ 1%';
    }else if(reputation>0){
      return '↑ 0.1%';
    }
    return '↓ -1%';
  }

  getReputationTrendClass(userReputation: any): string {
    // This would normally be based on actual trend data
    if(userReputation>10){
      return 'text-green-600';
    }
    return 'text-red-600';
  }


  ngAfterViewInit(): void {
    debugger
    this.checkScrollPosition(); // Check scroll position after view is initialized
  }

  // Listen to the scroll event of the container directly
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    debugger
    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement;
    if (scrollContainer) {
      // Show the button when the container is scrolled more than 100px
      // this.showScrollButton = true;
      debugger
      this.showScrollButton = scrollContainer.scrollTop > 100;
    }
  }

  scrollToTop(): void {
    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement;
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getResponseRateColor(rate: number) {
    if (rate >= 80) return '#22c55e';
    if (rate >= 60) return '#eab308';
    return '#ef4444';
  }

  getReputationTrendIcon(trend: number): string {
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '→';
  }
}

// dummy-data.ts
// Dummy Comments
const COMMENTS: any = [
  { id: 'c1', content: "This is a helpful comment!", authorId: 'u2', createdAt: new Date('2023-05-12') },
  { id: 'c2', content: "Could you clarify your question?", authorId: 'u3', createdAt: new Date('2023-05-13') }
];

// Dummy Answers
const ANSWERS: any = [
  {
    id: 'a1',
    content: "Consider using lazy loading and optimizing change detection.",
    authorId: 'u2',
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2023-05-13'),
    votes: 15,
    isAccepted: true,
    comments: [COMMENTS[0]]
  },
  {
    id: 'a2',
    content: "Use ChangeDetectionStrategy.OnPush in your components.",
    authorId: 'u3',
    createdAt: new Date('2023-05-13'),
    updatedAt: new Date('2023-05-14'),
    votes: 8,
    isAccepted: false,
    comments: [COMMENTS[1]]
  }
];

// Dummy Questions
export const QUESTIONS: any = [
  {
    id: 'q1',
    title: "How to improve Angular application performance?",
    content: "I'm facing performance issues with a large Angular app. What are some recommended strategies?",
    tags: ['Angular', 'Performance', 'Optimization'],
    authorId: 'u1',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-12'),
    votes: 25,
    viewCount: 150,
    answers: [ANSWERS[0], ANSWERS[1]],
    accepted: true
  },
  {
    id: 'q2',
    title: "Difference between Promises and Observables in JavaScript?",
    content: "Could someone explain when to use Promises vs Observables in Angular?",
    tags: ['JavaScript', 'Observables', 'Promises'],
    authorId: 'u2',
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-02'),
    votes: 40,
    viewCount: 200,
    answers: [ANSWERS[0]],
    accepted: true
  } ,{
    id: 'q3',
    title: "Best practices for managing state in React?",
    content: "What are some recommended ways to manage state in large React applications?",
    tags: ['React', 'State Management'],
    authorId: 'u3',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-17'),
    votes: 30,
    viewCount: 180,
    answers: [ANSWERS[1], ANSWERS[2]],
    accepted: true
  },
  {
    id: 'q4',
    title: "How to optimize SQL queries?",
    content: "What are some tips for optimizing SQL queries in large databases?",
    tags: ['SQL', 'Database', 'Optimization'],
    authorId: 'u4',
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2023-06-12'),
    votes: 15,
    viewCount: 120,
    answers: [ANSWERS[2]],
    accepted: false
  },
  {
    id: 'q5',
    title: "Understanding Async/Await in JavaScript",
    content: "How does Async/Await differ from Promises, and when should I use it?",
    tags: ['JavaScript', 'Async/Await', 'Promises'],
    authorId: 'u5',
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2023-06-06'),
    votes: 50,
    viewCount: 300,
    answers: [ANSWERS[0]],
    accepted: true
  },
];

// Dummy Badges
const BADGES: any = [
  { id: 'b1', name: 'Helpful Answer', description: 'Awarded for an accepted answer with 10+ upvotes', type: 'gold' },
  { id: 'b2', name: 'First Question', description: 'Awarded for posting the first question', type: 'bronze' }
];

// Dummy User Stats
const USER_STATS: any = {
  questionsCount: 5,
  answersCount: 10,
  acceptedAnswers: 3,
  responseTimeAvg: 120 // in minutes
};

// Dummy Users
export const USERS: any = [
  {
    id: 'u1',
    username: 'JohnDoe',
    email: 'john@example.com',
    reputation: 1200,
    badges: [BADGES[0]],
    stats: USER_STATS,
    createdAt: new Date('2023-01-15')
  },
  {
    id: 'u2',
    username: 'JaneSmith',
    email: 'jane@example.com',
    reputation: 950,
    badges: [BADGES[1]],
    stats: { ...USER_STATS, questionsCount: 8 },
    createdAt: new Date('2023-02-20')
  },
  {
    id: 'u3',
    username: 'CodeGuru',
    email: 'guru@example.com',
    reputation: 1500,
    badges: [BADGES[0], BADGES[1]],
    stats: { ...USER_STATS, acceptedAnswers: 5 },
    createdAt: new Date('2023-03-10')
  }
];
