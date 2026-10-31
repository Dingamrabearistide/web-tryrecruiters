import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesExperiencesFormComponent } from './candidates-experiences-form.component';

describe('CandidatesExperiencesFormComponent', () => {
  let component: CandidatesExperiencesFormComponent;
  let fixture: ComponentFixture<CandidatesExperiencesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesExperiencesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesExperiencesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
