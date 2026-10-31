import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NotificationsDropdownComponent } from "@modules/core/components/notifications-dropdown/notifications-dropdown.component";
import {
  AppModalComponent,
  SideFiltersComponent,
  TopFiltersComponent,
} from "@modules/home/components";
import { MultiSelectComboboxComponent } from "@modules/home/components/multi-select-combobox/multi-select-combobox.component";
import {
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoModule,
} from "@ngneat/transloco";
import { GenericDatatableComponent } from "../../@1hand/components/generic-datatable/generic-datatable.component";
import { GenericErrorComponent } from "../../@1hand/components/generic-error/generic-error.component";
import { GenericPaginatorComponent } from "../../@1hand/components/generic-paginator/generic-paginator.component";
import { SupportedLanguages } from "../../transloco-loader";
import { AvatarDropdownComponent } from "../core/components/avatar-dropdown/avatar-dropdown.component";
import { DashboardSidebarComponent } from "../dashboard/layout/dashboard-sidebar/dashboard-sidebar.component";
import { GenericModalComponent } from "../../@1hand/components/generic-modal/generic-modal.component";

import { LoaderComponent } from "@modules/core/components/loader.component";
import { MatDialogModule } from "@angular/material/dialog";
import { GenericFormComponent } from "../../@1hand/components/generic-form/generic-form.component";
import { GenericAutoCompleteComponent } from "../../@1hand/components/generic-autocomplete/generic-autocomplete.component";
import { GenericDeleteItemButtonComponent } from "../../@1hand/components/generic-delete-item-button/generic-delete-item-button.component";
import { GenericFileManagerComponent } from "../../@1hand/components/generic-file-manager/generic-file-manager.component";
import { ImagePreviewComponent } from "../../@1hand/components/image-preview/image-preview.component";
import { BackButtonComponent } from "../../@1hand/components/back-button/back-button.component";
import { DashboardHeaderComponent } from "../../@1hand/components/dashboard-header/dashboard-header.component";
import { GenericFileUploadButtonComponent } from "../../@1hand/components/generic-file-manager/generic-file-upload-button/generic-file-upload-button.component";
import { ApplicationsButtonComponent } from "@modules/applications/components/applications-button/applications-button.component";
import { StatusBadgeComponent } from "../../@1hand/components/status-badge/status-badge.component";
import { PageSkeletonLoaderComponent } from "../../@1hand/pages/page-skeleton-loader/page-skeleton-loader.component";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

const toExport = [
  DashboardSidebarComponent,
  ApplicationsButtonComponent,
  // Todo: Create a 1hand.module.ts
  GenericPaginatorComponent,

  SideFiltersComponent,
  TopFiltersComponent,
  AppModalComponent,
  GenericDeleteItemButtonComponent,
  MultiSelectComboboxComponent,
];

@NgModule({
  declarations: [...toExport],
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,

    AvatarDropdownComponent,
    NotificationsDropdownComponent,
    GenericFileUploadButtonComponent,

    LoaderComponent,
    ImagePreviewComponent,
    BackButtonComponent,

    GenericErrorComponent,
    GenericDatatableComponent,
    GenericModalComponent,
    GenericFormComponent,
    GenericAutoCompleteComponent,
    GenericFileManagerComponent,
    StatusBadgeComponent,

    PageSkeletonLoaderComponent,
    DashboardHeaderComponent,
  ],

  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "shared",
        loader,
      },
    },

    // {
    //   provide: TRANSLOCO_SCOPE,
    //   multi: true,
    //   useValue: {
    //     scope: "dashboard-employers",
    //     loader: DashboardEmployersLoader,
    //   },
    // },
  ],
  exports: [
    ...toExport,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatDialogModule,

    LoaderComponent,
    ImagePreviewComponent,
    BackButtonComponent,

    GenericFileUploadButtonComponent,

    GenericErrorComponent,
    GenericPaginatorComponent,
    GenericDatatableComponent,
    GenericModalComponent,
    GenericFormComponent,
    GenericAutoCompleteComponent,
    GenericFileManagerComponent,
    StatusBadgeComponent,
    PageSkeletonLoaderComponent,
    DashboardHeaderComponent,

    TopFiltersComponent,
    DashboardSidebarComponent,
    MultiSelectComboboxComponent,
  ],
})
export class SharedModule {}
