import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsDetailsComponent } from './applications-details.component';

describe('ApplicationsDetailsComponent', () => {
  let component: ApplicationsDetailsComponent;
  let fixture: ComponentFixture<ApplicationsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
