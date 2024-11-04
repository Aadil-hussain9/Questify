import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {QuillModule} from 'ngx-quill';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatProgressSpinnerModule,
    QuillModule.forRoot()
  ]
})
export class UserModule { }
