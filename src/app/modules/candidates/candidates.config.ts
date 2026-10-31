import { GenericDatatableColumnDef } from "../../@1hand/components/generic-datatable/generic-datatable.component";
import { Candidate } from "./candidates.types";
import { TranslocoService } from "@ngneat/transloco";

export function getCandidateColumns(
  translocoService: TranslocoService,
): GenericDatatableColumnDef<Candidate>[] {
  return [
    {
      key: "firstName",
      label: translocoService.translate("candidates.datatable.fullName"),
      renderValue: (row) => (row ? `${row.firstName} ${row.lastName}` : "—"),
    },
    {
      key: "email",
      label: translocoService.translate("candidates.fields.email"),
      renderValue: (row) => row.email ?? "—",
    },
    {
      key: "profession",
      label: translocoService.translate("candidates.fields.profession"),
      renderValue: (row) => row.profession ?? "—",
    },
    {
      key: "nationality",
      label: translocoService.translate("candidates.fields.nationality"),
      renderValue: (row) => row.nationality ?? "—",
    },
    {
      key: "placeOfBirth",
      label: translocoService.translate("candidates.fields.placeOfBirth"),
      renderValue: (row) => row.placeOfBirth ?? "—",
    },
    {
      key: "phoneNumber",
      label: translocoService.translate("candidates.fields.phoneNumber"),
      renderValue: (row) => row.phoneNumber ?? "—",
      align: "center",
    },
    {
      key: "createdAt",
      label: translocoService.translate("candidates.fields.createdAt"),
      renderValue: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—",
      align: "center",
    },
    {
      label: translocoService.translate("candidates.datatable.actions"),
      align: "center",
      canView: true,
    },
  ];
}

// Fallback pour la compatibilité
export const candidateColumns: GenericDatatableColumnDef<Candidate>[] = [
  {
    key: "firstName",
    label: "Full Name",
    renderValue: (row) => (row ? `${row.firstName} ${row.lastName}` : "—"),
  },
  {
    key: "email",
    label: "Email",
    renderValue: (row) => row.email ?? "—",
  },
  {
    key: "profession",
    label: "Profession",
    renderValue: (row) => row.profession ?? "—",
  },
  {
    key: "nationality",
    label: "Nationality",
    renderValue: (row) => row.nationality ?? "—",
  },
  {
    key: "placeOfBirth",
    label: "Place of Birth",
    renderValue: (row) => row.placeOfBirth ?? "—",
  },
  {
    key: "phoneNumber",
    label: "Phone",
    renderValue: (row) => row.phoneNumber ?? "—",
    align: "center",
  },
  {
    key: "createdAt",
    label: "Registration Date",
    renderValue: (row) =>
      row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—",
    align: "center",
  },
  {
    label: "Actions",
    align: "center",
    canView: true,
  },
];
