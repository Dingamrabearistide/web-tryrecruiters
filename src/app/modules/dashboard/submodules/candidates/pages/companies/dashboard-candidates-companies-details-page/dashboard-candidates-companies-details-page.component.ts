import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CompaniesService } from "@modules/compagnies/companies.service";
import { Company as ModuleObject } from "@modules/compagnies/companies.types";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { JobOffer } from "@modules/job-offers/job-offers.types";
import { TranslocoService } from "@ngneat/transloco";
import { goToTop, wait } from "../../../../../../../@1hand/utils";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../../../../@1hand/components/generic-modal/generic-modal.component";
import { Location } from "@angular/common";

interface SocialLink {
  url: string;
  icon: string;
  color: string;
}

interface Contact {
  website: string;
  phone: string;
  email: string;
}

interface Employer {
  id: string;
  name: string;
  profileImage: string;
  industry: string;
  description: string;
  benefitsOverview: string;
  benefits: string[];
  vision: string;
  foundedDate: string;
  orgType: string;
  teamSize: string;
  industryTypes: string;
  contact: Contact;
  socialLinks: SocialLink[];
}

@Component({
  standalone: false,

  selector: "app-companies-details-page",
  templateUrl: "./dashboard-candidates-companies-details-page.component.html",
  styleUrls: ["./dashboard-candidates-companies-details-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardCandidatesCompaniesDetailsPageComponent implements OnInit {
  isLoading = false;
  hasError = false;
  errorMessage = "";

  employer: Employer | null = null;
  item!: ModuleObject;
  jobOffers: JobOffer[] = [];
  relatedCompanies: ModuleObject[] = [];

  page = 1;
  totalPages = 10;

  constructor(
    private route: ActivatedRoute,
    private companiesService: CompaniesService,
    private jobOffersService: JobOffersService,
    private transloco: TranslocoService,
    private dialog: MatDialog,
    private location: Location,
  ) {}

  handleBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      console.log("params", params);
      const id = params.get("companyId");

      if (id) {
        this.loadItem(id);
        this.loadJobs(id);
        this.loadRelatedCompanies();
      } else {
        console.error("Aucun ID fourni dans les paramètres de la route.");
      }
    });
  }

  loadItem(id: string) {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.companiesService.selectById(id).subscribe({
      next: async (res) => {
        await wait();
        console.log("company response: ", res);
        this.item = res;

        // Map company data to employer format for template compatibility
        // this.employer = {
        //   id: res.id,
        //   name: res.name,
        //   profileImage: res.logoUrl || "/images/enterprise.png",
        //   industry: res.industry,
        //   description: res.description || "No description available",
        //   benefitsOverview:
        //     "We offer comprehensive benefits to our employees including health insurance, retirement plans, and professional development opportunities.",
        //   benefits: [
        //     "Competitive salary and bonuses",
        //     "Comprehensive health insurance",
        //     "Flexible working hours and remote work options",
        //     "Professional development and training programs",
        //     "Retirement savings plan with company matching",
        //     "Paid time off and holidays",
        //   ],
        //   vision:
        //     "Our vision is to be a leading company in our industry, providing innovative solutions and creating value for our customers, employees, and stakeholders.",
        //   foundedDate: res.startDate
        //     ? new Date(res.startDate).getFullYear().toString()
        //     : "Not specified",
        //   orgType: res.organizationType || "Private Company",
        //   teamSize: res.companySize || "Not specified",
        //   industryTypes: res.industry,
        //   contact: {
        //     website: res.website || "Not available",
        //     phone: res.phoneNumber || "Not available",
        //     email: res.email || "Not available",
        //   },
        //   socialLinks: [
        //     { url: "#", icon: "fab fa-facebook-f", color: "#3b5998" },
        //     { url: "#", icon: "fab fa-twitter", color: "#1da1f2" },
        //     { url: "#", icon: "fab fa-linkedin-in", color: "#0077b5" },
        //     { url: "#", icon: "fab fa-instagram", color: "#e1306c" },
        //   ],
        // };

        this.isLoading = false;
        this.hasError = false;
        this.errorMessage = "";
      },
      error: (error) => {
        console.error("Erreur", error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.genericError");
      },
    });
  }

  loadJobs(companyId: string) {
    // Load jobs for this company
    this.jobOffersService
      .selectMany({ page: 1, limit: 3, companyId })
      .subscribe({
        next: async (res) => {
          await wait();
          console.log("jobs response: ", res);
          this.jobOffers = res.data;
        },
        error: (error) => {
          console.error("Erreur lors du chargement des emplois", error);
        },
      });
  }

  loadRelatedCompanies() {
    this.companiesService.selectMany({ page: 1, limit: 3 }).subscribe({
      next: async (res) => {
        await wait();
        console.log("related companies response: ", res);
        this.relatedCompanies = res.data;
      },
      error: (error) => {
        console.error(
          "Erreur lors du chargement des entreprises similaires",
          error,
        );
      },
    });
  }

  subscribe(): void {
    if (!this.item?.id) {
      return;
    }

    const modalData: GenericModalData = {
      title: this.transloco.translate("companies.companyDetails.followCompany"),
      content: this.transloco.translate(
        "companies.companyDetails.followCompanyConfirm",
        { name: this.item.name },
      ),
      actions: [
        {
          label: this.transloco.translate("companies.companyDetails.cancel"),
          value: false,
          color: undefined,
        },
        {
          label: this.transloco.translate("companies.companyDetails.confirm"),
          value: true,
          color: "primary",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "400px",
      data: modalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Simulate following company
        console.log("Entreprise suivie:", this.item.name);
        // Here you would call a service method to follow the company
        // this.companiesService.followCompany(this.item.id).subscribe(...)
      }
    });
  }

  share(platform: string): void {
    // Implement share logic
    console.log(`Share on ${platform}`);
    // Here you would implement actual sharing functionality
  }
}
