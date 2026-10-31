import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { Validators } from "@angular/forms";
import {
  GenericFormComponent,
  FieldConfig,
} from "../../../../@1hand/components/generic-form/generic-form.component";

@Component({
  standalone: false,

  selector: "app-resumes-form",
  templateUrl: "./resumes-form.component.html",
  styleUrls: ["./resumes-form.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class ResumesFormComponent {
  @ViewChild(GenericFormComponent, { static: false })
  formComponent!: GenericFormComponent;

  @Input() isLoading = false;
  @Input() defaultValues?: FormData;
  @Output() onSubmit: EventEmitter<FormData> = new EventEmitter();

  genericFormConfig: FieldConfig[] = [
    {
      name: "name",
      label: "form.name", // "Nom du CV"
      placeholder: "form.namePlaceholder", // "Ex: CV Développeur Frontend"
      type: "string",
      required: true,
      size: { xs: 12 },
      validation: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ],
      errorMessages: {
        required: "validation.name.required",
        minlength: "validation.name.minLength",
        maxlength: "validation.name.maxLength",
      },
    },

    {
      name: "resumeFile",
      label: "form.file", // "Fichier PDF"
      placeholder: "form.upload", // "Télécharger un CV"
      type: "fileuploader",
      required: true,
      size: { xs: 12 },
      validation: [Validators.required],
      // The underlying /upload endpoint only actually accepts
      // image/jpeg, image/png and application/pdf — advertising .docx/
      // .txt/.odt here let users pick a file the backend always 400s on
      // ("Type de fichier non autorisé"), so the accepted list must match
      // what the backend really allows.
      acceptedFileExtensions: ['.pdf', '.png', '.jpg', '.jpeg'],
      errorMessages: {
        required: "validation.file.required",
        invalidType: "validation.file.invalidType",
        tooLarge: "validation.file.tooLarge",
      },
    },

    {
      name: "isDefault",
      label: "form.isDefault", // "Définir comme CV par défaut"
      type: "checkbox",
      required: false,
      size: { xs: 12, md: 6 },
      defaultValue: false,
    },
  ];

  ngOnInit(): void {}

  submitManually() {
    if (this.formComponent) {
      this.formComponent.submit();
    } else {
      console.warn("generic form not found.");
    }
  }

  handleSubmit(data: FormData) {
    this.onSubmit.emit(data);
  }
}
