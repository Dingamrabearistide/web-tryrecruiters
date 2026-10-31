import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateExperienceListItemComponent } from './candidate-experience-list-item.component';

describe('CandidateExperienceListItemComponent', () => {
  let component: CandidateExperienceListItemComponent;
  let fixture: ComponentFixture<CandidateExperienceListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateExperienceListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateExperienceListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
