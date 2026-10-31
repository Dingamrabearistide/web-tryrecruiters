import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import {
  User as ModuleObject,
  ModuleUpdateDto as ModuleObjectUpdateDto,
} from "@modules/users/users.type";
import { TranslocoService } from "@ngneat/transloco";
import { UsersService as Service } from "@modules/users/users.service";
import { BaseUpdatePageComponent } from "../../../../../../../@1hand/pages/base-update-page/base-update-page.component";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-users-update-page",
  templateUrl: "./dashboard-admin-users-update-page.component.html",
  styleUrls: ["./dashboard-admin-users-update-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardAdminUsersUpdatePageComponent extends BaseUpdatePageComponent<
  ModuleObjectUpdateDto,
  ModuleObject
> {
  moduleName = "users";

  constructor(
    protected override service: Service,
    protected override dialog: MatDialog,
    protected override transloco: TranslocoService,
    protected override router: Router,
    protected override route: ActivatedRoute,
  ) {
    super(service, dialog, transloco, router, route);
  }

  override getItemIdParamName() {
    return "id";
  }

  /**
   * Crée un payload PATCH contenant uniquement les champs modifiés
   * Compare les données du formulaire avec l'objet original et ne retourne que les différences
   *
   * Champs gérés: firstName, lastName, email, phoneNumber, city, region, gender, birthDate,
   * photo, bio, profession, nationality, placeOfBirth
   */
  override buildPayload(formData: any): ModuleObjectUpdateDto {
    const payload: ModuleObjectUpdateDto = {};

    // Helper pour comparer les valeurs
    const hasChanged = (newVal: any, oldVal: any): boolean => {
      if (newVal === undefined || newVal === null) return false;
      if (newVal === oldVal) return false;
      // Pour les dates, comparer les strings
      if (newVal instanceof Date && oldVal instanceof Date) {
        return newVal.getTime() !== oldVal.getTime();
      }
      return true;
    };

    // Comparer chaque champ et ajouter à payload uniquement s'il a changé
    const fieldsToCheck: (keyof ModuleObject)[] = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "city",
      "region",
      "gender",
      "birthDate",
      "photo",
      "bio",
      "nationality",
      "notes",
      "role",
      "adminLevel",
      "adminPosition",
      "twoFactorEnabled",
    ];

    fieldsToCheck.forEach((field) => {
      if (hasChanged(formData[field], this.item[field])) {
        (payload as any)[field] = formData[field];
      }
    });

    // Retourner le payload PATCH (peut être vide si aucune modification)
    return payload;
  }

  override getItemLabel(item: ModuleObject): string {
    return item.firstName || item.email;
  }

  /**
   * Passer directement l'objet User au formulaire
   * Le formulaire utilise maintenant les mêmes noms de champs que le backend
   */
  getFormDefaultValues(): Partial<ModuleObject> {
    return this.item || {};
  }
}
