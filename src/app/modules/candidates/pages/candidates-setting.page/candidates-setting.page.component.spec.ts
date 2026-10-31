import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesSettingPageComponent } from './candidates-setting.page.component';

describe('CandidatesSettingPageComponent', () => {
  let component: CandidatesSettingPageComponent;
  let fixture: ComponentFixture<CandidatesSettingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesSettingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesSettingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
