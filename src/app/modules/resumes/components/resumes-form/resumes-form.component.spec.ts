import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumesFormComponent } from './resumes-form.component';

describe('ResumesFormComponent', () => {
  let component: ResumesFormComponent;
  let fixture: ComponentFixture<ResumesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
