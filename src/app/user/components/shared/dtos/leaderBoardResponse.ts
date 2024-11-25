export class UserLeaderBoardResponse {
  rank: number;
  userName: string;
  memberSince: number;
  reputation: number;
  totalAnswersGiven: number;
  totalApprovedAnswers: number;
  totalQuestionsPosted: number;
  responseRate: number;

  constructor(
    rank: number,
    userName: string,
    memberSince: number,
    reputation: number,
    totalAnswersGiven: number,
    totalApprovedAnswers: number,
    totalQuestionsPosted: number,
    responseRate: number
  ) {
    this.rank = rank;
    this.userName = userName;
    this.memberSince = memberSince;
    this.reputation = reputation;
    this.totalAnswersGiven = totalAnswersGiven;
    this.totalApprovedAnswers = totalApprovedAnswers;
    this.totalQuestionsPosted = totalQuestionsPosted;
    this.responseRate = responseRate;
  }
}
