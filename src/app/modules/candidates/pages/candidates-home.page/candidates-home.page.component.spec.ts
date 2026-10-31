import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesHomePageComponent } from './candidates-home.page.component';

describe('CandidatesHomePageComponent', () => {
  let component: CandidatesHomePageComponent;
  let fixture: ComponentFixture<CandidatesHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
