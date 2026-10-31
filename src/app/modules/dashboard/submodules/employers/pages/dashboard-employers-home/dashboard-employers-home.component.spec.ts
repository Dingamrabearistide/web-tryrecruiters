import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEmployersHomeComponent } from './dashboard-employers-home.component';

describe('DashboardEmployersHomeComponent', () => {
  let component: DashboardEmployersHomeComponent;
  let fixture: ComponentFixture<DashboardEmployersHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEmployersHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEmployersHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
