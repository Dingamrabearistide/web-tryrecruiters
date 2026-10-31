// import { Component, OnInit } from "@angular/core";
// import { FormBuilder, FormGroup } from "@angular/forms";
// import { MatDialog } from "@angular/material/dialog";
// import { ConfirmDialogComponent } from "@1hand/components/confirm-dialog.component";

// @Component({
  standalone: false,

//   selector: "app-candidates-favorite.page",
//   templateUrl: "./candidates-favorite.page.component.html",
//   styleUrl: "./candidates-favorite.page.component.scss",
// })
// export class CandidatesFavoritePageComponent implements OnInit {
//   startDate: string = "";
//   endDate: string = "";
//   selectedStatus: string = "Tous";
//   searchTerm: string = "";
//   showDeleteModal: boolean = false;
//   showDetailsModal: boolean = false;
//   showEditModal: boolean = false;
//   favoriteToDelete: any = null;
//   selectedFavorite: any = null;
//   favoriteToEdit: any = null;
//   currentPage: number = 1;
//   itemsPerPage: number = 5;
//   totalItems: number = 0;
//   totalPages: number = 1;

//   favorites = [
//     {
//       poste: "UI/UX Designer",
//       entreprise: "Tech Innovai",
//       date: "2025-04-03",
//       statut: "Envoyée",
//       location: "Paris, France",
//       contractType: "CDI",
//       level: "Junior",
//       description:
//         "Recherche un designer passionné. Compétences : Figma, Adobe XD.",
//       isFavorite: true,
//     },
//     {
//       poste: "Développeur Front-end",
//       entreprise: "WebCorp",
//       date: "2025-03-15",
//       statut: "En attente",
//       location: "Lyon, France",
//       contractType: "CDI",
//       level: "Intermédiaire",
//       description:
//         "Développeur pour applications web. Compétences : React, TypeScript.",
//       isFavorite: true,
//     },
//     {
//       poste: "Data Analyst",
//       entreprise: "DataTech",
//       date: "2025-02-20",
//       statut: "Acceptée",
//       location: "Remote",
//       contractType: "Freelance",
//       level: "Senior",
//       description: "Analyse de données complexes. Compétences : Python, SQL.",
//       isFavorite: true,
//     },
//     {
//       poste: "Product Manager",
//       entreprise: "Innovate",
//       date: "2025-01-10",
//       statut: "Rejetée",
//       location: "Paris, France",
//       contractType: "CDI",
//       level: "Junior",
//       description: "Gestion de projets agiles. Compétences : Scrum, Jira.",
//       isFavorite: true,
//     },
//     {
//       poste: "UI/UX Designer",
//       entreprise: "Tech Innovai",
//       date: "2025-04-03",
//       statut: "Envoyée",
//       location: "Paris, France",
//       contractType: "CDI",
//       level: "Junior",
//       description:
//         "Recherche un designer passionné. Compétences : Figma, Adobe XD.",
//       isFavorite: true,
//     },
//     {
//       poste: "Développeur Front-end",
//       entreprise: "WebCorp",
//       date: "2025-03-15",
//       statut: "En attente",
//       location: "Lyon, France",
//       contractType: "CDI",
//       level: "Intermédiaire",
//       description:
//         "Développeur pour applications web. Compétences : React, TypeScript.",
//       isFavorite: true,
//     },
//     {
//       poste: "Data Analyst",
//       entreprise: "DataTech",
//       date: "2025-02-20",
//       statut: "Acceptée",
//       location: "Remote",
//       contractType: "Freelance",
//       level: "Senior",
//       description: "Analyse de données complexes. Compétences : Python, SQL.",
//       isFavorite: true,
//     },
//     {
//       poste: "Product Manager",
//       entreprise: "Innovate",
//       date: "2025-01-10",
//       statut: "Rejetée",
//       location: "Paris, France",
//       contractType: "CDI",
//       level: "Junior",
//       description: "Gestion de projets agiles. Compétences : Scrum, Jira.",
//       isFavorite: true,
//     },
//   ];

//   filteredFavorites = [...this.favorites];

//   constructor(private dialog: MatDialog) {}

//   ngOnInit() {
//     this.updatePagination();
//   }

//   applyFilters() {
//     console.log("Filters applied:", {
//       startDate: this.startDate,
//       endDate: this.endDate,
//       status: this.selectedStatus,
//       search: this.searchTerm,
//     });
//     this.filteredFavorites = this.favorites.filter((favorite) => {
//       let matches = true;
//       if (this.startDate && new Date(favorite.date) < new Date(this.startDate))
//         matches = false;
//       if (this.endDate && new Date(favorite.date) > new Date(this.endDate))
//         matches = false;
//       if (
//         this.selectedStatus !== "Tous" &&
//         favorite.statut !== this.selectedStatus
//       )
//         matches = false;
//       if (
//         this.searchTerm &&
//         !favorite.poste.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
//         !favorite.entreprise
//           .toLowerCase()
//           .includes(this.searchTerm.toLowerCase())
//       )
//         matches = false;
//       return matches;
//     });
//     this.currentPage = 1;
//     this.updatePagination();
//   }

