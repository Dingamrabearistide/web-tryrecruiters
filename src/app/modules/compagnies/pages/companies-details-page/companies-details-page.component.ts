// import { Component } from "@angular/core";
// import { CommonModule } from "@angular/common";
// import { RouterModule } from "@angular/router";
// import { TranslocoModule } from "@ngneat/transloco";
// import { CompaniesService } from "../../companies.service";
// import { TranslocoService } from "@ngneat/transloco";
// import { goToTop, wait } from "../../../../@1hand/utils";
// import { ActivatedRoute } from "@angular/router";
// import { Company as ModuleObject } from "../../companies.types";
// import { MatDialog } from "@angular/material/dialog";
// import {
//   GenericModalComponent,
//   GenericModalData,
// } from "../../../../@1hand/components/generic-modal/generic-modal.component";
// import { CompagniesModule } from "../../compagnies.module";

// @Component({
//   selector: 'app-companies-details-page',
//   templateUrl: './companies-details-page.component.html',
//   styleUrl: './companies-details-page.component.scss',
//   standalone: true,
//   imports: [CommonModule, RouterModule, TranslocoModule, CompagniesModule],
// })
// export class CompaniesDetailsPageComponent {
//   isLoading = false;
//   hasError = false;
//   errorMessage = "";

//   item!: ModuleObject;
//   relatedCompanies: ModuleObject[] = [];

//   page = 1;
//   totalPages = 10;

//   constructor(
//     private companiesService: CompaniesService,
//     private transloco: TranslocoService,
//     private route: ActivatedRoute,
//     private dialog: MatDialog
//   ) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe((params) => {
//       console.log("params", params);
//       const id = params.get("slug");

//       if (id) {
//         this.loadItem(id);
//         this.loadRelatedCompanies();
//       } else {
//         console.error("Aucun ID fourni dans les paramètres de la route.");
//       }
//     });
//   }

//   loadItem(id: string) {
//     goToTop();

//     this.isLoading = true;
//     this.hasError = false;
//     this.errorMessage = "";

//     this.companiesService.selectById(id).subscribe({
//       next: async (res) => {
//         await wait();
//         console.log("response: ", res);
//         this.item = res;

//         this.isLoading = false;
//         this.hasError = false;
//         this.errorMessage = "";
//       },
//       error: (error) => {
//         console.error("Erreur", error);
//         this.isLoading = false;
//         this.hasError = true;
//         this.errorMessage =
//           error?.error?.message ||
//           this.transloco.translate("auth.genericError");
//       },
//     });
//   }

//   loadRelatedCompanies(page = 1) {
//     this.companiesService.selectMany({ page, limit: 3 }).subscribe({
//       next: async (res) => {
//         await wait();
//         console.log("related companies response: ", res);
//         this.relatedCompanies = res.data;
//         this.totalPages = res.total / res.limit;

//         this.isLoading = false;
//         this.hasError = false;
//         this.errorMessage = "";
//       },
//       error: (error) => {
//         console.error("Erreur", error);
//         this.isLoading = false;
//         this.hasError = true;
//         this.errorMessage =
//           error?.error?.message ||
//           this.transloco.translate("auth.genericError");
//       },
//     });
//   }

//   followCompany(): void {
//     if (!this.item?.id) {
//       return;
//     }

//     const modalData: GenericModalData = {
//       title: this.transloco.translate("companies.companyDetails.followCompany"),
//       content: this.transloco.translate(
//         "companies.companyDetails.followCompanyConfirm",
//         { name: this.item.name }
//       ),
//       actions: [
//         {
//           label: this.transloco.translate("companies.companyDetails.cancel"),
//           value: false,
//           color: undefined,
//         },
//         {
//           label: this.transloco.translate("companies.companyDetails.confirm"),
//           value: true,
//           color: "primary",
//         },
//       ],
//     };

//     const dialogRef = this.dialog.open(GenericModalComponent, {
//       width: "400px",
//       data: modalData,
//     });

//     dialogRef.afterClosed().subscribe((result) => {
//       if (result === true) {
//         // Simulate following company
//         console.log("Entreprise suivie:", this.item.name);
//       }
//     });
//   }

//   contactCompany(): void {
//     if (!this.item?.id) {
//       return;
//     }

//     const modalData: GenericModalData = {
//       title: this.transloco.translate(
//         "companies.companyDetails.contactCompany",
//         {
//           name: this.item.name,
//         }
//       ),
//       html: `
//         <div class="gap-4">
//           <p class="text-gray-600 mb-4">${this.transloco.translate(
//             "companies.companyDetails.contactFormDescription"
//           )}</p>
//           <!-- Espace réservé pour le formulaire de contact -->
//           <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//             <p class="text-gray-500">${this.transloco.translate(
//               "companies.companyDetails.contactFormPlaceholder"
//             )}</p>
//           </div>
//         </div>
//       `,
//       actions: [
//         {
//           label: this.transloco.translate("companies.companyDetails.cancel"),
//           value: false,
//           color: undefined,
//         },
//         {
//           label: this.transloco.translate(
//             "companies.companyDetails.sendMessage"
//           ),
//           value: true,
//           color: "primary",
//         },
//       ],
//     };

//     const dialogRef = this.dialog.open(GenericModalComponent, {
//       width: "600px",
//       data: modalData,
//     });

//     dialogRef.afterClosed().subscribe((result) => {
//       if (result === true) {
//         console.log("Message envoyé à l'entreprise:", this.item.name);
//       }
//     });
//   }
// }
