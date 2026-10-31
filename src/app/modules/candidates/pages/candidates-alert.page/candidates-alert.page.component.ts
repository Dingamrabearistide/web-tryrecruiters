import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface JobAlert {
  id: number;
  title: string;
  keywords: string;
  location: string;
  frequency: string;
  company?: string;
  contractType?: string;
  postedDate?: string;
  level?: string;
  description?: string;
}

@Component({
  standalone: false,

  selector: 'app-candidates-alert.page',
  templateUrl: './candidates-alert.page.component.html',
  styleUrl: './candidates-alert.page.component.scss'
})
export class CandidatesAlertPageComponent implements OnInit {
  jobAlerts: JobAlert[] = [
    {
      id: 1,
      title: 'Dev Frontend',
      keywords: 'développeur, React',
      location: 'Douala',
      frequency: 'Chaque jour',
      company: 'TechCorp',
      contractType: 'Permanent',
      postedDate: '03/12/2025',
      level: 'Junior',
      description: 'We are looking for a passionate front-end developer.\nSkills: HTML, CSS, JS, React.'
    },
    {
      id: 2,
      title: 'Dev Frontend',
      keywords: 'développeur, React',
      location: 'Douala',
      frequency: 'Chaque jour',
      company: 'TechCorp',
      contractType: 'Permanent',
      postedDate: '03/12/2025',
      level: 'Junior',
      description: 'We are looking for a passionate front-end developer.\nSkills: HTML, CSS, JS, React.'
    },
    {
      id: 3,
      title: 'Dev Frontend',
      keywords: 'développeur, React',
      location: 'Douala',
      frequency: 'Chaque jour',
      company: 'TechCorp',
      contractType: 'Permanent',
      postedDate: '03/12/2025',
      level: 'Junior',
      description: 'We are looking for a passionate front-end developer.\nSkills: HTML, CSS, JS, React.'
    }
  ];

  filteredAlerts: JobAlert[] = [];
  selectedAlert: JobAlert | null = null;
  alertToDelete: JobAlert | null = null;

  // Filters
  startDate: string = '';
  endDate: string = '';
  statusFilter: string = 'Tous';
  searchTerm: string = '';

  // Modal states
  showDetailsModal: boolean = false;
  showDeleteModal: boolean = false;

  // Sidebar and navigation states
  sidebarOpen: boolean = false;
  notifMenuOpen: boolean = false;
  avatarMenuOpen: boolean = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filteredAlerts = [...this.jobAlerts];
    this.updatePagination();
  }

  // Sidebar methods
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  // Navigation methods
  toggleNotifMenu(): void {
    this.notifMenuOpen = !this.notifMenuOpen;
    this.avatarMenuOpen = false;
  }

  toggleAvatarMenu(): void {
    this.avatarMenuOpen = !this.avatarMenuOpen;
    this.notifMenuOpen = false;
  }

  closeMenus(): void {
    this.notifMenuOpen = false;
    this.avatarMenuOpen = false;
  }

  // Search and filter methods
  applyFilters(): void {
    this.filteredAlerts = this.jobAlerts.filter(alert => {
      const matchesSearch = !this.searchTerm || 
        alert.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        alert.keywords.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        alert.location.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Add date filtering logic here if needed
      // const matchesDateRange = this.checkDateRange(alert);

      return matchesSearch;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  onSearch(): void {
    this.applyFilters();
  }

  // Modal methods
  openDetailsModal(alert: JobAlert): void {
    this.selectedAlert = alert;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedAlert = null;
  }

  openDeleteModal(alert: JobAlert): void {
    this.alertToDelete = alert;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.alertToDelete = null;
  }

  confirmDelete(): void {
    if (this.alertToDelete) {
      this.jobAlerts = this.jobAlerts.filter(alert => alert.id !== this.alertToDelete!.id);
      this.applyFilters();
      this.closeDeleteModal();
    }
  }

  // Navigation methods
  editAlert(alert: JobAlert): void {
    // Navigate to edit page
    this.router.navigate(['/job-alerts/edit', alert.id]);
  }

  addNewAlert(): void {
    this.router.navigate(['/job-alerts/add']);
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredAlerts.length / this.itemsPerPage);
  }

  getPaginatedAlerts(): JobAlert[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAlerts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  getPaginationArray(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Click outside handler
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Close notification menu if clicking outside
    if (!target.closest('#notifToggle') && !target.closest('#notifMenu')) {
      this.notifMenuOpen = false;
    }

    // Close avatar menu if clicking outside
    if (!target.closest('#avatarToggle') && !target.closest('#avatarMenu')) {
      this.avatarMenuOpen = false;
    }

    // Close modals if clicking on overlay
    if (target.classList.contains('modal-overlay')) {
      this.closeDetailsModal();
      this.closeDeleteModal();
    }
  }
}