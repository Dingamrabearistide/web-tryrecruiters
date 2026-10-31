import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import {
  RecruiterRegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ConfirmEmailDto,
  LoginResponseDto,
  User,
  ValidateLoginDto,
  CandidateRegisterDto,
  ResendConfirmEmailDto,
  SendLoginCodeDto,
  NotificationChannel,
  Role,
  UpdateProfileDto,
} from "./auth.types";
import { environment } from "../../../environments/environment";

export type SendCodeContext =
  | "login"
  | "register"
  | "forgot-password"
  | "confirm-account";

export const AUTH_OTP_PHONE_OR_EMAIL = "AUTH_OTP_PHONE_OR_EMAIL";
export const AUTH_OTP_METHOD = "AUTH_OTP_METHOD";
export const AUTH_OTP_CONTEXT = "AUTH_OTP_CONTEXT";

export const ACCESS_TOKEN_KEY = "access-token";
export const USER_KEY = "user";
export const USER_ROLE_KEY = "role";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`; // `${AppConfig.getConfig<string>('apiUrl')}/auth`;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken(),
  );

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  send2FACode(
    channel: NotificationChannel,
    context: SendCodeContext,
    phoneOrEmail: string,
  ): Observable<Object> {
    let endpoint = "";

    switch (context) {
      case "login":
        endpoint = `${this.baseUrl}/send-login-code`;
        break;
      // case "register":
      //   endpoint = "/api/auth/2fa/register";
      //   break;
      // case "forgot-password":
      //   endpoint = "/api/auth/2fa/forgot-password";
      //   break;
      // case "confirm-account":
      //   endpoint = "/api/auth/2fa/confirm-account";
      //   break;
      default:
        throw new Error(`Unsupported 2FA context: ${context}`);
    }

    console.log("method: ", context);
    console.log("[phone or email]: ", phoneOrEmail);

    return this.http.post(endpoint, {
      channel,
      email: phoneOrEmail,
      phone: phoneOrEmail,
    });
    // .toPromise();
  }

  verify2FACode(
    context: SendCodeContext,
    code: string,
    phoneOrEmail: string,
  ): Observable<LoginResponseDto> {
    let endpoint = "";
    let payload;

    switch (context) {
      case "login":
        endpoint = `${this.baseUrl}/validate-login-code`;
        payload = {
          code,
          phone: phoneOrEmail,
          email: phoneOrEmail,
        };
        break;
      case "register":
        endpoint = `${this.baseUrl}/confirm-email`;
        payload = {
          token: code,
          email: phoneOrEmail,
        };
        break;
      // case "forgot-password":
      //   endpoint = "/api/auth/2fa/forgot-password/verify";
      //   break;
      // case "confirm-account":
      //   endpoint = "/api/auth/2fa/confirm-account/verify";
      //   break;
      default:
        throw new Error(`Unsupported 2FA context: ${context}`);
    }

    return this.http.post<LoginResponseDto>(endpoint, payload);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  getRole(): Role | null {
    return this.currentUserSubject.value?.role || null;
  }

  // Convenience helpers
  isCandidate(): boolean {
    const role = this.getRole();
    return role === Role.CANDIDATE;
  }

  isRecruiter(): boolean {
    const role = this.getRole();
    return role === Role.RECRUITER;
  }

  isPlatformAdmin(): boolean {
    const role = this.getRole();
    return role === Role.PLATFORM_ADMIN;
  }

  isSuperAdmin(): boolean {
    const role = this.getRole();
    return role === Role.SUPER_ADMIN;
  }

  getAccountById(itemId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/account/${itemId}`);
  }

  getAccountId(): string | null {
    return this.getUser()?.id || null;
  }

  // Backward compatibility
  getCandidateId(): string | null {
    const user = this.getUser();
    return user && user.role === Role.CANDIDATE ? user.id : null;
  }

  getRecruiterId(): string | null {
    const user = this.getUser();
    return user && user.role === Role.RECRUITER ? user.id : null;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  setAuthenticated(token: string, user: User, role: Role) {
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    this.currentUserSubject.next(user);
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  /**
   * Charge le profil de l'utilisateur connecté depuis le backend
   * Retourne une Promise pour être utilisé avec APP_INITIALIZER
   */
  loadCurrentUser(): Promise<User | null> {
    if (!this.hasToken()) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      this.http.get<User>(`${this.baseUrl}/me`).subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          resolve(user);
        },
        error: (error) => {
          console.error("Erreur lors du chargement du profil:", error);
          // Si le token est invalide (401) ou compte non trouvé (404), déconnecter et rediriger
          if (error.status === 401 || error.status === 404) {
            this.logout();
            // Rediriger vers la page de login avec un indicateur d'expiration
            this.router.navigate(["/auth/login"], {
              queryParams: {
                sessionExpired: "true",
              },
            });
          }
          resolve(null);
        },
      });
    });
  }

  /**
   * Récupère le profil de l'utilisateur connecté (Observable)
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  recruiterRegister(
    data: RecruiterRegisterDto,
  ): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(
      `${this.baseUrl}/register/recruiter`,
      data,
    );
  }

  candidateRegister(
    data: CandidateRegisterDto,
  ): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(
      `${this.baseUrl}/register/candidate`,
      data,
    );
  }

  login(data: LoginDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.baseUrl}/login`, data);
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  forgotPassword(data: ForgotPasswordDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordDto): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(
      `${this.baseUrl}/reset-password`,
      data,
    );
  }

  confirmEmail(data: ConfirmEmailDto): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(
      `${this.baseUrl}/confirm-email`,
      data,
    );
  }

  sendConfirmationEmail(
    data: ResendConfirmEmailDto,
  ): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(
      `${this.baseUrl}/send-confirmation-email`,
      data,
    );
  }

  sendLoginCode(data: SendLoginCodeDto): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(
      `${this.baseUrl}/send-login-code`,
      data,
    );
  }

  validateLogin(data: ValidateLoginDto): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(
      `${this.baseUrl}/validate-login-code`,
      data,
    );
  }

  updateProfile(data: Partial<UpdateProfileDto>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/profile`, data);
  }

  resendConfirmationCode(data: {
    email: string;
  }): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(
      `${this.baseUrl}/send-confirmation-email`,
      data,
    );
  }

  confirmAccount(data: {
    email: string;
    code: string;
  }): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(
      `${this.baseUrl}/confirm-account`,
      data,
    );
  }
}
