// /**
//  * Configurations de formulaires génériques pour tous les éléments du profil
//  * Compatible avec le système de generic forms Angular
//  */

// import { ValidatorFn, Validators } from "@angular/forms";

// // Interface pour la configuration des champs
// // interface FieldConfig {
// //   name: string;
// //   label: string;
// //   placeholder: string;
// //   type: string;
// //   required?: boolean;
// //   multiline?: boolean;
// //   rows?: number;
// //   size: { xs: number; md?: number };
// //   validation?: ValidatorFn[];
// //   errorMessages: { [key: string]: string };
// //   options?: { value: any; label: string }[];
// // }

// /**
//  * Classe contenant toutes les configurations de formulaires pour le profil
//  */
// export class ProfileFormConfigurations {
//   /**
//    * Configuration du formulaire d'informations personnelles
//    */
//   static getPersonalInfoFormConfig(): FieldConfig[] {
//     return [
//       {
//         name: "name",
//         label: "form.personalInfo.name",
//         placeholder: "form.personalInfo.name.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(100),
//           Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.name.required",
//           minlength: "form.errors.fields.name.minlength",
//           maxlength: "form.errors.fields.name.maxlength",
//           pattern: "form.errors.fields.name.pattern",
//         },
//       },
//       {
//         name: "title",
//         label: "form.personalInfo.title",
//         placeholder: "form.personalInfo.title.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(100),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.title.required",
//           minlength: "form.errors.fields.title.minlength",
//           maxlength: "form.errors.fields.title.maxlength",
//         },
//       },
//       {
//         name: "email",
//         label: "form.personalInfo.email",
//         placeholder: "form.personalInfo.email.placeholder",
//         type: "email",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.required,
//           Validators.email,
//           Validators.maxLength(255),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.email.required",
//           email: "form.errors.fields.email.email",
//           maxlength: "form.errors.fields.email.maxlength",
//         },
//       },
//       {
//         name: "phone",
//         label: "form.personalInfo.phone",
//         placeholder: "form.personalInfo.phone.placeholder",
//         type: "tel",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.required,
//           Validators.pattern(/^\+?[\d\s\-\(\)]+$/),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.phone.required",
//           pattern: "form.errors.fields.phone.pattern",
//         },
//       },
//       {
//         name: "address",
//         label: "form.personalInfo.address",
//         placeholder: "form.personalInfo.address.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12 },
//         validation: [Validators.required, Validators.maxLength(255)],
//         errorMessages: {
//           required: "form.errors.fields.address.required",
//           maxlength: "form.errors.fields.address.maxlength",
//         },
//       },
//       {
//         name: "website",
//         label: "form.personalInfo.website",
//         placeholder: "form.personalInfo.website.placeholder",
//         type: "url",
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.pattern(/^https?:\/\/[\w\-\.]+\.\w{2,}(\/\S*)?$/),
//         ],
//         errorMessages: {
//           pattern: "form.errors.fields.website.pattern",
//         },
//       },
//       {
//         name: "sexe",
//         label: "form.personalInfo.gender",
//         placeholder: "form.personalInfo.gender.placeholder",
//         type: "select",
//         size: { xs: 12, md: 6 },
//         validation: [],
//         options: [
//           { value: "masculin", label: "form.gender.male" },
//           { value: "féminin", label: "form.gender.female" },
//           { value: "non binaire", label: "form.gender.nonbinary" },
//           { value: "non spécifié", label: "form.gender.notspecified" },
//         ],
//         errorMessages: {},
//       },
//     ];
//   }

