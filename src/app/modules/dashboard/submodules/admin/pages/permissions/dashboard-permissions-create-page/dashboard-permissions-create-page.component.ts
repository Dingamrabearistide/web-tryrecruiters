import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { PermissionsService as Service } from "@modules/permissions/permissions.service";
import {
  CreatePermissionDto as ModuleObjectCreateDto,
  Permission as ModuleObject,
  PermissionFormData as FormData,
} from "@modules/permissions/permissions.type";
import { TranslocoService } from "@ngneat/transloco";
import { BaseCreatePageComponent } from "../../../../../../../@1hand/pages/base-create-page/base-create-page.component";

@Component({
  standalone: false,

  selector: "app-dashboard-permissions-create-page",
  templateUrl: "./dashboard-permissions-create-page.component.html",
})
export class DashboardPermissionsCreatePageComponent
  extends BaseCreatePageComponent<ModuleObjectCreateDto, ModuleObject>
  implements OnInit
{
  moduleName = "permissions";

  constructor(
    protected override service: Service,
    protected override dialog: MatDialog,
    protected override transloco: TranslocoService,
    protected override router: Router,
    protected override route: ActivatedRoute
  ) {
    super(service, dialog, transloco, router, route);
  }

  override ngOnInit(): void {
    this.onInitParams();
  }

  override onInitParams(): void {
    // No special params needed for permissions
  }

  override buildPayload(formData: FormData): ModuleObjectCreateDto {
    return {
      name: formData.name,
      description: formData.description,
      resource: formData.resource,
      action: formData.action,
    };
  }

  override getItemLabel(item: ModuleObject): string {
    return item.name;
  }

  goBack(): void {
    this.router.navigate(["../list"], { relativeTo: this.route });
  }

  handleSubmit(formComponent: any): void {
    if (!formComponent.isFormValid()) {
      formComponent.markFormGroupTouched();
      return;
    }

    const formData = formComponent.getFormData();
    const payload = this.buildPayload(formData);
    this.handleCreate(payload);
  }
}
