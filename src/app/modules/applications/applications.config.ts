import { GenericDatatableColumnDef } from "../../@1hand/components/generic-datatable/generic-datatable.component";
import { Application as ModuleObject } from "@modules/applications/applications.types";

export const applicationColumns: GenericDatatableColumnDef<ModuleObject>[] = [
  {
    key: "candidate",
    label: "applications.columns.candidate",
    renderValue: (row) =>
      row.candidate
        ? `${row.candidate.firstName} ${row.candidate.lastName}`
        : "—",
  },
  {
    key: "jobOffer",
    label: "applications.columns.jobOffer",
    renderValue: (row) => row.jobOffer?.title ?? "—",
  },
  {
    label: "applications.columns.company",
    renderValue: (row) => row.jobOffer?.company?.name ?? "—",
  },
  {
    key: "status",
    label: "applications.columns.status",
    type: "badge",
    align: "center",
    sortable: true,
    badgeConfig: (row) => {
      // Matches the real backend ApplicationStatusEnum
      // (PENDING, REVIEWED, ACCEPTED, REJECTED, CANCELED) — the previous
      // config used statuses (INTERVIEW, WITHDRAWN) that don't exist on
      // the backend and was missing REVIEWED entirely, so a reviewed
      // application silently showed a blank "—" badge instead of a label.
      // Labels are i18n keys (not raw French text) so switching the UI
      // language actually re-translates the badge instead of leaving it
      // permanently French regardless of the selected language.
      const statusConfig = {
        PENDING: {
          label: "applications.status.PENDING",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          dotColor: "bg-yellow-400",
        },
        REVIEWED: {
          label: "applications.status.REVIEWED",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-400",
        },
        ACCEPTED: {
          label: "applications.status.ACCEPTED",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          dotColor: "bg-green-400",
        },
        REJECTED: {
          label: "applications.status.REJECTED",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          dotColor: "bg-red-400",
        },
        CANCELED: {
          label: "applications.status.CANCELED",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          dotColor: "bg-gray-400",
        },
      };
      return {
        status: row.status ?? "—",
        config: statusConfig,
        showDot: true,
        defaultLabel: "—",
      };
    },
  },
  {
    key: "submittedAt",
    label: "applications.columns.submittedAt",
    renderValue: (row) =>
      row.submittedAt
        ? new Date(row.submittedAt).toLocaleDateString()
        : row.createdAt
        ? new Date(row.createdAt).toLocaleDateString()
        : "—",
    align: "center",
    sortable: true,
  },
  {
    key: "resume",
    label: "applications.columns.resume",
    renderValue: (row) => (row as any)?.candidate?.resumes[0]?.resumeFile?.filename ?? "Aucun CV",
    align: "center",
  },
  {
    key: "message",
    label: "applications.columns.message",
    renderValue: (row) =>
      row.message
        ? row.message.length > 50
          ? `${row.message.substring(0, 50)}...`
          : row.message
        : "—",
  },
  {
    label: "applications.columns.actions",
    align: "center",
    canView: true,
  },
];
