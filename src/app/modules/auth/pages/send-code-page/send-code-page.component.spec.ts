import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCodePageComponent } from './send-code-page.component';

describe('SendCodePageComponent', () => {
  let component: SendCodePageComponent;
  let fixture: ComponentFixture<SendCodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendCodePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
