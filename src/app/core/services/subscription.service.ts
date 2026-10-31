import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, tap, map } from "rxjs";
import { environment } from "../../../environments/environment";

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  type: "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";
  description: string;
  price: number;
  currency: string;
  maxJobOffers: number;
  maxActiveJobOffers: number;
  maxApplications: number;
  maxCompanies: number;
  maxRecruiters: number;
  maxInterviews: number;
  canAccessCVDatabase: boolean;
  canExportData: boolean;
  canUseAnalytics: boolean;
  canUsePrioritySupport: boolean;
  canFeaturedJobOffers: boolean;
  canCustomBranding: boolean;
  durationDays: number | null;
  isActive: boolean;
  isDefault: boolean;
}

export interface CompanySubscription {
  id: string;
  recruiterId?: string;
  companyId?: string;
  planId: string;
  startDate: string;
  endDate: string | null;
  status: "ACTIVE" | "EXPIRED" | "SUSPENDED" | "CANCELED";
  currentJobOffers: number;
  currentActiveJobOffers: number;
  currentApplications: number;
  currentCompanies: number;
  currentRecruiters: number;
  currentMonthInterviews: number;
  autoRenew: boolean;
  plan: SubscriptionPlan;
}

export interface SubscriptionHistory {
  id: string;
  subscriptionId: string;
  action: string;
  previousPlanId: string | null;
  newPlanId: string | null;
  description: string;
  createdAt: string;
}

export interface PaymentStatus {
  accountId: string;
  email: string;
  enablePayment: boolean;
  paymentMode: "NORMAL" | "DISABLED";
}

export interface TogglePaymentResponse {
  message: string;
  accountId: string;
  email: string;
  enablePayment: boolean;
}

