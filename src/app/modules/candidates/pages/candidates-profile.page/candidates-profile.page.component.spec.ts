import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesProfilePageComponent } from './candidates-profile.page.component';

describe('CandidatesProfilePageComponent', () => {
  let component: CandidatesProfilePageComponent;
  let fixture: ComponentFixture<CandidatesProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesProfilePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
