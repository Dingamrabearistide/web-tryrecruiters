// import { Injectable } from "@angular/core";
// import { CanActivate, Router } from "@angular/router";
// import { JobsService } from "../services/jobs.service";

// @Injectable({
//   providedIn: "root",
// })
// export class EmployerGuard implements CanActivate {
//   constructor(private JobsService: JobsService, private router: Router) {}

//   canActivate(): boolean {
//     const role = this.JobsService.getRole();
//     if (role === "RECRUITER" || role === "PLATFORM_ADMIN") {
//       return true;
//     }
//     this.router.navigate(["/unauthorized"]);
//     return false;
//   }
// }
