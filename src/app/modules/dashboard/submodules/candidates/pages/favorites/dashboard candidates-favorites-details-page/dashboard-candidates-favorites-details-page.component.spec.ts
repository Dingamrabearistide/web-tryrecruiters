import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOffersDetailsPageComponent } from '../job-offers-details/job-offers-details.component';

describe('JobOffersDetailsPageComponent', () => {
  let component: JobOffersDetailsPageComponent;
  let fixture: ComponentFixture<JobOffersDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOffersDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobOffersDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
