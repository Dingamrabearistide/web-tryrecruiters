import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorPageComponent } from './two-factor-page.component';

describe('TwoFactorPageComponent', () => {
  let component: TwoFactorPageComponent;
  let fixture: ComponentFixture<TwoFactorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoFactorPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoFactorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
