import { Injectable } from "@angular/core";

declare var paypal: any;

export interface PayPalConfig {
  clientId: string;
  currency: string;
}

@Injectable({
  providedIn: "root",
})
export class PayPalService {
  private paypalLoaded = false;

  constructor() {}

  /**
   * Vérifie si le SDK PayPal est chargé
   */
  isPayPalLoaded(): boolean {
    return typeof paypal !== "undefined" && this.paypalLoaded;
  }

  /**
   * Attend que le SDK PayPal soit chargé
   */
  waitForPayPal(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isPayPalLoaded()) {
        resolve(true);
        return;
      }

      const checkPayPal = setInterval(() => {
        if (typeof paypal !== "undefined") {
          this.paypalLoaded = true;
          clearInterval(checkPayPal);
          resolve(true);
        }
      }, 100);

      // Timeout après 10 secondes
      setTimeout(() => {
        clearInterval(checkPayPal);
        resolve(false);
      }, 10000);
    });
  }

  /**
   * Crée un bouton PayPal dans un conteneur spécifique
   */
  async renderPayPalButton(
    containerId: string,
    amount: number,
    currency: string,
    description: string,
    onSuccess: (details: any) => void,
    onError?: (error: any) => void,
    onCancel?: () => void
  ): Promise<void> {
    const isLoaded = await this.waitForPayPal();
    if (!isLoaded) {
      console.error("PayPal SDK could not be loaded");
      if (onError) {
        onError({ message: "PayPal SDK not loaded" });
      }
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id ${containerId} not found`);
      return;
    }

    // Nettoyer le conteneur
    container.innerHTML = "";

    try {
      paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "pay",
            height: 45,
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: description,
                  amount: {
                    currency_code: currency,
                    value: amount.toFixed(2),
                  },
                },
              ],
              application_context: {
                shipping_preference: "NO_SHIPPING",
              },
            });
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const details = await actions.order.capture();
              console.log("Payment successful:", details);
              onSuccess(details);
            } catch (error) {
              console.error("Error capturing payment:", error);
              if (onError) {
                onError(error);
              }
            }
          },
          onError: (error: any) => {
            console.error("PayPal error:", error);
            if (onError) {
              onError(error);
            }
          },
          onCancel: () => {
            console.log("Payment cancelled by user");
            if (onCancel) {
              onCancel();
            }
          },
        })
        .render(`#${containerId}`);
    } catch (error) {
      console.error("Error rendering PayPal button:", error);
      if (onError) {
        onError(error);
      }
    }
  }

  /**
   * Convertit FCFA en USD (taux approximatif: 1 USD = 600 FCFA)
   */
  convertFcfaToUsd(amountFcfa: number): number {
    const exchangeRate = 600; // 1 USD ≈ 600 FCFA
    return Math.ceil((amountFcfa / exchangeRate) * 100) / 100; // Arrondi à 2 décimales
  }
}
