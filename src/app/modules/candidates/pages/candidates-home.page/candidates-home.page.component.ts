import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

// Interface pour les actions
export interface TableAction {
  label: string;
  icon?: string;
  class?: string;
  callback: (item?: any) => void;
}

// Interface pour les filtres
export interface FilterOptions {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  customFilters?: { [key: string]: any };
}
@Component({
  standalone: false,

  selector: 'app-candidates-home.page',
  templateUrl: './candidates-home.page.component.html',

})
export class CandidatesHomePageComponent implements OnInit {
 constructor(private router:Router){}

  // Component data
  userName = 'Jean Dupont';
  profileCompletion = 90;
  
  stats: any = {
    applicationsCount: 58,
    favoritesCount: 20,
    alertsCount: 5
  };

  filters = {
    startDate: '',
    endDate: '',
    status: '',
    searchTerm: ''
  };

  jobOffers: any[] = [
    {
      id: 1,
      title: 'Développeur Full Stack',
      company: 'Tech Innovai',
      location: 'Douala',
      contractType: 'CDI'
    },
    {
      id: 2,
      title: 'Développeur Frontend React',
      company: 'Digital Solutions',
      location: 'Yaoundé',
      contractType: 'CDI'
    },
    {
      id: 3,
      title: 'Analyste de Données',
      company: 'Data Corp',
      location: 'Douala',
      contractType: 'CDD'
    },
    {
      id: 4,
      title: 'Designer UI/UX',
      company: 'Creative Agency',
      location: 'Bafoussam',
      contractType: 'Freelance'
    },
    {
      id: 5,
      title: 'Développeur Mobile Flutter',
      company: 'Mobile First',
      location: 'Douala',
      contractType: 'Stage'
    }
  ];

   columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nom', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Statut', sortable: true },
    { key: 'createdAt', label: 'Date création', sortable: true }
  ];

  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Actif', createdAt: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactif', createdAt: '2024-01-16' }
  ];

  rowActions: TableAction[] = [
    {
      label: 'Éditer',
      icon: 'fas fa-edit',
      class: 'text-blue-600 hover:text-blue-800',
      callback: (item) => this.editUser(item)
    },
    {
      label: 'Supprimer',
      icon: 'fas fa-trash',
      class: 'text-red-600 hover:text-red-800',
      callback: (item) => this.deleteUser(item)
    }
  ];

  globalActions: TableAction[] = [
    {
      label: 'Ajouter',
      icon: 'fas fa-plus',
      class: 'bg-blue-600 text-white hover:bg-blue-700',
      callback: () => this.addUser()
    }
  ];

  filterstab = [
    {
      key: 'status',
      placeholder: 'Filtrer par statut',
      options: [
        { value: 'Actif', label: 'Actif' },
        { value: 'Inactif', label: 'Inactif' }
      ]
    }
  ];

  filteredJobOffers: any[] = [];

  ngOnInit(): void {
    this.filteredJobOffers = [...this.jobOffers];
  }

  // Track by function for ngFor performance
  trackByJobId(index: number, job: any): number {
    return job.id;
  }

  // Methods
  completeProfile(): void {
    console.log('Navigating to profile completion...');
    // Implement navigation to profile page
   this.router.navigate(['./profile']);
  }

  viewAllOffers(): void {
    console.log('Navigating to all job offers...');
    // Implement navigation to job offers page
   this.router.navigate(['/jobs']);
  }

  searchOffers(): void {
    this.filteredJobOffers = this.jobOffers.filter(offer => {
      const matchesSearch = !this.filters.searchTerm || 
        offer.title.toLowerCase().includes(this.filters.searchTerm.toLowerCase()) ||
        offer.company.toLowerCase().includes(this.filters.searchTerm.toLowerCase()) ||
        offer.location.toLowerCase().includes(this.filters.searchTerm.toLowerCase());
      
      const matchesStatus = !this.filters.status || 
        offer.contractType === this.filters.status;
      
      return matchesSearch && matchesStatus;
    });
  }

  viewJobDetails(jobId: number): void {
    console.log(`Viewing job details for job ID: ${jobId}`);
   this.router.navigate(['/jobs', jobId]);
  }

  editJob(jobId: number): void {
    console.log(`Editing job with ID: ${jobId}`);

  }

  

  currentPage = 1;
  totalPages = 5;
  hasNext = true;
  hasPrevious = false;

  editUser(user: any) {
    console.log('Éditer utilisateur:', user);
  }

  deleteUser(user: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      console.log('Supprimer utilisateur:', user);
    }
  }

  addUser() {
    console.log('Ajouter nouvel utilisateur');
  }

  onPageChange(page: number) {
    console.log('Changement de page:', page);
    // Appel API pour charger la page
  }

  onNextPage() {
    console.log('Page suivante');
    // Appel API pour page suivante
  }

  onPreviousPage() {
    console.log('Page précédente');
    // Appel API pour page précédente
  }

  onFilterChange(filters: any) {
    console.log('Filtres changés:', filters);
    // Appel API avec nouveaux filtres
  }

  onSortChange(sort: {column: string, direction: 'asc' | 'desc'}) {
    console.log('Tri changé:', sort);
    // Appel API avec nouveau tri
  }

  onExport() {
    console.log('Export des données');
    // Logique d'export
  }
}