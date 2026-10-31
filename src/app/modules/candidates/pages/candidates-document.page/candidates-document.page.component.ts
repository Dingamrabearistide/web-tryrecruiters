import { Component, OnInit } from '@angular/core';

interface Document {
  id: number;
  name: string;
  fileName: string;
  filePath: string;
}

@Component({
  standalone: false,

  selector: 'app-candidates-document.page',
  templateUrl: './candidates-document.page.component.html',
  styleUrls: ["./candidates-document.page.component.scss", "../../../../../styles/legacy-styles.css"]
})
export class CandidatesDocumentPageComponent implements OnInit {
  documents: Document[] = [
    { id: 1, name: 'Mon CV FR', fileName: 'cv_jean_dupont.pdf', filePath: '/pdf/cv.pdf' },
    { id: 2, name: 'Mon CV EN', fileName: 'cv_jean_dupont.pdf', filePath: '/pdf/cv.pdf' },
    { id: 3, name: 'Mon CV Web&Co', fileName: 'cv_jean_dupont.pdf', filePath: '/pdf/cv.pdf' }
  ];

  // Form data
  startDate: string = '';
  endDate: string = '';
  searchQuery: string = '';
  selectedStatus: string = 'Tous';
  statusFilter: string = 'Tous';
  searchTerm: string = '';
  
  // Modal states
  showCvModal: boolean = false;
  showDeleteModal: boolean = false;
  documentToDelete: Document | null = null;
  
  // Add CV form
  newCvName: string = '';
  selectedFile: File | null = null;

  // Pagination
  currentPage: number = 1;
  totalPages: number = 4;

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  // Search and filter methods
  onSearch(): void {
    console.log('Searching with:', {
      startDate: this.startDate,
      endDate: this.endDate,
      searchQuery: this.searchQuery,
      selectedStatus: this.selectedStatus
    });
    // Implement search logic here
  }

  applyFilters(): void {
    // Ajoute ici la logique de filtrage si besoin, sinon laisse vide pour éviter l'erreur
    // Exemple : console.log('Filtrage non implémenté');
  }

  // Modal methods
  openCvModal(): void {
    this.showCvModal = true;
  }

  closeCvModal(): void {
    this.showCvModal = false;
    this.resetCvForm();
  }

  openDeleteModal(document: Document): void {
    this.documentToDelete = document;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.documentToDelete = null;
  }

  // File handling
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      alert('Veuillez sélectionner un fichier PDF');
      event.target.value = '';
    }
  }

  // CRUD operations
  addCv(): void {
    if (this.newCvName && this.selectedFile) {
      const newDocument: Document = {
        id: Date.now(), // Simple ID generation
        name: this.newCvName,
        fileName: this.selectedFile.name,
        filePath: '/pdf/' + this.selectedFile.name
      };
      
      this.documents.push(newDocument);
      this.closeCvModal();
      
      // Here you would typically upload the file to your server
      console.log('Adding new CV:', newDocument);
    }
  }

  confirmDelete(): void {
    if (this.documentToDelete) {
      this.documents = this.documents.filter(doc => doc.id !== this.documentToDelete!.id);
      console.log('Deleted document:', this.documentToDelete);
      this.closeDeleteModal();
    }
  }

  viewDocument(document: Document): void {
    window.open(document.filePath, '_blank');
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  addNewDoc(): void {
    // Placeholder pour éviter l'erreur, à implémenter si besoin
    alert('Fonctionnalité à implémenter : ajouter une alerte');
  }

  private resetCvForm(): void {
    this.newCvName = '';
    this.selectedFile = null;
    // Reset file input
    const fileInput = document.getElementById('cv-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}