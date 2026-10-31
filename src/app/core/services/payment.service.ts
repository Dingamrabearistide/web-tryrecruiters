import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export interface PaymentOrder {
  orderId: string;
  status: string;
  approvalUrl: string;
  links: any[];
}

export interface CapturedPayment {
  orderId: string;
  status: string;
  captureId: string;
  amount: {
    currency_code: string;
    value: string;
  };
  payer: {
    email_address: string;
    payer_id: string;
  };
  createTime: string;
  updateTime: string;
  metadata?: any;
}

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  /**
   * Créer un ordre de paiement PayPal
   */
  createPaymentOrder(data: {
    amount: number;
    currency: string;
    description: string;
    returnUrl?: string;
    cancelUrl?: string;
    metadata?: any;
  }): Observable<PaymentOrder> {
    return this.http.post<PaymentOrder>(`${this.apiUrl}/create-order`, data);
  }

  /**
   * Capturer un paiement après approbation
   */
  capturePayment(orderId: string): Observable<CapturedPayment> {
    return this.http.post<CapturedPayment>(`${this.apiUrl}/capture-order`, {
      orderId,
    });
  }

  /**
   * Obtenir les détails d'une commande
   */
  getOrderDetails(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/order/${orderId}`);
  }

  /**
   * Rediriger vers PayPal pour le paiement
   */
  redirectToPayPal(approvalUrl: string): void {
    window.location.href = approvalUrl;
  }
}
