import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';  // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input';          // Import MatInputModule
import { MatButtonModule } from '@angular/material/button';       // Import MatButtonModule
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AvatarSelectionDialogComponent } from './avtars/avatar-selection-dialog.component';


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
export class UserProfileComponent {
  constructor(private dialog: MatDialog){}
  isEditing = false;

  profile = {
    photoUrl: '',
    name: 'Adil Hussain Dar',
    email: 'adil@example.com',
    designation: 'Software Engineer',
    location: 'Srinagar',
    skills: [
      { name: 'Angular', level: 3 },
      { name: 'TypeScript', level: 2 },
    ],
    bio: 'I am a passionate developer who loves coding and building scalable applications.',
  };

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.saveProfile();
    }
  }

  updatePhoto() {
    alert('Update photo clicked!');
  }

  addSkill() {
    this.profile.skills.push({ name: '', level: 1 });
  }

  removeSkill(index: number) {
    this.profile.skills.splice(index, 1);
  }

  saveProfile() {
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
}

}
