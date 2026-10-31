// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { RouterModule } from '@angular/router';

// @Component({
  standalone: false,

//     selector: 'app-header',
//     imports: [CommonModule, RouterModule],
//     template: `
//     <header class="header">
//       <div class="container">
//         <div>
//           <div class="logo" routerLink="/">{{ appName }}</div>
//           <div *ngIf="authenticated">
//             Hey, {{ username }} <a (click)="logout()">Se déconnecter</a>
//           </div>
//         </div>
//         <div class="user-info">
//           <!-- <span *ngIf="userName">Bienvenue, {{ userName }}</span> -->
//           <button class="menu-button" (click)="toggleMenu()">☰</button>
//         </div>
//         <nav class="menu" [class.open]="menuOpen">
//           <ul>
//             <li><span routerLink="/dashboard">Dashboard</span></li>
//             <li><span routerLink="/members/search">Recherches</span></li>
//             <li><span routerLink="/members">Membres</span></li>
//             <li><span routerLink="/settings">Paramètres</span></li>
//             <!-- <li><span routerLink="" (click)="logout()">Déconnexion</span></li> -->
//           </ul>
//         </nav>
//       </div>
//     </header>
//   `,
//     styles: `
//     .container {
//       padding: 1rem;
//       max-width: 1200px;
//       margin: auto;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       padding: 15px 20px;
//     }
//     .header {
//       background-color: #007bff;
//       color: white;
//       font-size: 18px;
//       position: relative;
//     }

//     .logo {
//       font-weight: bold;
//       font-size: 22px;
//       cursor: pointer;
//     }

//     .user-info {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//     }

//     .menu-button {
//       display: none;
//       background: none;
//       border: none;
//       font-size: 24px;
//       cursor: pointer;
//       color: white;
//     }

//     .menu {
//       display: flex;
//       gap: 15px;
//     }

//     .menu ul {
//       list-style: none;
//       margin: 0;
//       padding: 0;
//       display: flex;
//       gap: 15px;
//     }

//     .menu span {
//       text-decoration: none;
//       color: white;
//       font-weight: 500;
//       cursor: pointer;
//     }

//     .menu span:hover {
//     }

//     @media (max-width: 768px) {
//       .menu {
//         display: none;
//         position: absolute;
//         top: 60px;
//         right: 0;
//         background-color: #007bff;
//         flex-direction: column;
//         width: 200px;
//         padding: 10px;
//       }

//       .menu.open {
//         display: flex;
//       }

//       .menu ul {
//         flex-direction: column;
//       }

//       .menu-button {
//         display: block;
//       }
//     }
//   `
// })
// export class HeaderComponent {
//   @Input() appName: string = 'Mon Application';
//   @Input() userName: string = 'Utilisateur';
//   @Input() authenticated: boolean = false;
//   @Input() username?: string = 'xxx';

//   @Output('logout') $logout: EventEmitter<void> = new EventEmitter();

//   menuOpen: boolean = false;

//   toggleMenu() {
//     this.menuOpen = !this.menuOpen;
//   }

//   logout() {
//     this.$logout.emit();
//   }
// }
