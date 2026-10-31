import { Component, Input } from "@angular/core";
import { Permission } from "../../permissions.type";

@Component({
  standalone: false,

  selector: "app-permissions-detail",
  templateUrl: "./permissions-detail.component.html",
})
export class PermissionsDetailComponent {
  @Input() item: Permission | null = null;
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() errorMessage = "";

  constructor() {}

  getResourceBadgeConfig(resource: string) {
    const resourceConfig = {
      USERS: {
        label: "Utilisateurs",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        dotColor: "bg-blue-400",
      },
      CANDIDATES: {
        label: "Candidats",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        dotColor: "bg-green-400",
      },
      RECRUITERS: {
        label: "Recruteurs",
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        dotColor: "bg-purple-400",
      },
      COMPANIES: {
        label: "Entreprises",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        dotColor: "bg-orange-400",
      },
      JOB_OFFERS: {
        label: "Offres d'emploi",
        bgColor: "bg-indigo-100",
        textColor: "text-indigo-800",
        dotColor: "bg-indigo-400",
      },
      APPLICATIONS: {
        label: "Candidatures",
        bgColor: "bg-pink-100",
        textColor: "text-pink-800",
        dotColor: "bg-pink-400",
      },
      INTERVIEWS: {
        label: "Entretiens",
        bgColor: "bg-teal-100",
        textColor: "text-teal-800",
        dotColor: "bg-teal-400",
      },
      JOB_CATEGORIES: {
        label: "Catégories",
        bgColor: "bg-cyan-100",
        textColor: "text-cyan-800",
        dotColor: "bg-cyan-400",
      },
      PLATFORM_SETTINGS: {
        label: "Paramètres",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        dotColor: "bg-gray-400",
      },
      REPORTS: {
        label: "Rapports",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        dotColor: "bg-yellow-400",
      },
      LOGS: {
        label: "Journaux",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        dotColor: "bg-red-400",
      },
      FILES: {
        label: "Fichiers",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-800",
        dotColor: "bg-emerald-400",
      },
    };
    return (
      resourceConfig[resource as keyof typeof resourceConfig] || {
        label: resource,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        dotColor: "bg-gray-400",
      }
    );
  }

  getActionBadgeConfig(action: string) {
    const actionConfig = {
      CREATE: {
        label: "Créer",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        dotColor: "bg-green-400",
      },
      READ: {
        label: "Lire",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        dotColor: "bg-blue-400",
      },
      UPDATE: {
        label: "Modifier",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        dotColor: "bg-yellow-400",
      },
      DELETE: {
        label: "Supprimer",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        dotColor: "bg-red-400",
      },
      MANAGE: {
        label: "Gérer",
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        dotColor: "bg-purple-400",
      },
    };
    return (
      actionConfig[action as keyof typeof actionConfig] || {
        label: action,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        dotColor: "bg-gray-400",
      }
    );
  }
}
