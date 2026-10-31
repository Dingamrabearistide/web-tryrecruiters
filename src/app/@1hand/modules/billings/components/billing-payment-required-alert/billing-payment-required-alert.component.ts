import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";

import { BillingAccessDeniedReason } from "../../access/billing-access.types";

@Component({
  selector: "app-billing-payment-required-alert",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./billing-payment-required-alert.component.html",
  styleUrls: ["./billing-payment-required-alert.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingPaymentRequiredAlertComponent {
  @Input() title = "Paiement requis";
  @Input() message = "Vous devez choisir un forfait pour continuer.";
  @Input() actionLabel = "Voir les forfaits";
  @Input() reason: BillingAccessDeniedReason | null = null;
  @Input() loading = false;

  @Output() readonly action = new EventEmitter<void>();
}
