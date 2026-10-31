import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesListPageComponent } from '../candidates-list/candidates-list.component';

describe('CandidatesListPageComponent', () => {
  let component: CandidatesListPageComponent;
  let fixture: ComponentFixture<CandidatesListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
