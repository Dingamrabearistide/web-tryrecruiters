import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewScheduleModalComponent } from './interview-schedule-modal.component';

describe('InterviewScheduleModalComponent', () => {
  let component: InterviewScheduleModalComponent;
  let fixture: ComponentFixture<InterviewScheduleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewScheduleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewScheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
