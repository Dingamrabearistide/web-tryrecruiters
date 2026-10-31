import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { DailyMeetingToken, JoinInterviewResponse } from "./video-calls.types";

@Injectable({
  providedIn: "root",
})
export class DailyService {
  private apiUrl = `${environment.apiUrl}/daily`;

  constructor(private http: HttpClient) {}

  /**
   * Génère un token de meeting pour rejoindre une room Daily.co
   */
  generateMeetingToken(
    roomName: string,
    userName: string,
    isOwner: boolean = false
  ): Observable<DailyMeetingToken> {
    return this.http.post<DailyMeetingToken>(`${this.apiUrl}/meeting-tokens`, {
      roomName,
      userName,
      isOwner,
    });
  }

  /**
   * Obtient les informations nécessaires pour rejoindre un interview
   */
  joinInterview(interviewId: string): Observable<JoinInterviewResponse> {
    return this.http.get<JoinInterviewResponse>(
      `${environment.apiUrl}/interviews/${interviewId}/join`
    );
  }

  /**
   * Crée une room Daily.co
   */
  createRoom(options: {
    name?: string;
    privacy?: "private" | "public";
    enableScreenshare?: boolean;
    enableChat?: boolean;
    maxParticipants?: number;
    exp?: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/rooms`, options);
  }

  /**
   * Supprime une room Daily.co
   */
  deleteRoom(roomName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rooms/${roomName}`);
  }

  /**
   * Obtient les détails d'une room
   */
  getRoom(roomName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms/${roomName}`);
  }

  /**
   * Liste toutes les rooms
   */
  listRooms(limit: number = 10): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rooms`, {
      params: { limit: limit.toString() },
    });
  }
}
