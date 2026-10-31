import { Component, Input } from "@angular/core";

@Component({
  selector: "app-home",
  standalone: false,
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {
  @Input() isLoggedIn: boolean = false;
}
