import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesExperiencesListComponent } from './candidates-experiences-list.component';

describe('CandidatesExperiencesListComponent', () => {
  let component: CandidatesExperiencesListComponent;
  let fixture: ComponentFixture<CandidatesExperiencesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesExperiencesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesExperiencesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
