import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { LoginResponseDto } from "./auth.types";

@Injectable()
export class GoogleService {
  private readonly baseUrl = `${environment.apiUrl}/auth`; // `${AppConfig.getConfig<string>('apiUrl')}/auth`;

  constructor(private http: HttpClient) {}

  loadSdk(lang: string = "en"): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && (window as any).google) {
        return resolve(); // déjà chargé
      }

      const existingScript = document.getElementById("google-sdk");
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve());
        return;
      }

      const script = document.createElement("script");
      script.id = "google-sdk";
      script.src = `https://accounts.google.com/gsi/client?hl=${lang}`;
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = (err) => reject(err);

      document.head.appendChild(script);
    });
  }

  loginWithGoogle(token: string) {
    return this.http.post<LoginResponseDto>(`${this.baseUrl}/google`, {
      token,
    });
  }
}