@Injectable({
  providedIn: "root",
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/subscriptions`;
  private currentSubscriptionSubject =
    new BehaviorSubject<CompanySubscription | null>(null);
  public currentSubscription$ = this.currentSubscriptionSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Récupérer tous les plans disponibles
   */
  getAllPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/plans`);
  }

  /**
   * Récupérer le plan par défaut
   */
  getDefaultPlan(): Observable<SubscriptionPlan> {
    return this.http.get<SubscriptionPlan>(`${this.apiUrl}/plans/default`);
  }

  /**
   * Récupérer un plan par ID
   */
  getPlanById(id: string): Observable<SubscriptionPlan> {
    return this.http.get<SubscriptionPlan>(`${this.apiUrl}/plans/${id}`);
  }

  /**
   * Récupérer la souscription active d'un recruteur
   */
  getRecruiterSubscription(
    recruiterId: string,
  ): Observable<CompanySubscription> {
    return this.http
      .get<CompanySubscription>(`${this.apiUrl}/recruiter/${recruiterId}`)
      .pipe(
        tap((subscription) => {
          this.currentSubscriptionSubject.next(subscription);
        }),
      );
  }

  /**
   * @deprecated Utilisez getRecruiterSubscription à la place
   * Récupérer la souscription active d'une entreprise (ancienne méthode)
   */
  getCompanySubscription(companyId: string): Observable<CompanySubscription> {
    // Pour compatibilité ascendante, on appelle la nouvelle méthode
    return this.getRecruiterSubscription(companyId);
  }

  /**
   * Créer une souscription
   */
  createSubscription(data: {
    recruiterId: string;
    planId: string;
    autoRenew?: boolean;
  }): Observable<CompanySubscription> {
    return this.http.post<CompanySubscription>(this.apiUrl, data).pipe(
      tap((subscription) => {
        this.currentSubscriptionSubject.next(subscription);
      }),
    );
  }

  upgradeSubscription(data: {
    newPlanId: string;
    recruiterId: string;
    returnUrl?: string;
    cancelUrl?: string;
    autoRenew?: boolean;
  }): Observable<CompanySubscription> {
    return this.http
      .post<CompanySubscription>(`${this.apiUrl}/upgrade`, data)
      .pipe(
        tap((subscription) => {
          this.currentSubscriptionSubject.next(subscription);
        }),
      );
  }

  /**
   * Assign the unlimited Enterprise plan to a recruiter and deactivate existing plans
   */
  assignUnlimitedPlan(recruiterId: string): Observable<CompanySubscription> {
    return this.http
      .post<CompanySubscription>(
        `${this.apiUrl}/recruiter/${recruiterId}/assign-unlimited`,
        {},
      )
      .pipe(
        tap((subscription) => {
          this.currentSubscriptionSubject.next(subscription);
        }),
      );
  }

  /**
   * Deactivate all plans for a recruiter
   */
  deactivateAllPlans(
    recruiterId: string,
  ): Observable<CompanySubscription | any> {
    return this.http
      .post<
        CompanySubscription | any
      >(`${this.apiUrl}/recruiter/${recruiterId}/deactivate-all`, {})
      .pipe(
        tap((res: any) => {
          const sub = res as CompanySubscription;
          if (sub?.id) this.currentSubscriptionSubject.next(sub);
        }),
      );
  }

  /**
   * Récupérer l'historique d'une souscription
   */
  getSubscriptionHistory(
    subscriptionId: string,
  ): Observable<SubscriptionHistory[]> {
    return this.http.get<SubscriptionHistory[]>(
      `${this.apiUrl}/${subscriptionId}/history`,
    );
  }

  /**
   * Annuler une souscription
   */
  cancelSubscription(
    subscriptionId: string,
    reason?: string,
  ): Observable<CompanySubscription> {
    return this.http
      .post<CompanySubscription>(`${this.apiUrl}/${subscriptionId}/cancel`, {
        reason,
      })
      .pipe(
        tap((subscription) => {
          this.currentSubscriptionSubject.next(subscription);
        }),
      );
  }

  /**
   * Vérifier si l'entreprise a une souscription active
   */
  hasActiveSubscription(): boolean {
    const subscription = this.currentSubscriptionSubject.value;
    return subscription !== null && subscription.status === "ACTIVE";
  }

  /**
   * Vérifier si l'entreprise peut effectuer une action
   */
  canPerformAction(action: string): { allowed: boolean; reason?: string } {
    const subscription = this.currentSubscriptionSubject.value;

    if (!subscription || subscription.status !== "ACTIVE") {
      return {
        allowed: false,
        reason: "Aucune souscription active. Veuillez souscrire à un plan.",
      };
    }

    const { plan } = subscription;

    switch (action) {
      case "create_job_offer":
        if (
          plan.maxActiveJobOffers !== null &&
          plan.maxActiveJobOffers !== -1 &&
          subscription.currentActiveJobOffers >= plan.maxActiveJobOffers
        ) {
          return {
            allowed: false,
            reason: `Limite d'offres actives atteinte (${plan.maxActiveJobOffers}). Mettez à niveau votre plan.`,
          };
        }
        break;

      case "access_cv_database":
        if (!plan.canAccessCVDatabase) {
          return {
            allowed: false,
            reason:
              "Accès à la base de CV non disponible avec votre plan actuel.",
          };
        }
        break;

      case "export_data":
        if (!plan.canExportData) {
          return {
            allowed: false,
            reason: "Export de données non disponible avec votre plan actuel.",
          };
        }
        break;

      case "access_analytics":
        if (!plan.canUseAnalytics) {
          return {
            allowed: false,
            reason: "Analytics non disponible avec votre plan actuel.",
          };
        }
        break;
    }

    return { allowed: true };
  }

  /**
   * Obtenir les statistiques de souscription
   */
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/overview`);
  }

  /**
   * Rafraîchir la souscription actuelle
   */
  refreshCurrentSubscription(recruiterId: string): void {
    this.getRecruiterSubscription(recruiterId).subscribe();
  }

  setCurrentUsage(partial: Partial<CompanySubscription>): void {
    const current = this.currentSubscriptionSubject.value;
    if (!current) return;

    const updated: CompanySubscription = {
      ...current,
      ...partial,
      plan: current.plan,
    };

    this.currentSubscriptionSubject.next(updated);
  }

  /**
   * Obtenir la souscription actuelle depuis le BehaviorSubject
   */
  getCurrentSubscription(): CompanySubscription | null {
    return this.currentSubscriptionSubject.value;
  }

  /**
   * Obtenir le rapport d'utilisation d'un recruteur
   */
  getUsageReport(recruiterId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recruiter/${recruiterId}/usage`);
  }

  /**
   * Construct a placeholder active subscription from the default plan response.
   * This is used while the recruiter subscription endpoint is not available.
   */
  private buildMockSubscriptionFromPlan(
    plan: SubscriptionPlan,
    recruiterId: string,
  ): CompanySubscription {
    const normalizedPlan: SubscriptionPlan = {
      ...plan,
      // Ensure price is numeric even if backend returns it as a string
      price: Number((plan as any).price) || 0,
    };

    return {
      id: `default-${plan.id}`,
      companyId: recruiterId,
      planId: plan.id,
      startDate: new Date().toISOString(),
      endDate: null,
      status: "ACTIVE",
      currentJobOffers: 0,
      currentActiveJobOffers: 0,
      currentApplications: 0,
      currentCompanies: 0,
      currentRecruiters: 0,
      currentMonthInterviews: 0,
      autoRenew: false,
      plan: normalizedPlan,
    };
  }

  /**
   * Activer/Désactiver les paiements pour un utilisateur
   */
  togglePaymentForUser(
    accountId: string,
    enablePayment: boolean,
  ): Observable<TogglePaymentResponse> {
    return this.http.post<TogglePaymentResponse>(
      `${this.apiUrl}/account/${accountId}/toggle-payment`,
      { enablePayment },
    );
  }

  /**
   * Obtenir le statut de paiement d'un utilisateur
   */
  getPaymentStatus(accountId: string): Observable<PaymentStatus> {
    return this.http.get<PaymentStatus>(
      `${this.apiUrl}/account/${accountId}/payment-status`,
    );
  }

  /**
   * Note: Les méthodes purchasePlan, confirmPayment et upgradePlan ont été supprimées
   * car le paiement PayPal se fait maintenant 100% côté frontend via le SDK PayPal.
   * Seul createSubscription() est utilisé pour enregistrer les résultats en base de données.
   */
}
