import { GenericDatatableColumnDef } from "../../@1hand/components/generic-datatable/generic-datatable.component";
import { Company as ModuleObject } from "./companies.types";

export const DatatableColumns: GenericDatatableColumnDef<ModuleObject>[] = [
  { key: "name", label: "Nom de l’entreprise" },
  // { key: "industry", label: "Secteur d’activité" },
  // { key: "companySize", label: "Taille" },
  // { key: "organizationType", label: "Type d’organisation" },
  // { key: "startDate", label: "Année de création" },
  { key: "email", label: "Email" },
  { key: "phoneNumber", label: "Téléphone" },
  { key: "country", label: "Pays" },
  { key: "city", label: "Ville" },
  {
    label: "Site web",
    key: "website",
  },

  {
    label: "Actions",
    align: "center",
    canView: true,
    canEdit: true,
    canDelete: true,
  },
];
