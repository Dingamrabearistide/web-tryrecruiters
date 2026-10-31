import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Candidate } from "@modules/candidates/candidates.types";

@Component({
  standalone: false,

  selector: "app-candidates-list",
  templateUrl: "./candidates-list.component.html",
  styleUrls: ["./candidates-list.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesListComponent {
  @ViewChild("itemDetails") itemDetailsTemplateRef!: TemplateRef<any>;

  @Input() items: Candidate[] = [];
  @Output() onView = new EventEmitter<Candidate>();
  @Output() onCall = new EventEmitter<Candidate>();

  candidate!: Candidate;

  // candidate: Candidate = {
  //   id: "cand-001",
  //   accountId: "acc-001",
  //   resumeUrl: "https://example.com/resumes/john-doe.pdf",
  //   bio: "Développeur full-stack passionné avec 5 ans d’expérience.",
  //   profession: "Développeur Web",
  //   placeOfBirth: "Douala",
  //   nationality: "Camerounaise",
  //   createdAt: "2024-01-15T10:30:00.000Z",
  //   updatedAt: "2025-07-20T15:45:00.000Z",
  //   deleted: false,
  //   archived: false,
  //   notes: "Candidat très motivé",

  //   account: {
  //     id: "acc-001",
  //     email: "john.doe@example.com",
  //     role: "CANDIDATE",
  //     firstName: "John",
  //     lastName: "Doe",
  //     phoneNumber: "+237690123456",
  //     gender: "MALE",
  //     photo: "https://example.com/photos/john.jpg",
  //     city: "Yaoundé",
  //     region: "Centre",
  //   },

  //   experiences: [
  //     {
  //       id: "exp-001",
  //       title: "Développeur Frontend",
  //       company: "TechCorp",
  //       location: "Douala",
  //       startDate: "2021-03-01",
  //       endDate: "2023-06-30",
  //       description: "Développement d’applications Angular pour clients B2B.",
  //       createdAt: "2021-03-01T08:00:00.000Z",
  //       updatedAt: "2023-06-30T17:00:00.000Z",
  //       deleted: false,
  //       archived: false,
  //       notes: "",
  //     },
  //   ],

  //   educations: [
  //     {
  //       id: "edu-001",
  //       schoolName: "Université de Douala",
  //       degree: "Licence",
  //       fieldOfStudy: "Informatique",
  //       startDate: "2016-10-01",
  //       endDate: "2019-07-01",
  //       description: "Formation en développement logiciel et architecture web.",
  //       createdAt: "2016-10-01T08:00:00.000Z",
  //       updatedAt: "2019-07-01T17:00:00.000Z",
  //       deleted: false,
  //       archived: false,
  //       notes: "",
  //     },
  //   ],

  //   skills: [
  //     {
  //       id: "skill-001",
  //       name: "JavaScript",
  //       level: SkillLevel.ADVANCED,
  //       createdAt: "2023-01-01T10:00:00.000Z",
  //       updatedAt: "2025-01-01T10:00:00.000Z",
  //       deleted: false,
  //       archived: false,
  //       notes: "",
  //     },
  //     {
  //       id: "skill-002",
  //       name: "NestJS",
  //       level: SkillLevel.INTERMEDIATE,
  //       createdAt: "2024-01-01T10:00:00.000Z",
  //       updatedAt: "2025-01-01T10:00:00.000Z",
  //       deleted: false,
  //       archived: false,
  //       notes: "",
  //     },
  //   ],

  //   languages: [
  //     {
  //       id: "lang-001",
  //       language: "Français",
  //       level: LanguageLevel.NATIVE,
  //       deleted: false,
  //       archived: false,
  //       notes: "",
  //     },
  //     {
  //       id: "lang-002",
  //       language: "Anglais",
  //       level: LanguageLevel.PROFESSIONAL,
  //       deleted: false,
  //       archived: false,
  //       notes: "",
  //     },
  //   ],

  //   tools: [
  //     {
  //       id: "tool-001",
  //       name: "Git",
  //       level: SkillLevel.ADVANCED,
  //       deleted: false,
  //       archived: false,
  //       notes: "",
  //     },
  //     {
  //       id: "tool-002",
  //       name: "Docker",
  //       level: SkillLevel.INTERMEDIATE,
  //       deleted: false,
  //       archived: false,
  //       notes: "",
  //     },
  //   ],

  //   resumes: [
  //     {
  //       id: "res-001",
  //       name: "CV Principal",
  //       url: "https://example.com/resumes/john-doe.pdf",
  //       isDefault: true,
  //       candidateId: "cand-001",
  //       createdAt: "2024-12-01T10:00:00.000Z",
  //       updatedAt: "2025-07-01T10:00:00.000Z",
  //       deleted: false,
  //       archived: false,
  //       notes: "",
  //     },
  //   ],

  //   applications: [
  //     {
  //       id: "app-001",
  //       message: "Je suis très intéressé par ce poste.",
  //       status: ApplicationStatus.PENDING,
  //       submittedAt: "2025-07-15T09:00:00.000Z",
  //       jobOfferId: "job-123",
  //       resumeId: "res-001",
  //       createdAt: "2025-07-15T09:00:00.000Z",
  //       updatedAt: "2025-07-15T09:00:00.000Z",
  //       deleted: false,
  //       archived: false,
  //       notes: "",
  //     },
  //   ],
  // };

  constructor(private dialog: MatDialog) {}

  call(item: Candidate) {
    this.onCall.emit(item);
  }

  view(item: Candidate) {
    console.log(item);
    this.onView.emit(item);

    // this.openModal(item);

    // const data: GenericModalData = {
    //   title: "Confirm Deletion",
    //   content: "Are you sure you want to delete this item?",
    //   actions: [
    //     { label: "Cancel", value: false },
    //     { label: "Delete", value: true, color: "warn" },
    //   ],
    // };

    // this.dialog
    //   .open(GenericModalComponent, {
    //     data,
    //     width: data.width || "400px",
    //   })
    //   .afterClosed()
    //   .subscribe((result) => {
    //     if (result) {
    //       // perform action
    //     }
    //   });
  }

  // openModal(item: Candidate) {
  //   this.dialog.open(GenericModalComponent, {
  //     data: {
  //       title: item.firstName,
  //       template: this.itemDetailsTemplateRef,
  //       actions: [{ label: "Fermer", value: "close", color: "primary" }],
  //     },
  //     width: "600px",
  //   });
  // }
}
