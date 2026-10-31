import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";

export interface ContactMessageDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: "root" })
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  send(payload: ContactMessageDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload, {
      headers: { skip: "true" },
    });
  }
}
