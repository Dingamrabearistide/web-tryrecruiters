import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  standalone: false,

  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private authService: AuthService) {}

  get isAuth() {
    return this.authService.isAuthenticated();
  }

  get isRecruiter() {
    return this.authService.isRecruiter();
  }

  get isCandidate() {
    return this.authService.isCandidate();
  }
}
