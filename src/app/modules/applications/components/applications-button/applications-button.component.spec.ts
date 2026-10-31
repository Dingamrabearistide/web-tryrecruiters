import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsButtonComponent } from './applications-button.component';

describe('ApplicationsButtonComponent', () => {
  let component: ApplicationsButtonComponent;
  let fixture: ComponentFixture<ApplicationsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
