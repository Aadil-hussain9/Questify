import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {UserAuthGuard} from '../auth-gaurds/user-gaurd/user.guard';
import {PostQuestionComponent} from './components/post-question/post-question.component';
import {ViewQuestionComponent} from './components/view-question/view-question.component';
import {UserQuestionsComponent} from './components/user-questions/user-questions.component';
import {SearchQuestionComponent} from './components/search-question/search-question.component';

const routes: Routes = [
  {path:'dashboard', component:DashboardComponent, canActivate:[UserAuthGuard]},
  {path:'question', component:PostQuestionComponent, canActivate:[UserAuthGuard]},
  {path:'question/:questionId', component:ViewQuestionComponent, canActivate:[UserAuthGuard]},
  {path:'my-questions', component:UserQuestionsComponent, canActivate:[UserAuthGuard]},
  {path:'search-question', component:SearchQuestionComponent, canActivate:[UserAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
