import { GenericDatatableColumnDef } from "../../@1hand/components/generic-datatable/generic-datatable.component";
import { humanSize } from "../../@1hand/utils";
import { Resume as ModuleObject } from "./resumes.types";

export const resumeColumns: GenericDatatableColumnDef<ModuleObject>[] = [
  {
    key: "name",
    label: "Nom du CV",
    renderValue: (row) => row.name || "—",
  },
  {
    key: "fileName",
    label: "Format",
    renderValue: (row) => row.resumeFile.mimetype || "—",
  },
  {
    key: "fileSize",
    label: "Taille",
    renderValue: (row) =>
      row.resumeFile.size ? `${humanSize(row.resumeFile.size)}` : "—",
  },
  {
    key: "isDefault",
    label: "CV par défaut",
    renderValue: (row) => (row.isDefault ? "Par défaut" : "Standard"),
    align: "center",
  },
  {
    key: "createdAt",
    label: "Date d'ajout",
    renderValue: (row) =>
      row.createdAt ? new Date(row.createdAt).toLocaleDateString("fr-FR") : "—",

    align: "center",
  },
  // {
  //   key: "updatedAt",
  //   label: "Dernière modification",
  //   renderList: (row) =>
  //     row.updatedAt ? new Date(row.updatedAt).toLocaleDateString("fr-FR") : "—",
  //   ,
  //   align: "center",
  // },
  {
    label: "Actions",
    align: "center",
    canView: true,
    canEdit: false,
    canDelete: true,
  },
];
