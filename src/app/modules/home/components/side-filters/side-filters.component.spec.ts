import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideFiltersComponent } from './side-filters.component';

describe('SideFiltersComponent', () => {
  let component: SideFiltersComponent;
  let fixture: ComponentFixture<SideFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
