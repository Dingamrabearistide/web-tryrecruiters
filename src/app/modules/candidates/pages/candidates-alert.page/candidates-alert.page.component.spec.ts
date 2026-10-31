import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesAlertPageComponent } from './candidates-alert.page.component';

describe('CandidatesAlertPageComponent', () => {
  let component: CandidatesAlertPageComponent;
  let fixture: ComponentFixture<CandidatesAlertPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesAlertPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesAlertPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
