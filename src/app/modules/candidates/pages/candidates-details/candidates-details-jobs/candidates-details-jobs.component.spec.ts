import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesDetailsJobsComponent } from './candidates-details-jobs.component';

describe('CandidatesDetailsJobsComponent', () => {
  let component: CandidatesDetailsJobsComponent;
  let fixture: ComponentFixture<CandidatesDetailsJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesDetailsJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesDetailsJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
