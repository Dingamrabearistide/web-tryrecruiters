import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCodeChannelComponent } from './send-code-channel.component';

describe('SendCodeChannelComponent', () => {
  let component: SendCodeChannelComponent;
  let fixture: ComponentFixture<SendCodeChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendCodeChannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendCodeChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
