import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesDocumentPageComponent } from './candidates-document.page.component';

describe('CandidatesDocumentPageComponent', () => {
  let component: CandidatesDocumentPageComponent;
  let fixture: ComponentFixture<CandidatesDocumentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesDocumentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesDocumentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
