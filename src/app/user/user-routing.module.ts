import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {UserAuthGuard} from '../auth-gaurds/user-gaurd/user.guard';
import {PostQuestionComponent} from './components/post-question/post-question.component';
import {ViewQuestionComponent} from './components/view-question/view-question.component';
import {UserQuestionsComponent} from './components/user-questions/user-questions.component';
import {SearchQuestionComponent} from './components/search-question/search-question.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import {UserSubmissionsComponent} from './components/user-profile/user-submissions/user-submissions.component';
import {UserAnalyticsComponent} from './components/user-profile/user-analytics/user-analytics.component';
import {UsersLeaderboardComponent} from './components/users-leaderboard/users-leaderboard.component';
import {UserChampionsComponent} from './components/user-champions/user-champions.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [UserAuthGuard],
    component: DashboardComponent, // If logged in, go to the dashboard
  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [UserAuthGuard] },
  { path: 'question', component: PostQuestionComponent, canActivate: [UserAuthGuard] },
  { path: 'question/:questionId', component: ViewQuestionComponent, canActivate: [UserAuthGuard] },
  { path: 'my-questions', component: UserQuestionsComponent, canActivate: [UserAuthGuard] },
  { path: 'search-question', component: SearchQuestionComponent, canActivate: [UserAuthGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [UserAuthGuard] },
  { path: 'submissions', component: UserSubmissionsComponent, canActivate: [UserAuthGuard] },
  { path: 'analytics', component: UserAnalyticsComponent, canActivate: [UserAuthGuard] },
  { path: 'leaderboard', component: UsersLeaderboardComponent, canActivate: [UserAuthGuard] },
  { path: 'champions', component: UserChampionsComponent, canActivate: [UserAuthGuard] },
  { path: '**', redirectTo: 'login' } // Redirect unmatched routes to login
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
