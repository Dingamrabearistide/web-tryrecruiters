// import { Component, Input } from "@angular/core";

// @Component({
  standalone: false,

//   selector: "app-companies-detail",
//   template: `
//     <div class="companies-detail">
//       <div *ngIf="isLoading">Loading company details...</div>
//       <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
//       <div *ngIf="!isLoading && !errorMessage && item">
//         <h2>{{ item.name || "Company Details" }}</h2>
//         <p>{{ item.description || "No description available" }}</p>
//         <div *ngIf="jobOffers?.length">
//           <h3>Job Offers ({{ jobOffers.length }})</h3>
//           <div *ngFor="let offer of jobOffers">
//             <p>{{ offer.title || offer.id }}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [
//     `
//       .companies-detail {
//         padding: 1rem;
//       }
//       .error {
//         color: red;
//         padding: 1rem;
//         border: 1px solid red;
//         background: #ffe6e6;
//       }
//     `,
//   ],
// })
// export class CompaniesDetailComponent {
//   @Input() item: any;
//   @Input() isLoading: boolean = false;
//   @Input() errorMessage: string = "";
//   @Input() jobOffers: any[] = [];
// }
