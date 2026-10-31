import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOffersDatatableComponent } from './job-offers-datatable.component';

describe('JobOffersDatatableComponent', () => {
  let component: JobOffersDatatableComponent;
  let fixture: ComponentFixture<JobOffersDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOffersDatatableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobOffersDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
