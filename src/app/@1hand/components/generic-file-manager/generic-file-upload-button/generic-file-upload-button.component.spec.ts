import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFileUploadButtonComponent } from './generic-file-upload-button.component';

describe('GenericFileUploadButtonComponent', () => {
  let component: GenericFileUploadButtonComponent;
  let fixture: ComponentFixture<GenericFileUploadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericFileUploadButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericFileUploadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
