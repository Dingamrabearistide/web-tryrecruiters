import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  GenericDatatableColumnDef,
  GenericDatatableComponent,
} from "../../../../components/generic-datatable/generic-datatable.component";

@Component({
  selector: "app-status-badge",
  template: `<span
    [ngClass]="{
      'text-green-500': status === 'active',
      'text-red-500': status !== 'active'
    }"
  >
    ● {{ status }}
  </span>`,
  standalone: true,
  imports: [CommonModule],
})
class StatusBadgeComponent implements OnInit {
  @Input() status!: string;

  ngOnInit(): void {
    console.log("stauts", this.status);
  }
}

// Lab Component
@Component({
  selector: "app-generic-datatable-lab",
  standalone: true,
  imports: [CommonModule, GenericDatatableComponent],
  templateUrl: "./generic-datatable-lab.component.html",
  styleUrl: "./generic-datatable-lab.component.scss",
})
export class GenericDatatableLabComponent implements OnInit {
  @ViewChild("statusTemplate", { static: true })
  statusTemplate!: TemplateRef<any>;

  items = [
    {
      name: "OneHand LLC",
      email: "contact@onehand.com",
      phoneNumber: "+1 555 123 456",
      country: "USA",
      city: "New York",
      website: "https://onehand.com",
      status: "ACTIVE",
      jobStatus: "ACTIVE",
    },
    {
      name: "TryRecruiters Inc.",
      email: "hr@tryrecruiters.com",
      phoneNumber: "+33 1 23 45 67 89",
      country: "France",
      city: "Paris",
      website: "",
      status: "INACTIVE",
      jobStatus: "INACTIVE",
    },
    {
      name: "DevCorp",
      email: "contact@devcorp.com",
      phoneNumber: "+1 555 987 654",
      country: "Canada",
      city: "Toronto",
      website: "https://devcorp.com",
      status: "PENDING",
      jobStatus: "PENDING",
    },
  ];

  datatableColumns: GenericDatatableColumnDef[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.datatableColumns = [
      {
        key: "name",
        label: "Nom de l’entreprise",
        align: "left",
        width: "200px",
      },
      { key: "email", label: "Email", width: "200px" },
      { key: "phoneNumber", label: "Téléphone" },
      { key: "country", label: "Pays" },
      { key: "city", label: "Ville" },

      {
        label: "Site web",
        align: "left",
        renderValue: (row) => (row.website ? row.website : "—"),
      },

      {
        label: "Statut (Template)",
        align: "center",
        template: this.statusTemplate,
      },

      {
        label: "Statut (Composant)",
        render: StatusBadgeComponent,
        inputs: (row) => ({
          status: row.status,
        }),
        align: "center",
      },

      {
        label: "Statut Job (Badge)",
        type: "badge",
        align: "center",
        badgeConfig: (row) => ({
          status: row.jobStatus,
          showDot: true,
          defaultLabel: "Inconnu",
        }),
      },

      { label: "Actions", align: "center" },
    ];

    this.cdr.detectChanges();
  }

  handleCreate() {
    alert("create");
  }

  handleView(item: any) {
    alert("view");
    console.log(item);
  }

  handleUpdate(item: any) {
    alert("update");
    console.log(item);
  }

  handleDelete(item: any) {
    alert("delete");
    console.log(item);
  }
}
