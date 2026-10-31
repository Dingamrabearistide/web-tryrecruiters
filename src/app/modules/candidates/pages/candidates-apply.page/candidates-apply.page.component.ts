import { Component, Inject, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
interface Candidature {
  id: number;
  poste: string;
  entreprise: string;
  date: string;
  statut: 'Envoyée' | 'En attente' | 'Rejetée';
  description?: string;
  location?: string;
  contractType?: string;
  level?: string;
  postedOn?: string;
}

@Component({
  standalone: false,

  selector: 'app-candidates-apply.page',
  templateUrl: './candidates-apply.page.component.html',
  styleUrl: './candidates-apply.page.component.scss'
})
export class CandidatesApplyPageComponent implements OnInit{

constructor( private route: Router){}

  candidatures: Candidature[] = [
    {
      id: 1,
      poste: 'UI/UX Designer',
      entreprise: 'Tech Innovai',
      date: '03/04/2025',
      statut: 'Envoyée',
      description: 'We are looking for a passionate UI/UX designer. Skills: Figma, Adobe XD, Sketch.',
      location: 'Paris, France',
      contractType: 'Permanent',
      level: 'Junior',
      postedOn: '03/12/2025'
    },
    {
      id: 2,
      poste: 'UI/UX Designer',
      entreprise: 'Tech Innovai',
      date: '03/04/2025',
      statut: 'En attente',
      description: 'We are looking for a passionate UI/UX designer. Skills: Figma, Adobe XD, Sketch.',
      location: 'Lyon, France',
      contractType: 'Contract',
      level: 'Mid-level',
      postedOn: '02/12/2025'
    },
    {
      id: 3,
      poste: 'UI/UX Designer',
      entreprise: 'Tech Innovai',
      date: '03/04/2025',
      statut: 'Rejetée',
      description: 'We are looking for a passionate UI/UX designer. Skills: Figma, Adobe XD, Sketch.',
      location: 'Remote',
      contractType: 'Freelance',
      level: 'Senior',
      postedOn: '01/12/2025'
    }
  ];

  filteredCandidatures: Candidature[] = [];
  selectedCandidature: Candidature | null = null;
  candidatureToDelete: Candidature | null = null;

  // Filters
  startDate: string = '';
  endDate: string = '';
  selectedStatus: string = 'Tous';
  searchTerm: string = '';

  // Modal states
  showDetailsModal: boolean = false;
  showDeleteModal: boolean = false;
  sidebarOpen: boolean = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  ngOnInit(): void {
    this.filteredCandidatures = [...this.candidatures];
    this.calculatePagination();
  }

  // Sidebar methods
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  // Filter methods
  applyFilters(): void {
    this.filteredCandidatures = this.candidatures.filter(candidature => {
      const matchesSearch = !this.searchTerm || 
        candidature.poste.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidature.entreprise.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'Tous' || candidature.statut === this.selectedStatus;
      const matchesDateRange = this.isDateInRange(candidature.date);
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });
    
    this.currentPage = 1;
    this.calculatePagination();
  }

  private isDateInRange(dateStr: string): boolean {
    if (!this.startDate && !this.endDate) return true;
    
    const candidatureDate = this.parseDate(dateStr);
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;
    
    if (start && candidatureDate < start) return false;
    if (end && candidatureDate > end) return false;
    
    return true;
  }

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  clearFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.selectedStatus = 'Tous';
    this.searchTerm = '';
    this.applyFilters();
  }

  // Modal methods
  moreDetails(candidature: Candidature): void {
    // todo:  for redirection : hav some problem
   this.route.navigate(["/jobs/", candidature.id])
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedCandidature = null;
  }

  openDeleteModal(candidature: Candidature): void {
    this.candidatureToDelete = candidature;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.candidatureToDelete = null;
  }

  confirmDelete(): void {
    if (this.candidatureToDelete) {
      this.candidatures = this.candidatures.filter(c => c.id !== this.candidatureToDelete!.id);
      this.applyFilters();
      this.closeDeleteModal();
    }
  }

  // Status styling
  getStatusClass(statut: string): string {
    switch (statut) {
      case 'Envoyée':
        return 'bg-green-200 text-green-700';
      case 'En attente':
        return 'bg-yellow-200 text-yellow-700';
      case 'Rejetée':
        return 'bg-red-200 text-red-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  }

  // Pagination methods
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCandidatures.length / this.itemsPerPage);
  }

  getPaginatedCandidatures(): Candidature[] {
    return this.filteredCandidatures
  }

  goToPage(page: number): void {
  console.log('go to next page ')
  }

  previousPage(): void {
    console.log('go to previos page ')
  }

  nextPage(): void {
   console.log('go to next page ')
  }

  getPageNumbers(): number[] {
  
    return [this.candidatures.length];
  }
}