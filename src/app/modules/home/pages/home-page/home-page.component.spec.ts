import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";

import { HomePageComponent } from "./home-page.component";
import { FormBuilder } from "@angular/forms";

describe("HomePageComponent", () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  const mockAuthService = {
    getRole: () => "CANDIDATE",
    getUser: () => ({ candidate: { id: "candidate-1" } }),
  };

  const mockCandidatesService = {
    selectById: (_id: string) => of({ account: {} }),
  };

  const mockJobOffersService = {
    selectMany: () => of({ data: [] }),
  };

  const mockCompaniesService = {
    selectMany: () => of({ data: [] }),
  };

  const mockTransloco = {
    translate: (key: string, params?: any) => key,
  };

  const mockDialog = {
    open: () => ({
      componentInstance: { action: { subscribe: () => {} } },
      afterClosed: () => of(null),
    }),
  };

  const mockCandidates = mockCandidatesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePageComponent],
      providers: [
        { provide: "JobOffersService", useValue: mockJobOffersService },
        { provide: "CompaniesService", useValue: mockCompaniesService },
        { provide: "TranslocoService", useValue: mockTransloco },
        { provide: "CandidatesService", useValue: mockCandidatesService },
        { provide: "AuthService", useValue: mockAuthService },
        { provide: "MatDialog", useValue: mockDialog },
        { provide: FormBuilder, useValue: new FormBuilder() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
