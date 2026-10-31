import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  selector: "app-read-more",
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: "./read-more.component.html",
  styleUrls: ["./read-more.component.scss"],
})
export class ReadMoreComponent implements OnInit {
  @Input() text: string = "";
  @Input() maxLength: number = 100; // Longueur par défaut
  @Output() expanded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public truncatedText: string = "";
  public isTruncated: boolean = true;

  constructor() {}

  ngOnInit(): void {
    // Supprime les balises HTML pour un calcul de longueur plus précis
    const plainText = this.text.replace(/<[^>]*>/g, "");
    if (plainText.length > this.maxLength) {
      this.truncatedText = plainText.substring(0, this.maxLength) + "...";
    } else {
      this.truncatedText = this.text;
      this.isTruncated = false; // Pas besoin de bouton si le texte est court
    }
  }

  toggleView(): void {
    this.isTruncated = !this.isTruncated;
    this.expanded.emit(!this.isTruncated);
  }
}
