import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesEducationsListComponent } from './candidates-educations-list.component';

describe('CandidatesEducationsListComponent', () => {
  let component: CandidatesEducationsListComponent;
  let fixture: ComponentFixture<CandidatesEducationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesEducationsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesEducationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
