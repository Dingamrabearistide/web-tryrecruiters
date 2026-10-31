// import {
//   Component,
//   OnInit,
//   TemplateRef,
//   viewChild,
//   ViewChild,
// } from "@angular/core";
// import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
// import { MatDialog } from "@angular/material/dialog";
// import { ConfirmDialogComponent } from "@1hand/components/confirm-dialog.component";
// import { AppModalComponent } from "@1hand/components/app-modal/app-modal.component";
// // Interfaces

// interface PersonalInfo {
//   name: string;
//   title: string;
//   email: string;
//   phone: string;
//   address: string;
//   website?: string;
//   profile: string;
//   sexe: string;
// }

// interface Experience {
//   id?: number;
//   title: string;
//   company: string;
//   period: string;
//   location: string;
//   description: string;
// }

// interface Education {
//   id?: number;
//   degree: string;
//   school: string;
//   period: string;
//   location: string;
// }

// interface Skill {
//   id?: number;
//   name: string;
//   level: string;
// }

// interface Language {
//   id?: number;
//   name: string;
//   level: string;
// }

// interface Certification {
//   id?: number;
//   name: string;
//   issuer: string;
//   date: string;
// }

// @Component({
  standalone: false,

//   selector: "app-candidates-profile.page",
//   templateUrl: "./candidates-profile.page.component.html",
//   styleUrls: ["./candidates-profile.page.component.scss"],
// })
// export class CandidatesProfilePageComponent {
//   @ViewChild("callFormTemplate") callFormTemplate!: TemplateRef<any>;

//   profile = {
//     personalInfo: {
//       name: "John Doe",
//       title: "Software Engineer",
//       email: "john.doe@email.com",
//       phone: "+1 234 567 8900",
//       address: "New York, NY",
//       website: "johndoe.dev",
//       profile: "/images/profil.png",
//       sexe: "masculin",
//     },
//     experiences: [
//       {
//         id: 1,
//         title: "Senior Developer",
//         company: "Tech Corp",
//         period: "2020-2023",
//         location: "New York",
//         description:
//           "Led development of web applications using React and Node.js. Managed a team of 5 developers.",
//       },
//     ],
//     education: [
//       {
//         id: 1,
//         degree: "Master in Computer Science",
//         school: "University of Technology",
//         period: "2018-2020",
//         location: "Boston",
//       },
//     ],
//     skills: [
//       { id: 1, name: "JavaScript", level: "Expert" },
//       { id: 2, name: "Angular", level: "Advanced" },
//       { id: 3, name: "Node.js", level: "Advanced" },
//     ],
//     languages: [
//       { id: 1, name: "English", level: "Native" },
//       { id: 2, name: "French", level: "Fluent" },
//     ],
//     certifications: [
//       {
//         id: 1,
//         name: "AWS Certified Developer",
//         issuer: "Amazon",
//         date: "2023",
//       },
//     ],
//   };

//   constructor(private fb: FormBuilder, private dialog: MatDialog) {}

//   ngOnInit(): void {}

//   // Formulaires pour chaque section
//   createPersonalInfoForm(data?: PersonalInfo): FormGroup {
//     return this.fb.group({
//       name: [data?.name || "", [Validators.required]],
//       title: [data?.title || "", [Validators.required]],
//       email: [data?.email || "", [Validators.required, Validators.email]],
//       phone: [data?.phone || "", [Validators.required]],
//       address: [data?.address || "", [Validators.required]],
//       website: [data?.website || ""],
//     });
//   }

//   createExperienceForm(data?: Experience): FormGroup {
//     return this.fb.group({
//       title: [data?.title || "", [Validators.required]],
//       company: [data?.company || "", [Validators.required]],
//       period: [data?.period || "", [Validators.required]],
//       location: [data?.location || "", [Validators.required]],
//       description: [data?.description || "", [Validators.required]],
//     });
//   }

//   createEducationForm(data?: Education): FormGroup {
//     return this.fb.group({
//       degree: [data?.degree || "", [Validators.required]],
//       school: [data?.school || "", [Validators.required]],
//       period: [data?.period || "", [Validators.required]],
//       location: [data?.location || "", [Validators.required]],
//     });
//   }

//   createSkillForm(data?: Skill): FormGroup {
//     return this.fb.group({
//       name: [data?.name || "", [Validators.required]],
//       level: [data?.level || "Débutant", [Validators.required]],
//     });
//   }

//   createLanguageForm(data?: Language): FormGroup {
//     return this.fb.group({
//       name: [data?.name || "", [Validators.required]],
//       level: [data?.level || "Débutant", [Validators.required]],
//     });
//   }

