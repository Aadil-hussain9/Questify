import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubmissionsComponent } from './user-submissions.component';

describe('UserSubmissionsComponent', () => {
  let component: UserSubmissionsComponent;
  let fixture: ComponentFixture<UserSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSubmissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
