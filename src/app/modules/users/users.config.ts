import { GenericDatatableColumnDef } from "../../@1hand/components/generic-datatable/generic-datatable.component";
import { User } from "@modules/users/users.type";

export const usersColumns: GenericDatatableColumnDef<User>[] = [
  {
    key: "name",
    label: "Nom",
    renderValue: (row) => row.firstName as string,
  },
  {
    key: "username",
    label: "Username",
    renderValue: (row) => row.lastName || "—",
  },
  {
    key: "email",
    label: "Email",
    renderValue: (row) => row.email,
  },
  {
    label: "Role",
    type: "badge",
    align: "center",
    badgeConfig: (row) => {
      const roleConfig = {
        ADMIN: {
          label: "Administrateur",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          dotColor: "bg-red-400",
        },
        RECRUITER: {
          label: "Recruteur",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-400",
        },
        CANDIDATE: {
          label: "Candidat",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          dotColor: "bg-green-400",
        },
        MODERATOR: {
          label: "Modérateur",
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          dotColor: "bg-purple-400",
        },
      };
      return {
        status: row.role ?? "—",
        config: roleConfig,
        showDot: true,
        defaultLabel: "—",
      };
    },
  },
  {
    label: "Gender",
    type: "badge",
    align: "center",
    badgeConfig: (row) => {
      const genderConfig = {
        MALE: {
          label: "Male",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-400",
        },
        FEMALE: {
          label: "Female",
          bgColor: "bg-pink-100",
          textColor: "text-pink-800",
          dotColor: "bg-pink-400",
        },
        OTHER: {
          label: "Other",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          dotColor: "bg-gray-400",
        },
      };
      return {
        status: row.gender ?? "—",
        config: genderConfig,
        showDot: true,
        defaultLabel: "—",
      };
    },
  },

  {
    label: "Actions",
    align: "center",
    canEdit: false,
    canDelete: true,
    canView: true,
  },
];
