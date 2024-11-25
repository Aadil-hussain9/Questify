import { Routes } from '@angular/router';
import {LoginComponent} from './auth-components/login/login.component';
import {SignupComponent} from './auth-components/signup/signup.component';
import {NoAuthGuard} from './auth-gaurds/noAuth-gaurd/no-auth.guard';

  export const routes: Routes = [
    { path: '', redirectTo: '/user/dashboard', pathMatch: 'full' }, // Redirect to user module's dashboard
    { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuard] },
    { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
    { path: '**', redirectTo: '/login' }, // Fallback route
  ];


