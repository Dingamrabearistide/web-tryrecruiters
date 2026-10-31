// import { AppModalComponent } from "@1hand/components/app-modal/app-modal.component";
// import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
// import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms"; // Ensure FormArray is imported if used, though not directly used in these forms
// import { MatDialog } from "@angular/material/dialog";
// import { ActivatedRoute } from "@angular/router";
// // Assuming this path is correct

// // --- Interfaces ---
// // Re-aligned interfaces to match the candidate data structure in the component
// interface ContactInfo {
//   website: string;
//   location: string;
//   phone: string;
//   email: string;
// }

// interface Education {
//   id?: number; // Added for unique identification in lists
//   degree: string;
//   institution: string; // Changed from 'school' to 'institution' to match data
//   gpa?: string; // Optional GPA
//   location: string;
//   period: string;
//   details?: string[]; // Optional details for "Show More"
// }

// interface Experience {
//   id?: number; // Added for unique identification in lists
//   title: string;
//   location: string;
//   period: string;
//   description: string;
// }

// interface Skill {
//   id?: number; // Added for unique identification in lists
//   name: string;
//   level: string; // e.g., 'Advanced', 'Intermediate', 'Beginner'
// }

// interface Tool {
//   id?: number; // Added for unique identification in lists
//   name: string;
//   level: string; // e.g., 'Advanced', 'Intermediate', 'Beginner'
// }

// interface Language {
//   id?: number; // Added for unique identification in lists
//   name: string;
//   level: string; // e.g., 'Professional', 'Native', 'Fluent', 'Conversational', 'Basic'
// }

// interface CandidateProfile {
//   firstName: string;
//   lastName: string;
//   gender: string;
//   birthDate: string;
//   profession: string;
//   nationality: string;
//   placeOfBirth: string;
//   country: string;
//   region: string;
//   city: string;
//   biography: string;
//   education: Education[];
//   workExperience: Experience[]; // Changed from 'experiences' to 'workExperience'
//   skills: Skill[]; // Changed from string[] to Skill[]
//   tools: Tool[];
//   languages: Language[];
//   contact: ContactInfo;
//   // Assuming 'profile' (image path) is part of a separate ImageInfo or directly managed
//   // profile: string; // If you want to manage this via form, add it to PersonalInfoForm
// }

// @Component({
  standalone: false,

//   selector: "app-candidate-details",
//   templateUrl: "./candidates-details-jobs.component.html",
// })
// export class CandidatesDetailsJobsComponent implements OnInit {
//   candidateSlug: string | null = null;
//   isModalOpen: boolean = false;
//   showMoreStates: { [key: string]: boolean } = {}; // Gérer l'état "Show More" pour chaque section

//   @ViewChild("callFormTemplate", { static: true })
//   callFormTemplate!: TemplateRef<any>;