//   /**
//    * Configuration du formulaire d'expérience professionnelle
//    */
//   static getExperienceFormConfig(): FieldConfig[] {
//     return [
//       {
//         name: "title",
//         label: "form.experience.title",
//         placeholder: "form.experience.title.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(100),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.title.required",
//           minlength: "form.errors.fields.title.minlength",
//           maxlength: "form.errors.fields.title.maxlength",
//         },
//       },
//       {
//         name: "company",
//         label: "form.experience.company",
//         placeholder: "form.experience.company.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(100),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.company.required",
//           minlength: "form.errors.fields.company.minlength",
//           maxlength: "form.errors.fields.company.maxlength",
//         },
//       },
//       {
//         name: "location",
//         label: "form.experience.location",
//         placeholder: "form.experience.location.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [Validators.required, Validators.maxLength(100)],
//         errorMessages: {
//           required: "form.errors.fields.location.required",
//           maxlength: "form.errors.fields.location.maxlength",
//         },
//       },
//       {
//         name: "period",
//         label: "form.experience.period",
//         placeholder: "form.experience.period.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.required,
//           Validators.pattern(
//             /^\d{4}(-\d{4}|\s*-\s*(Présent|présent|Present|present|Actuel|actuel|En cours|en cours))?$/
//           ),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.period.required",
//           pattern: "form.errors.fields.period.pattern",
//         },
//       },
//       {
//         name: "description",
//         label: "form.experience.description",
//         placeholder: "form.experience.description.placeholder",
//         type: "string",
//         multiline: true,
//         rows: 4,
//         required: true,
//         size: { xs: 12 },
//         validation: [
//           Validators.required,
//           Validators.minLength(10),
//           Validators.maxLength(1000),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.description.required",
//           minlength: "form.errors.fields.description.minlength",
//           maxlength: "form.errors.fields.description.maxlength",
//         },
//       },
//     ];
//   }

//   /**
//    * Configuration du formulaire de formation
//    */
//   static getEducationFormConfig(): FieldConfig[] {
//     return [
//       {
//         name: "degree",
//         label: "form.education.degree",
//         placeholder: "form.education.degree.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(100),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.degree.required",
//           minlength: "form.errors.fields.degree.minlength",
//           maxlength: "form.errors.fields.degree.maxlength",
//         },
//       },
//       {
//         name: "school",
//         label: "form.education.school",
//         placeholder: "form.education.school.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(100),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.school.required",
//           minlength: "form.errors.fields.school.minlength",
//           maxlength: "form.errors.fields.school.maxlength",
//         },
//       },
//       {
//         name: "location",
//         label: "form.education.location",
//         placeholder: "form.education.location.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [Validators.required, Validators.maxLength(100)],
//         errorMessages: {
//           required: "form.errors.fields.location.required",
//           maxlength: "form.errors.fields.location.maxlength",
//         },
//       },
//       {
//         name: "period",
//         label: "form.education.period",
//         placeholder: "form.education.period.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.required,
//           Validators.pattern(/^\d{4}(-\d{4})?$/),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.period.required",
//           pattern: "form.errors.fields.period.pattern",
//         },
//       },
//     ];
//   }

//   /**
//    * Configuration du formulaire de compétences
//    */
//   static getSkillFormConfig(): FieldConfig[] {
//     return [
//       {
//         name: "name",
//         label: "form.skill.name",
//         placeholder: "form.skill.name.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12 },
//         validation: [
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(50),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.skillName.required",
//           minlength: "form.errors.fields.skillName.minlength",
//           maxlength: "form.errors.fields.skillName.maxlength",
//         },
//       },
//       {
//         name: "level",
//         label: "form.skill.level",
//         placeholder: "form.skill.level.placeholder",
//         type: "select",
//         required: true,
//         size: { xs: 12 },
//         validation: [Validators.required],
//         options: [
//           { value: "Débutant", label: "form.level.beginner" },
//           { value: "Intermédiaire", label: "form.level.intermediate" },
//           { value: "Avancé", label: "form.level.advanced" },
//           { value: "Expert", label: "form.level.expert" },
//         ],
//         errorMessages: {
//           required: "form.errors.fields.level.required",
//         },
//       },
//     ];
//   }

//   /**
//    * Configuration du formulaire de langues
//    */
//   static getLanguageFormConfig(): FieldConfig[] {
//     return [
//       {
//         name: "name",
//         label: "form.language.name",
//         placeholder: "form.language.name.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12 },
//         validation: [
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(50),
//           Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.languageName.required",
//           minlength: "form.errors.fields.languageName.minlength",
//           maxlength: "form.errors.fields.languageName.maxlength",
//           pattern: "form.errors.fields.languageName.pattern",
//         },
//       },
//       {
//         name: "level",
//         label: "form.language.level",
//         placeholder: "form.language.level.placeholder",
//         type: "select",
//         required: true,
//         size: { xs: 12 },
//         validation: [Validators.required],
//         options: [
//           { value: "Débutant", label: "form.languageLevel.beginner" },
//           { value: "Élémentaire", label: "form.languageLevel.elementary" },
//           { value: "Intermédiaire", label: "form.languageLevel.intermediate" },
//           { value: "Avancé", label: "form.languageLevel.advanced" },
//           { value: "Courant", label: "form.languageLevel.fluent" },
//           { value: "Natif", label: "form.languageLevel.native" },
//         ],
//         errorMessages: {
//           required: "form.errors.fields.level.required",
//         },
//       },
//     ];
//   }

