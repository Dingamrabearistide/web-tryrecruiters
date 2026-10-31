import { GenericDatatableColumnDef } from "../../@1hand/components/generic-datatable/generic-datatable.component";
import { Interview as ModuleObject, InterviewStatus, InterviewType } from "./interview.types";

export const interviewColumns: GenericDatatableColumnDef<ModuleObject>[] = [
  {
    key: "candidate",
    label: "list.columns.candidate",
    renderValue: (row) =>
      row.candidate
        ? `${row.candidate.firstName} ${row.candidate.lastName}`
        : "—",
  },
  {
    label: "list.columns.jobOffer",
    renderValue: (row) =>
      row.application ? `${row.application?.jobOffer?.title}` : "—",
  },
  {
    label: "list.columns.company",
    renderValue: (row) =>
      row.application ? `${row.application?.jobOffer?.company?.name}` : "—",
  },

  // {
  //   key: "recruiter",
  //   label: "Recruteur",
  //   renderList: (row) => [
  //     row.recruiter
  //       ? `${row.recruiter.firstName} ${row.recruiter.lastName}`
  //       : "—",
  //   ],
  // },
  {
    key: "scheduledAt",
    label: "list.columns.scheduledAt",
    renderValue: (row) =>
      row.scheduledAt
        ? new Date(row.scheduledAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—",

    align: "center",
  },
  {
    key: "durationMin",
    label: "list.columns.duration",
    renderValue: (row) => (row.durationMin ? `${row.durationMin} min` : "—"),
    align: "center",
  },
  {
    key: "type",
    label: "list.columns.type",
    renderValue: (row) => {
      const typeLabels: Record<string, string> = {
        [InterviewType.GOOGLE_MEET]: "form.type.options.googleMeet",
        [InterviewType.DAILY_VIDEO_CALL]: "form.type.options.dailyVideoCall",
        [InterviewType.IN_PERSON]: "form.type.options.inPerson",
      };
      return typeLabels[row.type as InterviewType] || row.type || "—";
    },
    align: "center",
  },
  {
    key: "status",
    label: "list.columns.status",
    type: "badge",
    align: "center",
    badgeConfig: (row) => {
      // badgeConfig (StatusBadgeComponent) actually runs its label through
      // transloco.translate() — the previous plain renderValue() just
      // interpolated the raw string, so these never translated at all; a
      // missing/mismatched key (RESCHEDULED was absent, CANCELED was
      // spelled CANCELLED in i18n) showed up as the literal untranslated
      // key text instead of silently looking "fine" in French.
      const statusConfig = {
        [InterviewStatus.SCHEDULED]: {
          label: "interviews.status.SCHEDULED",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-400",
        },
        [InterviewStatus.RESCHEDULED]: {
          label: "interviews.status.RESCHEDULED",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          dotColor: "bg-yellow-400",
        },
        [InterviewStatus.COMPLETED]: {
          label: "interviews.status.COMPLETED",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          dotColor: "bg-green-400",
        },
        [InterviewStatus.CANCELED]: {
          label: "interviews.status.CANCELED",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          dotColor: "bg-red-400",
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
  // {
  //   key: "timezone",
  //   label: "Fuseau horaire",
  //   renderList: (row) => [row.timezone ?? "—"],
  //   align: "center",
  // },
  {
    key: "meetUrl",
    label: "list.columns.meetUrl",
    renderValue: (row) => row.meetUrl || "—",
    linkLabel: "Join Meeting",
    align: "center",
  },
  // {
  //   key: "createdAt",
  //   label: "Créé le",
  //   renderList: (row) => [
  //     row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—",
  //   ],
  //   align: "center",
  // },
  {
    label: "list.columns.actions",
    align: "center",
    canView: true,
  },
];
