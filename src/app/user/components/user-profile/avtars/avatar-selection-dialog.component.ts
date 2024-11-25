import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-avatar-selection-dialog',
  standalone: true,
  templateUrl: './avatar-selection-dialog.component.html',
  styleUrls: ['./avatar-selection-dialog.component.css'],
  imports: [CommonModule, MatTabsModule, MatButtonModule, MatDialogContent, MatDialogActions, MatDialogClose],
})
export class AvatarSelectionDialogComponent implements OnInit {
  trendingAvatars: string[] = [];
  maleAvatars: string[] = [];
  femaleAvatars: string[] = [];
  funkyAvatars: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AvatarSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.generateAvatars();
  }

  generateAvatars() {
    // Generate Trending Avatars
    this.trendingAvatars = Array.from({ length: 8 }, (_, i) =>
      this.generateAvatarUrl(`Trending${i}`)
    );

    // Generate Male Avatars
    this.maleAvatars = Array.from({ length: 8 }, (_, i) =>
      this.generateAvatarUrl(`Male${i}`, { gender: 'male' })
    );

    // Generate Female Avatars
    this.femaleAvatars = Array.from({ length: 8 }, (_, i) =>
      this.generateAvatarUrl(`Female${i}`, { gender: 'female' })
    );

    // Generate Funky Avatars
    this.funkyAvatars = Array.from({ length: 8 }, (_, i) =>
      this.generateAvatarUrl(`Funky${i}`, { mood: 'happy' })
    );
  }

  generateAvatarUrl(seed: string, options: any = {}): string {
    const baseUrl = 'https://api.dicebear.com/7.x/avataaars/svg';
    const params = new URLSearchParams({
      seed,
      ...options,
    });
    return `${baseUrl}?${params.toString()}`;
  }

  selectAvatar(avatar: string) {
    this.dialogRef.close(avatar);
  }
  onCancel() {
    this.dialogRef.close();
  }
}
