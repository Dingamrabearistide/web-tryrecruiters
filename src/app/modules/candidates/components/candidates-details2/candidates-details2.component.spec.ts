import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesDetails2Component } from './candidates-details2.component';

describe('CandidatesDetails2Component', () => {
  let component: CandidatesDetails2Component;
  let fixture: ComponentFixture<CandidatesDetails2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesDetails2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesDetails2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