//   // Données simulées pour le candidat
//   candidate: CandidateProfile = {
//     firstName: "John",
//     lastName: "Doe",
//     gender: "Male",
//     birthDate: "1990-01-01",
//     profession: "Software Engineer",
//     nationality: "Cameroonian",
//     placeOfBirth: "Douala",
//     country: "Cameroon",
//     region: "Littoral",
//     city: "Douala",
//     biography: `I've been passionate about graphic design and digital art from an early age with a keen interest in Website and Mobile Application User Interfaces...`,
//     education: [
//       {
//         id: 1, // Added ID
//         degree: "Master in Biochemistry",
//         institution: "King Saud University",
//         gpa: "3.7/4.0",
//         location: "Saudi Arabia",
//         period: "Jan 2022 - Jan 2023",
//         details: [
//           "Completed advanced courses in molecular biology, genetics, and enzymology.",
//           "Participated in a year-long research project on enzyme kinetics.",
//           "Led a student group for biochemical lab safety awareness.",
//         ],
//       },
//       {
//         id: 2, // Added ID
//         degree: "Bachelor in Biochemistry",
//         institution: "King Saud University",
//         gpa: "3.7/4.0",
//         location: "Saudi Arabia",
//         period: "Jan 2018 - Dec 2021",
//         details: [
//           "Completed advanced courses in molecular biology, genetics, and enzymology.",
//           "Participated in a year-long research project on enzyme kinetics.",
//           "Led a student group for biochemical lab safety awareness.",
//         ],
//       },
//     ],
//     workExperience: [
//       {
//         id: 1, // Added ID
//         title: "Co-op Training",
//         location: "Saudi Arabia",
//         period: "Jan 2023 - Jan 2024",
//         description:
//           "Involved in various cybersecurity operations including threat monitoring, analysis, and reporting under real-world scenarios.",
//       },
//       {
//         id: 2, // Added ID
//         title: "Cyber Security Associate",
//         location: "Saudi Arabia",
//         period: "Aug 2023 - Jan 2024",
//         description:
//           "Involved in various cybersecurity operations including threat monitoring, analysis, and reporting under real-world scenarios.",
//       },
//       {
//         id: 3, // Added ID
//         title: "Cyber Security Intern",
//         location: "Saudi Arabia",
//         period: "Aug 2023 - Jan 2024",
//         description:
//           "Involved in various cybersecurity operations including threat monitoring, analysis, and reporting under real-world scenarios.",
//       },
//     ],
//     skills: [
//       { id: 1, name: "Graphics", level: "Advanced" }, // Changed to Skill object
//       { id: 2, name: "Team Player", level: "Intermediate" },
//       { id: 3, name: "Communication", level: "Advanced" },
//       { id: 4, name: "Critical Thinking", level: "Advanced" },
//       { id: 5, name: "Customer Service", level: "Intermediate" },
//       { id: 6, name: "Time Management", level: "Beginner" },
//     ],
//     tools: [
//       { id: 1, name: "ClickUp", level: "Advanced" },
//       { id: 2, name: "Jira", level: "Intermediate" },
//       { id: 3, name: "Notion", level: "Advanced" },
//       { id: 4, name: "Trello", level: "Beginner" },
//     ],
//     languages: [
//       { id: 1, name: "English", level: "Professional" },
//       { id: 2, name: "French", level: "Native" },
//     ],
//     contact: {
//       website: "www.estherhoward.com",
//       location: "Beverly hills california",
//       phone: "+1-202-555-0141",
//       email: "esther.com",
//     },
//   };

//   callFormGroup: FormGroup; // Renamed to avoid conflict with `formGroup` in AppModalComponent

//   constructor(
//     private route: ActivatedRoute,
//     private dialog: MatDialog,
//     private fb: FormBuilder
//   ) {
//     this.callFormGroup = this.fb.group({
//       email: ["", [Validators.required, Validators.email]],
//       meetLink: ["", Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     this.candidateSlug = this.route.snapshot.paramMap.get("slug");
//     console.log("Candidate Slug:", this.candidateSlug);
//     // In a real app, you would fetch candidate data based on the slug here
//     // For now, we use the simulated data.
//   }

//   // --- Form Creation Methods ---
//   createBiographyForm(data?: string): FormGroup {
//     return this.fb.group({
//       biography: [data || "", [Validators.required]],
//     });
//   }

//   createPersonalInfoForm(data: CandidateProfile): FormGroup {
//     return this.fb.group({
//       firstName: [data.firstName || "", [Validators.required]],
//       lastName: [data.lastName || "", [Validators.required]],
//       gender: [data.gender || "", [Validators.required]],
//       birthDate: [data.birthDate || "", [Validators.required]],
//       profession: [data.profession || "", [Validators.required]],
//       nationality: [data.nationality || "", [Validators.required]],
//       placeOfBirth: [data.placeOfBirth || "", [Validators.required]],
//       country: [data.country || "", [Validators.required]],
//       region: [data.region || "", [Validators.required]],
//       city: [data.city || "", [Validators.required]],
//     });
//   }

//   createContactInfoForm(data: ContactInfo): FormGroup {
//     return this.fb.group({
//       website: [data.website || "", [Validators.required]],
//       location: [data.location || "", [Validators.required]],
//       phone: [data.phone || "", [Validators.required]],
//       email: [data.email || "", [Validators.required, Validators.email]],
//     });
//   }

