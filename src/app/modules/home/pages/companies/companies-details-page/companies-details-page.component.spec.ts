import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesDetailsPageComponent } from '../employers-details/employers-details.component';

describe('CompaniesDetailsPageComponent', () => {
  let component: CompaniesDetailsPageComponent;
  let fixture: ComponentFixture<CompaniesDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
