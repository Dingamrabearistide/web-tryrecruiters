import { GenericDatatableColumnDef } from "../../@1hand/components/generic-datatable/generic-datatable.component";
import {
  JobOffer as ModuleObject,
  JobStatus,
} from "@modules/job-offers/job-offers.types";

/** `expiresAt` is a calendar date picked via a date-only <input type="date">
 * (no time-of-day meaning), but the backend returns it as an ISO datetime
 * (midnight UTC). Formatting that with `toLocaleDateString()` converts to
 * the browser's local timezone first, which rolls it back a day for any
 * timezone behind UTC — reading the UTC date parts directly keeps the
 * calendar date the employer actually picked. */
function formatCalendarDate(isoString: string): string {
  const d = new Date(isoString);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()).toLocaleDateString();
}

export const jobOfferColumns: GenericDatatableColumnDef<ModuleObject>[] = [
  { key: "title", label: "joboffers.columns.title" },
  { key: "location", label: "joboffers.columns.location" },
  {
    label: "joboffers.columns.contractType",
    type: "badge",
    align: "center",
    badgeConfig: (row) => {
      const contractTypeConfig = {
        FULL_TIME: {
          label: "joboffers.contractTypes.FULL_TIME",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-400",
        },
        PART_TIME: {
          label: "joboffers.contractTypes.PART_TIME",
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          dotColor: "bg-purple-400",
        },
        TEMPORARY: {
          label: "joboffers.contractTypes.TEMPORARY",
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          dotColor: "bg-orange-400",
        },
        FREELANCE: {
          label: "joboffers.contractTypes.FREELANCE",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          dotColor: "bg-green-400",
        },
        INTERNSHIP: {
          label: "joboffers.contractTypes.INTERNSHIP",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          dotColor: "bg-yellow-400",
        },
        CONTRACT: {
          label: "joboffers.contractTypes.CONTRACT",
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-800",
          dotColor: "bg-indigo-400",
        },
      };
      return {
        status: row.contractType ?? "—",
        config: contractTypeConfig,
        showDot: true,
        defaultLabel: "—",
      };
    },
  },
  {
    label: "joboffers.columns.jobType",
    type: "badge",
    align: "center",
    badgeConfig: (row) => {
      const jobTypeConfig = {
        ONSITE: {
          label: "joboffers.jobTypes.ONSITE",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          dotColor: "bg-gray-400",
        },
        REMOTE: {
          label: "joboffers.jobTypes.REMOTE",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          dotColor: "bg-green-400",
        },
        HYBRID: {
          label: "joboffers.jobTypes.HYBRID",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-400",
        },
      };
      return {
        status: row.jobType ?? "—",
        config: jobTypeConfig,
        showDot: true,
        defaultLabel: "—",
      };
    },
  },
  {
    key: "salary",
    label: "joboffers.columns.salary",
    renderValue: (row) => String(row.salary) ?? "—",
    align: "center",
  },
  {
    key: "experienceYears",
    label: "joboffers.columns.experience",
    renderValue: (row) =>
      row.experienceYears != null ? `${row.experienceYears} ans` : "—",
    align: "center",
  },
  {
    label: "joboffers.columns.educationLevel",
    type: "badge",
    align: "center",
    badgeConfig: (row) => {
      const educationConfig = {
        HIGH_SCHOOL: {
          label: "joboffers.educationLevel.HIGH_SCHOOL",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          dotColor: "bg-yellow-400",
        },
        INTERMEDIATE: {
          label: "joboffers.educationLevel.INTERMEDIATE",
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          dotColor: "bg-orange-400",
        },
        GRADUATION: {
          label: "joboffers.educationLevel.GRADUATION",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-400",
        },
        BACHELOR_DEGREE: {
          label: "joboffers.educationLevel.BACHELOR_DEGREE",
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-800",
          dotColor: "bg-indigo-400",
        },
        MASTER_DEGREE: {
          label: "joboffers.educationLevel.MASTER_DEGREE",
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          dotColor: "bg-purple-400",
        },
      };
      return {
        status: row.educationLevel ?? "—",
        config: educationConfig,
        showDot: true,
        defaultLabel: "—",
      };
    },
  },
  {
    label: "joboffers.columns.jobLevel",
    type: "badge",
    align: "center",
    badgeConfig: (row) => {
      const jobLevelConfig = {
        ENTRY_LEVEL: {
          label: "joboffers.jobLevel.ENTRY_LEVEL",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          dotColor: "bg-green-400",
        },
        MID_LEVEL: {
          label: "joboffers.jobLevel.MID_LEVEL",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-400",
        },
        EXPERT_LEVEL: {
          label: "joboffers.jobLevel.EXPERT_LEVEL",
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          dotColor: "bg-purple-400",
        },
      };
      return {
        status: row.jobLevel ?? "—",
        config: jobLevelConfig,
        showDot: true,
        defaultLabel: "—",
      };
    },
  },
  {
    key: "createdAt",
    label: "joboffers.columns.publishedAt",
    renderValue: (row) =>
      row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—",
    align: "center",
  },
  {
    key: "expiresAt",
    label: "joboffers.columns.expiresAt",
    renderValue: (row) =>
      row.expiresAt ? formatCalendarDate(row.expiresAt) : "—",
    align: "center",
  },
  {
    label: "joboffers.columns.status",
    type: "badge",
    align: "center",
    badgeConfig: (row) => {
      let status = JobStatus.ACTIVE;

      if ((row as any).status) {
        status = (row as any).status;
      } else {
        if (row.deleted || row.archived) {
          status = JobStatus.INACTIVE;
        } else if (!row.isPublished) {
          status = JobStatus.PENDING;
        } else if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
          status = JobStatus.EXPIRED;
        }
      }

      return {
        status: status,
        showDot: true,
        defaultLabel: "—",
      };
    },
  },

  {
    label: "joboffers.columns.actions",
    align: "center",
    canView: true,
    canEdit: true,
    canDelete: true,
  },
];

// export const jobOfferDetailsApplicationColumns: GenericDatatableColumnDef<Application>[] =
//   [
//     {
//       key: "candidate",
//       label: "Candidat",
//       renderList: (row) => [
//         row.candidate
//           ? `${row.candidate.firstName} ${row.candidate.lastName}`
//           : "—",
//       ],
//     },

//     {
//       key: "status",
//       label: "Statut",
//       renderList: (row) => [row.status ?? "—"],
//       align: "center",
//     },
//     {
//       key: "submittedAt",
//       label: "Date de candidature",
//       renderList: (row) => [
//         row.submittedAt
//           ? new Date(row.submittedAt).toLocaleDateString()
//           : row.createdAt
//           ? new Date(row.createdAt).toLocaleDateString()
//           : "—",
//       ],
//       align: "center",
//     },
//     {
//       key: "resume",
//       label: "CV",
//       renderList: (row) => [row.resume?.url ?? "Aucun CV"],
//       align: "center",
//     },
//     {
//       key: "message",
//       label: "Message",
//       renderList: (row) => [
//         row.message
//           ? row.message.length > 50
//             ? `${row.message.substring(0, 50)}...`
//             : row.message
//           : "—",
//       ],
//     },
//     {
//       label: "Actions",
//       align: "center",
//       canView: true,
//     },
//   ];
