import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesDetailsPageComponent } from '../candidates-details/candidates-details.component';

describe('CandidatesDetailsPageComponent', () => {
  let component: CandidatesDetailsPageComponent;
  let fixture: ComponentFixture<CandidatesDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