//   clearFilters() {
//     console.log("Filters cleared");
//     this.startDate = "";
//     this.endDate = "";
//     this.selectedStatus = "Tous";
//     this.searchTerm = "";
//     this.filteredFavorites = [...this.favorites];
//     this.currentPage = 1;
//     this.updatePagination();
//   }

//   toggleFavorite(favorite: any) {
//     console.log("Toggling favorite for:", favorite.poste);
//     favorite.isFavorite = !favorite.isFavorite;
//     if (!favorite.isFavorite) {
//       this.favorites = this.favorites.filter((f) => f !== favorite);
//       this.filteredFavorites = this.filteredFavorites.filter(
//         (f) => f !== favorite
//       );
//       this.updatePagination();
//     }
//   }

//   openDetailsModal(favorite: any) {
//     console.log("Opening details modal for:", favorite.poste);
//     this.selectedFavorite = favorite;
//     this.showDetailsModal = true;
//   }

//   closeDetailsModal() {
//     console.log("Details modal closed");
//     this.showDetailsModal = false;
//     this.selectedFavorite = null;
//   }

//   openDeleteModal(favorite: any) {
//     console.log("Opening delete modal for:", favorite.poste);
//     this.favoriteToDelete = favorite;
//     this.showDeleteModal = true;
//   }

//   closeDeleteModal() {
//     console.log("Delete modal closed");
//     this.showDeleteModal = false;
//     this.favoriteToDelete = null;
//   }

//   confirmDelete() {
//     console.log("Delete confirmed for:", this.favoriteToDelete.poste);
//     this.favorites = this.favorites.filter((f) => f !== this.favoriteToDelete);
//     this.filteredFavorites = this.filteredFavorites.filter(
//       (f) => f !== this.favoriteToDelete
//     );
//     this.closeDeleteModal();
//     this.updatePagination();
//   }

//   openEditModal(favorite: any) {
//     console.log("Opening edit modal for:", favorite.poste);
//     this.favoriteToEdit = { ...favorite };
//     this.showEditModal = true;
//   }

//   closeEditModal() {
//     console.log("Edit modal closed");
//     this.showEditModal = false;
//     this.favoriteToEdit = null;
//   }

//   saveEdit() {
//     console.log("Saving edit for:", this.favoriteToEdit.poste);
//     if (!this.favoriteToEdit) return;
//     const idx = this.favorites.findIndex(
//       (f) =>
//         f.poste === this.favoriteToEdit.poste &&
//         f.entreprise === this.favoriteToEdit.entreprise &&
//         f.date === this.favoriteToEdit.date
//     );
//     if (idx !== -1) {
//       this.favorites[idx] = { ...this.favoriteToEdit };
//       this.applyFilters();
//     }
//     this.closeEditModal();
//   }

//   applyToJob(favorite: any) {
//     console.log("Applying to job:", favorite.poste);
//   }

//   openFavoriteModal(favorite: any): void {
//     const isFavorite = favorite.isFavorite;
//     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
//       data: {
//         type: "confirm",
//         title: isFavorite ? "Retirer des favoris ?" : "Ajouter aux favoris ?",
//         message: isFavorite
//           ? "Voulez-vous retirer ce poste de vos favoris ?"
//           : "Voulez-vous ajouter ce poste à vos favoris ?",
//         confirmText: isFavorite ? "Retirer" : "Ajouter",
//         cancelText: "Annuler",
//         showCloseButton: true,
//       },
//       autoFocus: false,
//     });
//     (dialogRef.componentInstance as ConfirmDialogComponent).confirmed.subscribe(() => {
//       favorite.isFavorite = !favorite.isFavorite;
//       this.applyFilters();
//       dialogRef.close("confirmed");
//     });
//     (dialogRef.componentInstance as ConfirmDialogComponent).cancelled.subscribe(() => {
//       dialogRef.close("cancelled");
//     });
//   }

//   getPaginatedFavorites() {
//     const start = (this.currentPage - 1) * this.itemsPerPage;
//     return this.filteredFavorites.slice(start, start + this.itemsPerPage);
//   }

//   trackByFavorite(index: number, favorite: any) {
//     return favorite.poste + favorite.entreprise;
//   }

//   updatePagination() {
//     this.totalItems = this.filteredFavorites.length;
//     this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
//   }

//   getPageNumbers() {
//     return Array.from({ length: this.totalPages }, (_, i) => i + 1);
//   }

//   goToPage(page: number) {
//     console.log("Navigating to page:", page);
//     this.currentPage = page;
//   }

//   previousPage() {
//     if (this.currentPage > 1) {
//       console.log("Navigating to previous page");
//       this.currentPage--;
//     }
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       console.log("Navigating to next page");
//       this.currentPage++;
//     }
//   }

//   getStatusClass(status: string): string {
//     switch (status) {
//       case "Envoyée":
//         return "bg-green-100 text-green-800";
//       case "En attente":
//         return "bg-yellow-100 text-yellow-800";
//       case "Acceptée":
//         return "bg-blue-100 text-blue-800";
//       case "Rejetée":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   }

//   getPaginationText() {
//     return `Affichage de ${
//       (this.currentPage - 1) * this.itemsPerPage + 1
//     } à ${Math.min(
//       this.currentPage * this.itemsPerPage,
//       this.totalItems
//     )} sur ${this.totalItems} favoris`;
//   }
// }
