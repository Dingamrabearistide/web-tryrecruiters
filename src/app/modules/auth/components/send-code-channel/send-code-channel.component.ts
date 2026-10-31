import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NotificationChannel } from "../../auth.types";

@Component({
  selector: "app-send-code-channel",
  templateUrl: "./send-code-channel.component.html",
  styleUrls: ["./send-code-channel.component.scss", "../../../../../styles/legacy-styles.css"],
  standalone: false,
})
export class SendCodeChannelComponent {
  SMS_CHANNEL: NotificationChannel = NotificationChannel.SMS;
  WHATSAPP_CHANNEL: NotificationChannel = NotificationChannel.WHATSAPP;
  EMAIL_CHANNEL: NotificationChannel = NotificationChannel.EMAIL;

  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() errorMessage = "";
  @Input() titleKey?: string;

  @Output() channelSelected = new EventEmitter<NotificationChannel>();

  selectedMethod: NotificationChannel | null = null;

  selectMethod(method: NotificationChannel) {
    this.selectedMethod = method;
    this.channelSelected.emit(method);
  }
}
