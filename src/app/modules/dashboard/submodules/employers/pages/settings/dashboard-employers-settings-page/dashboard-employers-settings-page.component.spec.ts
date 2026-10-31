import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEmployersSettingsPageComponent } from './dashboard-employers-settings-page.component';

describe('DashboardEmployersSettingsPageComponent', () => {
  let component: DashboardEmployersSettingsPageComponent;
  let fixture: ComponentFixture<DashboardEmployersSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEmployersSettingsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEmployersSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
