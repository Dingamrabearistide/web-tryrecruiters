import { GenericDatatableColumnDef } from "../../@1hand/components/generic-datatable/generic-datatable.component";
import { Permission, PermissionAction, ResourceType } from "./permissions.type";

export const permissionsColumns: GenericDatatableColumnDef<Permission>[] = [
  {
    key: "name",
    label: "permissions.table.name",
    renderValue: (row) => row.name,
  },
  {
    key: "description",
    label: "permissions.table.description",
    renderValue: (row) => row.description || "—",
  },
  {
    label: "permissions.table.resource",
    type: "badge",
    align: "center",
    badgeConfig: (row) => {
      const resourceConfig = {
        USERS: {
          label: "permissions.resources.USERS",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-400",
        },
        CANDIDATES: {
          label: "permissions.resources.CANDIDATES",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          dotColor: "bg-green-400",
        },
        RECRUITERS: {
          label: "permissions.resources.RECRUITERS",
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          dotColor: "bg-purple-400",
        },
        COMPANIES: {
          label: "permissions.resources.COMPANIES",
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          dotColor: "bg-orange-400",
        },
        JOB_OFFERS: {
          label: "permissions.resources.JOB_OFFERS",
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-800",
          dotColor: "bg-indigo-400",
        },
        APPLICATIONS: {
          label: "permissions.resources.APPLICATIONS",
          bgColor: "bg-pink-100",
          textColor: "text-pink-800",
          dotColor: "bg-pink-400",
        },
        INTERVIEWS: {
          label: "permissions.resources.INTERVIEWS",
          bgColor: "bg-teal-100",
          textColor: "text-teal-800",
          dotColor: "bg-teal-400",
        },
        JOB_CATEGORIES: {
          label: "permissions.resources.JOB_CATEGORIES",
          bgColor: "bg-cyan-100",
          textColor: "text-cyan-800",
          dotColor: "bg-cyan-400",
        },
        PLATFORM_SETTINGS: {
          label: "permissions.resources.PLATFORM_SETTINGS",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          dotColor: "bg-gray-400",
        },
        REPORTS: {
          label: "permissions.resources.REPORTS",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          dotColor: "bg-yellow-400",
        },
        LOGS: {
          label: "permissions.resources.LOGS",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          dotColor: "bg-red-400",
        },
        FILES: {
          label: "permissions.resources.FILES",
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-800",
          dotColor: "bg-emerald-400",
        },
      };
      return {
        status: row.resource ?? "—",
        config: resourceConfig,
        showDot: true,
        defaultLabel: "—",
      };
    },
  },
  {
    label: "permissions.table.action",
    type: "badge",
    align: "center",
    badgeConfig: (row) => {
      const actionConfig = {
        CREATE: {
          label: "permissions.actions.CREATE",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          dotColor: "bg-green-400",
        },
        READ: {
          label: "permissions.actions.READ",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-400",
        },
        UPDATE: {
          label: "permissions.actions.UPDATE",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          dotColor: "bg-yellow-400",
        },
        DELETE: {
          label: "permissions.actions.DELETE",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          dotColor: "bg-red-400",
        },
        MANAGE: {
          label: "permissions.actions.MANAGE",
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          dotColor: "bg-purple-400",
        },
      };
      return {
        status: row.action ?? "—",
        config: actionConfig,
        showDot: true,
        defaultLabel: "—",
      };
    },
  },
  {
    key: "createdAt",
    label: "permissions.table.createdAt",
    renderValue: (row) => new Date(row.createdAt).toLocaleDateString("fr-FR"),
  },
  {
    label: "permissions.table.actions",
    align: "center",
    canEdit: true,
    canDelete: true,
    canView: true,
  },
];
