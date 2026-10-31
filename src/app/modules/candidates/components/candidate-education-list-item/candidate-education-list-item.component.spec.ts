import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateEducationListItemComponent } from './candidate-education-list-item.component';

describe('CandidateEducationListItemComponent', () => {
  let component: CandidateEducationListItemComponent;
  let fixture: ComponentFixture<CandidateEducationListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateEducationListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateEducationListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
