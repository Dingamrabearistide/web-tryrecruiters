import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFinanceComponent } from './chart-finance.component';

describe('ChartFinanceComponent', () => {
  let component: ChartFinanceComponent;
  let fixture: ComponentFixture<ChartFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartFinanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
