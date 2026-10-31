import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesApplyPageComponent } from './candidates-apply.page.component';

describe('CandidatesApplyPageComponent', () => {
  let component: CandidatesApplyPageComponent;
  let fixture: ComponentFixture<CandidatesApplyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesApplyPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesApplyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
