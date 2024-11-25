import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLeaderboardComponent } from './users-leaderboard.component';

describe('UsersLeaderboardComponent', () => {
  let component: UsersLeaderboardComponent;
  let fixture: ComponentFixture<UsersLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersLeaderboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
