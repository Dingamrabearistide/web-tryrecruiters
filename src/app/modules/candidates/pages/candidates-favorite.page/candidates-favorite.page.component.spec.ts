import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesFavoritePageComponent } from './candidates-favorite.page.component';

describe('CandidatesFavoritePageComponent', () => {
  let component: CandidatesFavoritePageComponent;
  let fixture: ComponentFixture<CandidatesFavoritePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesFavoritePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesFavoritePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
