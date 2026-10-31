import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TranslocoService } from "@ngneat/transloco";
import { BaseListDeletePageComponent } from "../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";
import { CandidatesService } from "../../candidates.service";
import { Candidate } from "../../candidates.types";

@Component({
  standalone: false,
  selector: "app-candidates-list-page",
  templateUrl: "./candidates-list-page.component.html",
  styleUrls: ["./candidates-list-page.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesListPageComponent extends BaseListDeletePageComponent<Candidate> {
  moduleName = "candidates";

  // Text filters
  searchTerm = "";
  profession = "";
  nationality = "";
  city = "";
  region = "";

  // Array filters
  skills: string[] = [""];
  languages: string[] = [""];
  tools: string[] = [""];

  // Select filters
  experienceLevel = "";
  gender = "";
  hasEducations = "";

  filtersExpanded = true;

  get activeFilterCount(): number {
    const activeSkills = this.skills.filter(s => !!s).length;
    const activeLangs = this.languages.filter(l => !!l).length;
    const activeTools = this.tools.filter(t => !!t).length;
    return [
      this.searchTerm, this.profession, this.nationality,
      this.city, this.region, this.experienceLevel, this.gender,
      this.hasEducations,
    ].filter(v => !!v).length + activeSkills + activeLangs + activeTools;
  }

  constructor(
    protected override service: CandidatesService,
    protected override route: ActivatedRoute,
    protected override router: Router,
    protected override transloco: TranslocoService,
    protected override dialog: MatDialog
  ) {
    super(service, route, router, transloco, dialog);
    this.limit = 12;
  }

  override ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.page = params["page"] ? +params["page"] : 1;
      this.limit = 12;
      this.onParamsInit(params);
      this.loadItems();
    });
  }

  protected onParamsInit(params: any): void {
    this.searchTerm = params["search"] || "";
    this.profession = params["profession"] || "";
    this.nationality = params["nationality"] || "";
    this.city = params["city"] || "";
    this.region = params["region"] || "";
    this.experienceLevel = params["experienceLevel"] || "";
    this.gender = params["gender"] || "";
    this.hasEducations = params["hasEducations"] || "";
  }

  protected getListParams(): any {
    const activeSkills = this.skills.filter(s => !!s);
    const activeLangs = this.languages.filter(l => !!l);
    const activeTools = this.tools.filter(t => !!t);

    const params: any = {
      page: this.page,
      limit: this.limit,
      keyword: this.searchTerm || undefined,
      profession: this.profession || undefined,
      nationality: this.nationality || undefined,
      city: this.city || undefined,
      region: this.region || undefined,
      experienceLevel: this.experienceLevel || undefined,
      gender: this.gender || undefined,
      hasEducations: this.hasEducations !== "" ? this.hasEducations : undefined,
    };

    if (activeSkills.length) params["skills"] = activeSkills;
    if (activeLangs.length) params["languages"] = activeLangs;
    if (activeTools.length) params["tools"] = activeTools;

    return params;
  }

  protected getDeleteTitle(_item: Candidate): string {
    return this.transloco.translate("candidates.delete.title");
  }

  protected getDeleteMessage(_item: Candidate): string {
    return this.transloco.translate("candidates.delete.message");
  }

  protected getItemId(item: Candidate): string {
    return item.id;
  }

  protected getItemLabel(item: Candidate): string {
    return item ? `${item.firstName} ${item.lastName}` : this.transloco.translate("candidates.title");
  }

  // Array helpers
  addSkill(): void { this.skills.push(""); }
  removeSkill(i: number): void { this.skills.splice(i, 1); if (!this.skills.length) this.skills = [""]; }

  addLanguage(): void { this.languages.push(""); }
  removeLanguage(i: number): void { this.languages.splice(i, 1); if (!this.languages.length) this.languages = [""]; }

  addTool(): void { this.tools.push(""); }
  removeTool(i: number): void { this.tools.splice(i, 1); if (!this.tools.length) this.tools = [""]; }

  onSearch(): void {
    this.page = 1;
    this.updateQueryParams();
    this.loadItems();
  }

  clearFilters(): void {
    this.searchTerm = "";
    this.profession = "";
    this.nationality = "";
    this.city = "";
    this.region = "";
    this.skills = [""];
    this.languages = [""];
    this.tools = [""];
    this.experienceLevel = "";
    this.gender = "";
    this.hasEducations = "";
    this.page = 1;
    this.updateQueryParams();
    this.loadItems();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.updateQueryParams();
    this.loadItems();
  }

  handleView(item: Candidate): void {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }

  handleUpdate(item: Candidate): void {
    this.router.navigate(["../edit", item.id], { relativeTo: this.route });
  }

  protected override updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        search: this.searchTerm || null,
        profession: this.profession || null,
        nationality: this.nationality || null,
        city: this.city || null,
        region: this.region || null,
        experienceLevel: this.experienceLevel || null,
        gender: this.gender || null,
        hasEducations: this.hasEducations || null,
      },
      queryParamsHandling: "merge",
    });
  }
}