//   createCertificationForm(data?: Certification): FormGroup {
//     return this.fb.group({
//       name: [data?.name || "", [Validators.required]],
//       issuer: [data?.issuer || "", [Validators.required]],
//       date: [data?.date || "", [Validators.required]],
//     });
//   }

//   // Méthodes pour ouvrir les modaux

//   editPersonalInfo(): void {
//     const formGroup = this.createPersonalInfoForm(this.profile.personalInfo);

//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Modifier les informations personnelles",
//         confirmText: "Enregistrer",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "medium",
//       },
//       autoFocus: false,
//       width: "600px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       if (formGroup.valid) {
//         this.profile.personalInfo = { ...formGroup.value };
//         console.log(
//           "Informations personnelles mises à jour:",
//           this.profile.personalInfo
//         );
//         dialogRef.close("confirmed");
//       }
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   addExperience(): void {
//     const formGroup = this.createExperienceForm();

//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Ajouter une expérience",
//         confirmText: "Ajouter",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "large",
//       },
//       autoFocus: false,
//       width: "700px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       if (formGroup.valid) {
//         const newExperience = {
//           ...formGroup.value,
//           id: Date.now(),
//         };
//         this.profile.experiences.push(newExperience);
//         console.log("Nouvelle expérience ajoutée:", newExperience);
//         dialogRef.close("confirmed");
//       }
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   editExperience(experience: Experience): void {
//     const formGroup = this.createExperienceForm(experience);

//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Modifier l'expérience",
//         confirmText: "Enregistrer",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "large",
//       },
//       autoFocus: false,
//       width: "700px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       if (formGroup.valid) {
//         const index = this.profile.experiences.findIndex(
//           (exp) => exp.id === experience.id
//         );
//         if (index !== -1) {
//           this.profile.experiences[index] = {
//             ...experience,
//             ...formGroup.value,
//           };
//           console.log("Expérience modifiée:", this.profile.experiences[index]);
//         }
//         dialogRef.close("confirmed");
//       }
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   deleteExperience(experience: Experience): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "confirm",
//         title: "Supprimer l'expérience",
//         message: `Êtes-vous sûr de vouloir supprimer l'expérience "${experience.title}" ?`,
//         confirmText: "Supprimer",
//         cancelText: "Annuler",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       this.profile.experiences = this.profile.experiences.filter(
//         (exp) => exp.id !== experience.id
//       );
//       console.log("Expérience supprimée:", experience);
//       dialogRef.close("confirmed");
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   addEducation(): void {
//     const formGroup = this.createEducationForm();

//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Ajouter une formation",
//         confirmText: "Ajouter",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "medium",
//       },
//       autoFocus: false,
//       width: "600px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       if (formGroup.valid) {
//         const newEducation = {
//           ...formGroup.value,
//           id: Date.now(),
//         };
//         this.profile.education.push(newEducation);
//         console.log("Nouvelle formation ajoutée:", newEducation);
//         dialogRef.close("confirmed");
//       }
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   editEducation(education: Education): void {
//     const formGroup = this.createEducationForm(education);

//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Modifier la formation",
//         confirmText: "Enregistrer",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "medium",
//       },
//       autoFocus: false,
//       width: "600px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       if (formGroup.valid) {
//         const index = this.profile.education.findIndex(
//           (edu) => edu.id === education.id
//         );
//         if (index !== -1) {
//           this.profile.education[index] = { ...education, ...formGroup.value };
//           console.log("Formation modifiée:", this.profile.education[index]);
//         }
//         dialogRef.close("confirmed");
//       }
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   deleteEducation(education: Education): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "confirm",
//         title: "Supprimer la formation",
//         message: `Êtes-vous sûr de vouloir supprimer la formation "${education.degree}" ?`,
//         confirmText: "Supprimer",
//         cancelText: "Annuler",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       this.profile.education = this.profile.education.filter(
//         (edu) => edu.id !== education.id
//       );
//       console.log("Formation supprimée:", education);
//       dialogRef.close("confirmed");
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   addSkill(): void {
//     const formGroup = this.createSkillForm();

//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Ajouter une compétence",
//         confirmText: "Ajouter",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "small",
//       },
//       autoFocus: false,
//       width: "400px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       if (formGroup.valid) {
//         const newSkill = {
//           ...formGroup.value,
//           id: Date.now(),
//         };
//         this.profile.skills.push(newSkill);
//         console.log("Nouvelle compétence ajoutée:", newSkill);
//         dialogRef.close("confirmed");
//       }
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   editSkill(skill: Skill): void {
//     const formGroup = this.createSkillForm(skill);

//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Modifier la compétence",
//         confirmText: "Enregistrer",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "small",
//       },
//       autoFocus: false,
//       width: "400px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       if (formGroup.valid) {
//         const index = this.profile.skills.findIndex((s) => s.id === skill.id);
//         if (index !== -1) {
//           this.profile.skills[index] = { ...skill, ...formGroup.value };
//           console.log("Compétence modifiée:", this.profile.skills[index]);
//         }
//         dialogRef.close("confirmed");
//       }
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   deleteSkill(skill: Skill): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "confirm",
//         title: "Supprimer la compétence",
//         message: `Êtes-vous sûr de vouloir supprimer la compétence "${skill.name}" ?`,
//         confirmText: "Supprimer",
//         cancelText: "Annuler",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       this.profile.skills = this.profile.skills.filter(
//         (s) => s.id !== skill.id
//       );
//       console.log("Compétence supprimée:", skill);
//       dialogRef.close("confirmed");
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   addLanguage(): void {
//     const formGroup = this.createLanguageForm();

//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Ajouter une langue",
//         confirmText: "Ajouter",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "small",
//       },
//       autoFocus: false,
//       width: "400px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       if (formGroup.valid) {
//         const newLanguage = {
//           ...formGroup.value,
//           id: Date.now(),
//         };
//         this.profile.languages.push(newLanguage);
//         console.log("Nouvelle langue ajoutée:", newLanguage);
//         dialogRef.close("confirmed");
//       }
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   editLanguage(language: Language): void {
//     const formGroup = this.createLanguageForm(language);

//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Modifier la langue",
//         confirmText: "Enregistrer",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "small",
//         contentTemplate: this.callFormTemplate,
//       },
//       autoFocus: false,
//       width: "400px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       if (formGroup.valid) {
//         const index = this.profile.languages.findIndex(
//           (l) => l.id === language.id
//         );
//         if (index !== -1) {
//           this.profile.languages[index] = { ...language, ...formGroup.value };
//           console.log("Langue modifiée:", this.profile.languages[index]);
//         }
//         dialogRef.close("confirmed");
//       }
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   deleteLanguage(language: Language): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "confirm",
//         title: "Supprimer la langue",
//         message: `Êtes-vous sûr de vouloir supprimer la langue "${language.name}" ?`,
//         confirmText: "Supprimer",
//         cancelText: "Annuler",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       this.profile.languages = this.profile.languages.filter(
//         (l) => l.id !== language.id
//       );
//       console.log("Langue supprimée:", language);
//       dialogRef.close("confirmed");
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   addCertification(): void {
//     const formGroup = this.createCertificationForm();

//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Ajouter une certification",
//         confirmText: "Ajouter",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "medium",
//       },
//       autoFocus: false,
//       width: "500px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       if (formGroup.valid) {
//         const newCertification = {
//           ...formGroup.value,
//           id: Date.now(),
//         };
//         this.profile.certifications.push(newCertification);
//         console.log("Nouvelle certification ajoutée:", newCertification);
//         dialogRef.close("confirmed");
//       }
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   editCertification(certification: Certification): void {
//     const formGroup = this.createCertificationForm(certification);

//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Modifier la certification",
//         confirmText: "Enregistrer",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "medium",
//       },
//       autoFocus: false,
//       width: "500px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       if (formGroup.valid) {
//         const index = this.profile.certifications.findIndex(
//           (c) => c.id === certification.id
//         );
//         if (index !== -1) {
//           this.profile.certifications[index] = {
//             ...certification,
//             ...formGroup.value,
//           };
//           console.log(
//             "Certification modifiée:",
//             this.profile.certifications[index]
//           );
//         }
//         dialogRef.close("confirmed");
//       }
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   deleteCertification(certification: Certification): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "confirm",
//         title: "Supprimer la certification",
//         message: `Êtes-vous sûr de vouloir supprimer la certification "${certification.name}" ?`,
//         confirmText: "Supprimer",
//         cancelText: "Annuler",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(() => {
//       this.profile.certifications = this.profile.certifications.filter(
//         (c) => c.id !== certification.id
//       );
//       console.log("Certification supprimée:", certification);
//       dialogRef.close("confirmed");
//     });

//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   getSkillLevelColor(level: string): string {
//     switch (level) {
//       case "Expert":
//         return "bg-green-500";
//       case "Advanced":
//         return "bg-blue-500";
//       case "Intermediate":
//         return "bg-yellow-500";
//       case "Débutant":
//         return "bg-gray-400";
//       default:
//         return "bg-gray-400";
//     }
//   }

//   getLanguageLevelColor(level: string): string {
//     switch (level) {
//       case "Native":
//         return "bg-green-500";
//       case "Fluent":
//         return "bg-blue-500";
//       case "Conversational":
//         return "bg-yellow-500";
//       case "Basic":
//         return "bg-gray-400";
//       default:
//         return "bg-gray-400";
//     }
//   }
// }
