import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import {
  JobOffer as ModuleObject,
  JobStatus,
} from "@modules/job-offers/job-offers.types";
import { GenericDatatableColumnDef } from "../../../../@1hand/components/generic-datatable/generic-datatable.component";
import { jobOfferColumns as DatatableColumns } from "@modules/job-offers/job-offers.config";
import { AuthService } from "@modules/auth/auth.service";
import { Role } from "@modules/auth/auth.types";

@Component({
  standalone: false,

  selector: "app-job-offers-datatable",
  templateUrl: "./job-offers-datatable.component.html",
  styleUrls: [
    "./job-offers-datatable.component.scss",
    "../../../../../styles/legacy-styles.css",
  ],
})
export class JobOffersDatatableComponent implements OnInit {
  datatableColumns: GenericDatatableColumnDef<ModuleObject>[] = [];

  @Input() items: ModuleObject[] = [];
  @Input() errorMessage = "";
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() currentStatus: JobStatus = JobStatus.PENDING;
  @Input() processingJobIds: Set<string> = new Set();

  @Output("view") handleView$: EventEmitter<ModuleObject> = new EventEmitter();
  @Output("update") handleUpdate$: EventEmitter<ModuleObject> =
    new EventEmitter();
  @Output("delete") handleDelete$: EventEmitter<ModuleObject> =
    new EventEmitter();
  @Output("create") handleCreate$: EventEmitter<ModuleObject> =
    new EventEmitter();
  @Output("approve") handleApprove$: EventEmitter<ModuleObject> =
    new EventEmitter();
  @Output("reject") handleReject$: EventEmitter<ModuleObject> =
    new EventEmitter();
  @Output("revoke") handleRevoke$: EventEmitter<ModuleObject> =
    new EventEmitter();
  @Output("republish") handleRepublish$: EventEmitter<ModuleObject> =
    new EventEmitter();
  @Output("submit") handleSubmit$: EventEmitter<ModuleObject> =
    new EventEmitter();

  JobStatus = JobStatus;
  isAdmin = false;

  selectedItem = this.items[0];
  onItemSelected(item: ModuleObject) {
    console.log(item);
  }

  displayItemValue = (item: ModuleObject) => item.title;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Check if user is admin
    const userRole = this.authService.getRole();
    this.isAdmin =
      userRole === Role.PLATFORM_ADMIN || userRole === Role.SUPER_ADMIN;
    console.log(
      "JobOffersDatatable - User Role:",
      userRole,
      "Is Admin:",
      this.isAdmin,
    );

    this.datatableColumns = DatatableColumns;
    this.datatableColumns = this.datatableColumns.map((c) => {
      if (c.label === "joboffers.columns.actions") {
        return {
          ...c,
          canEdit: !this.isAdmin,
        };
      }
      return c;
    });
  }

  handleView(item: ModuleObject) {
    this.handleView$.emit(item);
  }

  handleUpdate(item: ModuleObject) {
    this.handleUpdate$.emit(item);
  }

  handleDelete(item: ModuleObject) {
    this.handleDelete$.emit(item);
  }

  handleCreate() {
    this.handleCreate$.emit();
  }

  handleApprove(item: ModuleObject) {
    this.handleApprove$.emit(item);
  }

  handleReject(item: ModuleObject) {
    this.handleReject$.emit(item);
  }

  handleRevoke(item: ModuleObject) {
    this.handleRevoke$.emit(item);
  }

  handleRepublish(item: ModuleObject) {
    this.handleRepublish$.emit(item);
  }

  handleSubmit(item: ModuleObject) {
    this.handleSubmit$.emit(item);
  }

  isProcessing(item: ModuleObject): boolean {
    return this.processingJobIds.has(item.id);
  }

  getStatusBadgeClass(status: JobStatus | undefined): string {
    if (status == undefined) {
      return "bg-gray-100 text-gray-800";
    }
    switch (status) {
      case JobStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case JobStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case JobStatus.INACTIVE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}