//   /**
//    * Configuration du formulaire de certifications
//    */
//   static getCertificationFormConfig(): FieldConfig[] {
//     return [
//       {
//         name: "name",
//         label: "form.certification.name",
//         placeholder: "form.certification.name.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12 },
//         validation: [
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(100),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.certificationName.required",
//           minlength: "form.errors.fields.certificationName.minlength",
//           maxlength: "form.errors.fields.certificationName.maxlength",
//         },
//       },
//       {
//         name: "issuer",
//         label: "form.certification.issuer",
//         placeholder: "form.certification.issuer.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(100),
//         ],
//         errorMessages: {
//           required: "form.errors.fields.issuer.required",
//           minlength: "form.errors.fields.issuer.minlength",
//           maxlength: "form.errors.fields.issuer.maxlength",
//         },
//       },
//       {
//         name: "date",
//         label: "form.certification.date",
//         placeholder: "form.certification.date.placeholder",
//         type: "string",
//         required: true,
//         size: { xs: 12, md: 6 },
//         validation: [Validators.required, Validators.pattern(/^\d{4}$/)],
//         errorMessages: {
//           required: "form.errors.fields.date.required",
//           pattern: "form.errors.fields.date.pattern",
//         },
//       },
//     ];
//   }
// }

// /**
//  * Service pour gérer les configurations de formulaires dynamiques
//  */
// export class ProfileFormService {
//   /**
//    * Crée un FormGroup à partir d'une configuration de champs
//    */
//   static createFormFromConfig(config: FieldConfig[], initialData?: any): any {
//     const formControls: any = {};

//     config.forEach((field) => {
//       const validators = field.validation || [];
//       const initialValue = initialData?.[field.name] || "";

//       formControls[field.name] = [initialValue, validators];
//     });

//     return formControls;
//   }

//   /**
//    * Obtient la configuration selon le type de formulaire
//    */
//   static getFormConfig(formType: ProfileFormType): FieldConfig[] {
//     switch (formType) {
//       case "personalInfo":
//         return ProfileFormConfigurations.getPersonalInfoFormConfig();
//       case "experience":
//         return ProfileFormConfigurations.getExperienceFormConfig();
//       case "education":
//         return ProfileFormConfigurations.getEducationFormConfig();
//       case "skill":
//         return ProfileFormConfigurations.getSkillFormConfig();
//       case "language":
//         return ProfileFormConfigurations.getLanguageFormConfig();
//       case "certification":
//         return ProfileFormConfigurations.getCertificationFormConfig();
//       default:
//         throw new Error(`Type de formulaire non supporté: ${formType}`);
//     }
//   }

//   /**
//    * Valide les données selon la configuration
//    */
//   static validateData(
//     data: any,
//     config: FieldConfig[]
//   ): { [key: string]: string } {
//     const errors: { [key: string]: string } = {};

//     config.forEach((field) => {
//       const value = data[field.name];

//       // Vérification des validateurs
//       if (field.validation) {
//         field.validation.forEach((validator) => {
//           const result = validator({ value } as any);
//           if (result) {
//             const errorKey = Object.keys(result)[0];
//             errors[field.name] =
//               field.errorMessages[errorKey] ||
//               `Erreur de validation: ${errorKey}`;
//           }
//         });
//       }
//     });

//     return errors;
//   }
// }

// /**
//  * Types pour les différents formulaires du profil
//  */
// export type ProfileFormType =
//   | "personalInfo"
//   | "experience"
//   | "education"
//   | "skill"
//   | "language"
//   | "certification";

// /**
//  * Interface pour les données de formulaire du profil
//  */
// export interface ProfileFormData {
//   personalInfo?: any;
//   experience?: any;
//   education?: any;
//   skill?: any;
//   language?: any;
//   certification?: any;
// }

// /**
//  * Exemple d'utilisation dans le composant Angular
//  */
// export class ProfileFormUsageExample {
//   private static getModalSize(formType: ProfileFormType): string {
//     switch (formType) {
//       case "personalInfo":
//       case "experience":
//       case "education":
//         return "large";
//       case "certification":
//         return "medium";
//       case "skill":
//       case "language":
//         return "small";
//       default:
//         return "medium";
//     }
//   }
// }

// export type { FieldConfig };
