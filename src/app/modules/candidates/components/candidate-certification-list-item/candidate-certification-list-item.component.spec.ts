import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CandidateCertificationListItemComponent } from "./candidate-certification-list-item.component";

describe("CandidateCertificationListItemComponent", () => {
  let component: CandidateCertificationListItemComponent;
  let fixture: ComponentFixture<CandidateCertificationListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateCertificationListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateCertificationListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
