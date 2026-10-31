import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { MatDialogModule } from "@angular/material/dialog";

import { PermissionsService } from "./permissions.service";
import { PermissionsDatatableComponent } from "./components/permissions-datatable/permissions-datatable.component";
import { PermissionsFormComponent } from "./components/permissions-form/permissions-form.component";
import { PermissionsDetailComponent } from "./components/permissions-detail/permissions-detail.component";

// Import des composants génériques
import { GenericDatatableComponent } from "../../@1hand/components/generic-datatable/generic-datatable.component";
import { SharedModule } from "@modules/shared/shared.module";
import { CoreModule } from "@modules/core/core.module";

@NgModule({
  declarations: [
    PermissionsDatatableComponent,
    PermissionsFormComponent,
    PermissionsDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslocoModule,
    MatDialogModule,
    CoreModule,
    SharedModule,
  ],
  providers: [PermissionsService],
  exports: [
    PermissionsDatatableComponent,
    PermissionsFormComponent,
    PermissionsDetailComponent,
  ],
})
export class PermissionsModule {}
