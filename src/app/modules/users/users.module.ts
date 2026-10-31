import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoDirective,
} from "@ngneat/transloco";

import { LoaderComponent } from "@modules/core/components/loader.component";
import { SharedModule } from "@modules/shared/shared.module";
import { GenericDatatableComponent } from "../../@1hand/components/generic-datatable/generic-datatable.component";
import { GenericFormComponent } from "../../@1hand/components/generic-form/generic-form.component";
import { GenericErrorComponent } from "../../@1hand/components/generic-error/generic-error.component";

import { UsersRouting } from "@modules/users/users.routing";
import { UsersDatatableComponent } from "@modules/users/components/users-datatable/users-datatable.component";
import { UsersFormComponent } from "@modules/users/components/users-form/users-form.component";
// import { DashbaordEmployersUsersListPageComponent } from "@modules/dashboard/submodules/employers/pages/users/dashbaord-employers-users-list-page/dashbaord-employers-users-list-page.component";
import { SupportedLanguages } from "../../transloco-loader";
// import { DashbaordEmployersUsersCreatePageComponent } from "@modules/dashboard/submodules/employers/pages/users/dashbaord-employers-users-create-page/dashbaord-employers-users-create-page.component";
// import { DashbaordEmployersUsersUpdatePageComponent } from "@modules/dashboard/submodules/employers/pages/users/dashbaord-employers-users-update-page/dashbaord-employers-users-update-page.component";
// import { UsersListPageComponent } from "@modules/home/pages";
// import { UsersGridItemComponent } from "./components/users-item-grid/users-grid-item.component";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce(
    (acc, lang) => {
      acc[lang] = () => import(`./i18n/${lang}.json`);
      return acc;
    },
    {} as Record<string, () => Promise<Translation>>,
  );

@NgModule({
  declarations: [
    UsersDatatableComponent,
    UsersFormComponent,
    // UsersListItemComponent,
    // UsersGridItemComponent,
    /*   DashbaordEmployersUsersUpdatePageComponent,
                           DashbaordEmployersUsersCreatePageComponent,
                           DashbaordEmployersUsersListPageComponent,*/
  ],
  imports: [
    CommonModule,

    //routing
    UsersRouting,

    // GenericDatatable
    GenericDatatableComponent,
    GenericFormComponent,
    TranslocoDirective,
    GenericErrorComponent,
    LoaderComponent,
    SharedModule,
  ],
  exports: [
    UsersDatatableComponent,
    UsersFormComponent,
    // UsersListItemComponent,
    // UsersGridItemComponent,
    /*    DashbaordEmployersUsersUpdatePageComponent,
     DashbaordEmployersUsersCreatePageComponent,
                                DashbaordEmployersUsersListPageComponent,*/
  ],

  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "users",
        loader,
      },
    },
  ],
})
export class UsersModule {}
