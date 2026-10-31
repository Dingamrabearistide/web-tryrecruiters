import { Component, Input, OnInit } from "@angular/core";
import { Company } from "@modules/compagnies/companies.types";
import { JobOffer } from "@modules/job-offers/job-offers.types";

@Component({
  standalone: false,

  selector: "app-companies-details",
  templateUrl: "./companies-details.component.html",
  styleUrls: ["./companies-details.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CompaniesDetailsComponent implements OnInit {
  @Input() item!: Company;

  @Input() jobOffers: JobOffer[] = [];

  get employer() {
    return this.item?.createdBy;
  }

  ngOnInit(): void {
    console.log("Object: ", this.item);
  }
  getDescriptionText(): string {
    return this.item?.description || "";
  }
}
