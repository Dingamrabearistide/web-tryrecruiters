import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesDatatableComponent } from './companies-datatable.component';

describe('CompaniesDatatableComponent', () => {
  let component: CompaniesDatatableComponent;
  let fixture: ComponentFixture<CompaniesDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesDatatableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
