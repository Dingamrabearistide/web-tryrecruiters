import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CoreModule } from "./modules/core/core.module";
import { SharedModule } from "./modules/shared/shared.module";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CoreModule, SharedModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "TryRecruiters";

  // constructor(private http: HttpClient) {
  //   this.http
  //     .get(`${environment.apiUrl}/check`)
  //     .subscribe((res) => console.log("ping", res));
  // }
}
