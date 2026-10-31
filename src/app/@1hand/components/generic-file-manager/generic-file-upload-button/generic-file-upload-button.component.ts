import {
  Component,
  EventEmitter,
  Output,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import {
  GenericFileManagerFileItem,
  GenericFileManagerActiveTab,
} from "../../generic-file-manager/generic-file-manager-modal/generic-file-manager-modal.component";
import { GenericFileManagerUploadService } from "../../generic-file-manager/generic-file-manager-upload.service";
import { wait } from "../../../utils";
import { TranslocoService } from "@ngneat/transloco";
import { GenericFileManagerComponent } from "../../generic-file-manager/generic-file-manager.component";
import { CommonModule } from "@angular/common";
import { AuthService } from "@modules/auth/auth.service";
import { environment } from "@env/environment";

@Component({
  selector: "app-generic-file-upload-button",
  standalone: true,
  imports: [CommonModule, GenericFileManagerComponent],
  templateUrl: "./generic-file-upload-button.component.html",
  styleUrl: "./generic-file-upload-button.component.scss",
})
export class GenericFileUploadButtonComponent {
  @Input() acceptedExtensions?: string[];
  @Output() onChoose: EventEmitter<GenericFileManagerFileItem> =
    new EventEmitter();

  isLoading = false;
  hasError = false;
  errorMessage = "";

  files: GenericFileManagerFileItem[] = [];

  selectedFile: GenericFileManagerFileItem | null = null;
  choosedFile: GenericFileManagerFileItem | null = null;

  uploading = false;
  uploadProgress: number | null = null;
  uploadError: string | null = null;

  activeTab: GenericFileManagerActiveTab = "upload";
  currentUserId!: string;

  constructor(
    private gfmUploadService: GenericFileManagerUploadService,
    private transloco: TranslocoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    const id = this.authService.getUser()?.id;

    if (id) this.currentUserId = id;
    else {
      console.error("No connected user id");
    }
  }

  ngOnInit(): void {
    this.onLoadFiles();
  }

  /** Chargement des fichiers depuis le backend */
  onLoadFiles() {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    // Filtrer par l'ID de l'utilisateur connecté
    const filters = this.currentUserId
      ? { uploadedById: this.currentUserId }
      : undefined;

    this.gfmUploadService.selectMany(filters).subscribe({
      next: async (res) => {
        await wait();
        this.isLoading = false;
        this.hasError = false;
        this.errorMessage = "";

        this.files = res;

        // Sélectionner le premier fichier s'il existe
        if (this.files.length > 0) {
          this.choosedFile = this.files[0];
        }
        this.activeTab = "library";
      },
      error: async (error: any) => {
        await wait();

        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("general.genericError");
      },
    });

    console.log("**********load the files for user:", this.currentUserId);
  }

  onStartUpload(file: File) {
    this.uploading = true;
    this.uploadProgress = 0;
    this.uploadError = null;
    this.gfmUploadService
      .uploadWithProgress<GenericFileManagerFileItem>(
        `${environment.apiUrl}/upload`,
        file,
        {
          ...(this.currentUserId ? { uploadedById: this.currentUserId } : {}),
        }
      )
      .subscribe({
        next: (evt) => {
          console.log("eveevvvv: ", evt);
          if (evt.type === "progress") {
            this.uploadProgress = evt.progress;
          } else {
            // success
            const newFile = evt.body;
            this.files = [newFile, ...this.files];
            this.selectedFile = newFile;
            this.choosedFile = newFile;
            this.uploading = false;
            this.uploadProgress = null;

            // Forcer la détection de changement avant de changer d'onglet
            this.cdr.detectChanges();

            this.activeTab = "library";

            // Forcer à nouveau après le changement d'onglet
            this.cdr.detectChanges();

            // Émettre automatiquement le fichier uploadé au formulaire parent
            this.onChoose.emit(newFile);
            console.log(
              "Fichier uploadé et automatiquement sélectionné:",
              newFile
            );
          }
        },
        error: (err) => {
          // ⬅️ 404, 500, CORS, ou Validation throw -> ici.
          this.uploading = false;
          this.uploadProgress = null;
          this.uploadError =
            err?.error?.message ||
            err?.message ||
            `Échec de l'upload (${err?.status || "?"})`;
        },
      });
  }

  /** Quand un fichier est inséré */
  onInsert() {
    console.log("Fichier choisi :", this.selectedFile);
    this.choosedFile = this.selectedFile;

    if (this.choosedFile) {
      this.onChoose.emit(this.choosedFile);
    } else {
      alert("no selected file");
    }
  }

  /** Quand la modale est fermée */
  onClose() {
    console.log("Modale fermée");
  }

  getAllowedMimeTypes(): string[] {
    if (!this.acceptedExtensions || this.acceptedExtensions.length === 0) {
      return ['image/jpeg', 'image/png', 'application/pdf'];
    }

    const extensionToMimeMap: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.rtf': 'application/rtf',
      '.odt': 'application/vnd.oasis.opendocument.text',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };

    return this.acceptedExtensions
      .map(ext => extensionToMimeMap[ext.toLowerCase()])
      .filter(mime => mime !== undefined);
  }
}
