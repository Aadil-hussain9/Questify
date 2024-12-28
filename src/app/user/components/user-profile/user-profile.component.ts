import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';  // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input';          // Import MatInputModule
import { MatButtonModule } from '@angular/material/button';       // Import MatButtonModule
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AvatarSelectionDialogComponent } from './avtars/avatar-selection-dialog.component';
import { AnswerService } from '../../user-services/answer-services/answer.service';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatFormFieldModule,        // Import MatFormFieldModule
    MatInputModule,            // Import MatInputModule
    MatButtonModule,           // Import other Material modules you're using
    CommonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  constructor(private dialog: MatDialog,
              private answerService :AnswerService){}

  ngOnInit(): void {
        this.getUserProfileDetails();
    // this.profile.photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?{profile.photoUrl}`;
    }
  isEditing = false;
  Skills: Array<{ name: string; proficiency: number }> | any = [];

  profile:any = [];
  //   {
  //   photoUrl: '',
  //   name: 'Adil Hussain Dar',
  //   email: 'adil@example.com',
  //   designation: 'Software Engineer',
  //   location: 'Srinagar',
  //   skills: [
  //     { name: 'Angular', level: 3 },
  //     { name: 'TypeScript', level: 2 },
  //   ],
  //   bio: 'I am a passionate developer who loves coding and building scalable applications.',
  // };

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.saveProfile();
    }
  }
  
  addSkill() {
    this.Skills.push({ name: '', level: 1 });
  }

  removeSkill(index: number) {
    this.profile.skills.splice(index, 1);
  }

  saveProfile() {
    this.profile.skills = this.Skills;
    console.log('Profile saved:', this.profile);
  }

  openAvatarDialog() {
    if(this.isEditing){
    const dialogRef =
      this.dialog.open(AvatarSelectionDialogComponent, {
      width: '500px',
      data: { selectedAvatar: this.profile.photoUrl },
    });


    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.profile.photoUrl = result;
      }
    });
  }
    console.log("url ",this.profile.photoUrl);
}

 getUserProfileDetails(){
    this.answerService.getUserProfileDetails().subscribe((response:any) =>{
      this.profile = response;
    })
 }

  getProficiencyLabel(level: number): string {
    switch (level) {
      case 0:
        return 'Beginner';
      case 1:
        return 'Intermediate';
      case 2:
        return 'Advanced';
      default:
        return 'Unknown';
    }
  }
}