//   createExperienceForm(data?: Experience): FormGroup {
//     return this.fb.group({
//       title: [data?.title || "", [Validators.required]],
//       location: [data?.location || "", [Validators.required]],
//       period: [data?.period || "", [Validators.required]],
//       description: [data?.description || "", [Validators.required]],
//     });
//   }

//   createEducationForm(data?: Education): FormGroup {
//     return this.fb.group({
//       degree: [data?.degree || "", [Validators.required]],
//       institution: [data?.institution || "", [Validators.required]],
//       gpa: [data?.gpa || ""],
//       location: [data?.location || "", [Validators.required]],
//       period: [data?.period || "", [Validators.required]],
//       details: this.fb.array(
//         data?.details?.map((d) => this.fb.control(d)) || []
//       ), // For array of strings
//     });
//   }

//   createSkillForm(data?: Skill): FormGroup {
//     return this.fb.group({
//       name: [data?.name || "", [Validators.required]],
//       level: [data?.level || "Beginner", [Validators.required]], // Default level
//     });
//   }

//   createToolForm(data?: Tool): FormGroup {
//     return this.fb.group({
//       name: [data?.name || "", [Validators.required]],
//       level: [data?.level || "Beginner", [Validators.required]], // Default level
//     });
//   }

//   createLanguageForm(data?: Language): FormGroup {
//     return this.fb.group({
//       name: [data?.name || "", [Validators.required]],
//       level: [data?.level || "Basic", [Validators.required]], // Default level
//     });
//   }

//   // --- CRUD Methods ---

