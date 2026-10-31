import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOffersFormComponent } from './job-offers-form.component';

describe('JobOffersFormComponent', () => {
  let component: JobOffersFormComponent;
  let fixture: ComponentFixture<JobOffersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOffersFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobOffersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