//   // Biography
//   editBiography(): void {
//     const formGroup = this.createBiographyForm(this.candidate.biography);
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Edit Biography",
//         confirmText: "Save",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "medium",
//         // You might need to provide a custom template for the form fields if AppModalComponent doesn't render them automatically from formGroup
//         // contentTemplate: this.biographyFormTemplate // if you define a template in HTML
//       },
//       autoFocus: false,
//       width: "600px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           this.candidate.biography = formGroup.value.biography;
//           console.log("Biography updated:", this.candidate.biography);
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   // Personal Information
//   editPersonalInfo(): void {
//     const formGroup = this.createPersonalInfoForm(this.candidate);
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Edit Personal Information",
//         confirmText: "Save",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "large",
//       },
//       autoFocus: false,
//       width: "700px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           // Update individual fields from the form group
//           this.candidate = { ...this.candidate, ...formGroup.value };
//           console.log("Personal Info updated:", this.candidate);
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   // Contact Information
//   editContactInfo(): void {
//     const formGroup = this.createContactInfoForm(this.candidate.contact);
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Edit Contact Information",
//         confirmText: "Save",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "medium",
//       },
//       autoFocus: false,
//       width: "600px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           this.candidate.contact = { ...formGroup.value };
//           console.log("Contact Info updated:", this.candidate.contact);
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   // Education
//   addEducation(): void {
//     const formGroup = this.createEducationForm();
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Add Education",
//         confirmText: "Add",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "large",
//       },
//       autoFocus: false,
//       width: "700px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           const newEducation: Education = {
//             ...formGroup.value,
//             id: Date.now(), // Assign a unique ID
//           };
//           this.candidate.education.push(newEducation);
//           console.log("New education added:", newEducation);
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   editEducation(education: Education): void {
//     const formGroup = this.createEducationForm(education);
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Edit Education",
//         confirmText: "Save",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "large",
//       },
//       autoFocus: false,
//       width: "700px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           const index = this.candidate.education.findIndex(
//             (edu) => edu.id === education.id
//           );
//           if (index !== -1) {
//             this.candidate.education[index] = {
//               ...education,
//               ...formGroup.value,
//             };
//             console.log("Education updated:", this.candidate.education[index]);
//           }
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   deleteEducation(education: Education): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "confirm",
//         title: "Delete Education",
//         message: `Are you sure you want to delete "${education.degree}"?`,
//         confirmText: "Delete",
//         cancelText: "Cancel",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         this.candidate.education = this.candidate.education.filter(
//           (edu) => edu.id !== education.id
//         );
//         console.log("Education deleted:", education);
//         dialogRef.close("confirmed");
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   // Work Experience
//   addExperience(): void {
//     const formGroup = this.createExperienceForm();
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Add Work Experience",
//         confirmText: "Add",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "large",
//       },
//       autoFocus: false,
//       width: "700px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           const newExperience: Experience = {
//             ...formGroup.value,
//             id: Date.now(),
//           };
//           this.candidate.workExperience.push(newExperience);
//           console.log("New experience added:", newExperience);
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   editExperience(experience: Experience): void {
//     const formGroup = this.createExperienceForm(experience);
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Edit Work Experience",
//         confirmText: "Save",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "large",
//       },
//       autoFocus: false,
//       width: "700px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           const index = this.candidate.workExperience.findIndex(
//             (exp) => exp.id === experience.id
//           );
//           if (index !== -1) {
//             this.candidate.workExperience[index] = {
//               ...experience,
//               ...formGroup.value,
//             };
//             console.log(
//               "Experience updated:",
//               this.candidate.workExperience[index]
//             );
//           }
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   deleteExperience(experience: Experience): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "confirm",
//         title: "Delete Experience",
//         message: `Are you sure you want to delete "${experience.title}"?`,
//         confirmText: "Delete",
//         cancelText: "Cancel",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         this.candidate.workExperience = this.candidate.workExperience.filter(
//           (exp) => exp.id !== experience.id
//         );
//         console.log("Experience deleted:", experience);
//         dialogRef.close("confirmed");
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   // Skills
//   addSkill(): void {
//     const formGroup = this.createSkillForm();
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Add Skill",
//         confirmText: "Add",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "small",
//       },
//       autoFocus: false,
//       width: "400px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           const newSkill: Skill = {
//             ...formGroup.value,
//             id: Date.now(),
//           };
//           this.candidate.skills.push(newSkill);
//           console.log("New skill added:", newSkill);
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   editSkill(skill: Skill): void {
//     const formGroup = this.createSkillForm(skill);
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Edit Skill",
//         confirmText: "Save",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "small",
//       },
//       autoFocus: false,
//       width: "400px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           const index = this.candidate.skills.findIndex(
//             (s) => s.id === skill.id
//           );
//           if (index !== -1) {
//             this.candidate.skills[index] = { ...skill, ...formGroup.value };
//             console.log("Skill updated:", this.candidate.skills[index]);
//           }
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   deleteSkill(skill: Skill): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "confirm",
//         title: "Delete Skill",
//         message: `Are you sure you want to delete "${skill.name}"?`,
//         confirmText: "Delete",
//         cancelText: "Cancel",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         this.candidate.skills = this.candidate.skills.filter(
//           (s) => s.id !== skill.id
//         );
//         console.log("Skill deleted:", skill);
//         dialogRef.close("confirmed");
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   // Tools
//   addTool(): void {
//     const formGroup = this.createToolForm();
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Add Tool",
//         confirmText: "Add",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "small",
//       },
//       autoFocus: false,
//       width: "400px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           const newTool: Tool = {
//             ...formGroup.value,
//             id: Date.now(),
//           };
//           this.candidate.tools.push(newTool);
//           console.log("New tool added:", newTool);
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   editTool(tool: Tool): void {
//     const formGroup = this.createToolForm(tool);
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Edit Tool",
//         confirmText: "Save",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "small",
//       },
//       autoFocus: false,
//       width: "400px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           const index = this.candidate.tools.findIndex((t) => t.id === tool.id);
//           if (index !== -1) {
//             this.candidate.tools[index] = { ...tool, ...formGroup.value };
//             console.log("Tool updated:", this.candidate.tools[index]);
//           }
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   deleteTool(tool: Tool): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "confirm",
//         title: "Delete Tool",
//         message: `Are you sure you want to delete "${tool.name}"?`,
//         confirmText: "Delete",
//         cancelText: "Cancel",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         this.candidate.tools = this.candidate.tools.filter(
//           (t) => t.id !== tool.id
//         );
//         console.log("Tool deleted:", tool);
//         dialogRef.close("confirmed");
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   // Languages
//   addLanguage(): void {
//     const formGroup = this.createLanguageForm();
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Add Language",
//         confirmText: "Add",
//         cancelText: "Annuler",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "small",
//       },
//       autoFocus: false,
//       width: "400px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           const newLanguage: Language = {
//             ...formGroup.value,
//             id: Date.now(),
//           };
//           this.candidate.languages.push(newLanguage);
//           console.log("New language added:", newLanguage);
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   editLanguage(language: Language): void {
//     const formGroup = this.createLanguageForm(language);
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "form",
//         title: "Edit Language",
//         confirmText: "Save",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: formGroup,
//         size: "small",
//       },
//       autoFocus: false,
//       width: "400px",
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         if (formGroup.valid) {
//           const index = this.candidate.languages.findIndex(
//             (l) => l.id === language.id
//           );
//           if (index !== -1) {
//             this.candidate.languages[index] = {
//               ...language,
//               ...formGroup.value,
//             };
//             console.log("Language updated:", this.candidate.languages[index]);
//           }
//           dialogRef.close("confirmed");
//         }
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   deleteLanguage(language: Language): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "confirm",
//         title: "Delete Language",
//         message: `Are you sure you want to delete "${language.name}"?`,
//         confirmText: "Delete",
//         cancelText: "Cancel",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });

//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       () => {
//         this.candidate.languages = this.candidate.languages.filter(
//           (l) => l.id !== language.id
//         );
//         console.log("Language deleted:", language);
//         dialogRef.close("confirmed");
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   // Photo Modal (basic implementation)
//   openPhotoModal(): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         type: "info", // Or 'custom' if you want a file upload form
//         title: "Change Profile Picture",
//         message:
//           "This feature would allow you to upload a new profile picture.",
//         confirmText: "OK",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });
//     // You would typically have a form here for file upload
//   }

//   // --- Helper Functions for UI ---
//   toggleDetails(id: string): void {
//     this.showMoreStates[id] = !this.showMoreStates[id];
//   }

//   // This method is already in the HTML, but its implementation was not provided in the TS
//   // It's used for the "Call" button at the top
//   openCallModal(): void {
//     const dialogRef = this.dialog.open(AppModalComponent, {
//       data: {
//         title: "Schedule a Call",
//         type: "form",
//         size: "small",
//         confirmText: "Confirm",
//         cancelText: "Cancel",
//         showCloseButton: true,
//         formGroup: this.callFormGroup,
//         contentTemplate: this.callFormTemplate,
//       },
//       autoFocus: false,
//     });
//     (dialogRef.componentInstance as AppModalComponent).confirmed.subscribe(
//       (formValue: any) => {
//         console.log("Call scheduled form submitted:", formValue);
//         dialogRef.close("confirmed");
//       }
//     );
//     (dialogRef.componentInstance as AppModalComponent).cancelled.subscribe(
//       () => {
//         dialogRef.close("cancelled");
//       }
//     );
//   }

//   downloadCV(): void {
//     console.log("Downloading CV");
//     // In a real application, this would trigger an actual file download
//     // window.open('/pdf/cv.pdf', '_blank'); // Example for a static file
//   }

//   getSkillLevelColor(level: string): string {
//     switch (level) {
//       case "Advanced":
//         return "bg-blue-100 text-[#1D9BED]"; // Matches image's blue for Advanced
//       case "Intermediate":
//         return "bg-yellow-100 text-yellow-800"; // Example for Intermediate
//       case "Beginner":
//         return "bg-gray-100 text-gray-600"; // Example for Beginner
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   }

//   getToolLevelColor(level: string): string {
//     switch (level) {
//       case "Advanced":
//         return "bg-blue-100 text-[#1D9BED]";
//       case "Intermediate":
//         return "bg-yellow-100 text-yellow-800";
//       case "Beginner":
//         return "bg-gray-100 text-gray-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   }

//   getLanguageLevelColor(level: string): string {
//     switch (level) {
//       case "Professional":
//         return "bg-green-100 text-green-800"; // Matches image's green for Professional
//       case "Native":
//         return "bg-blue-100 text-[#1D9BED]"; // Matches image's blue for Native
//       case "Fluent":
//         return "bg-blue-100 text-[#1D9BED]"; // Can be same as Native or different
//       case "Conversational":
//         return "bg-yellow-100 text-yellow-800";
//       case "Basic":
//         return "bg-gray-100 text-gray-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   }
// }
